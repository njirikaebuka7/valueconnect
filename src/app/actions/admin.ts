"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { detailRows, emailEnabled, emailLayout, esc, sendEmail } from "@/lib/email";
import { formatDateTime, formatNaira, slugify } from "@/lib/format";
import { valuationPurposeLabel, valuationStatusMeta } from "@/lib/options";
import { getContact, SETTINGS_TAG } from "@/lib/settings";
import { site, socialNetworks, type SocialKey } from "@/lib/site";
import { supabaseKey, supabaseUrl } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import type {
  ActionResult,
  ConsultationStatus,
  MessageStatus,
  PropertyStatus,
  ValuationStatus,
} from "@/lib/types";

const BUCKET = "property-images";

function entries(formData: FormData) {
  const obj: Record<string, string> = {};
  formData.forEach((value, key) => {
    if (typeof value === "string") obj[key] = value;
  });
  return obj;
}

function fieldErrors(error: z.ZodError) {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    out[key] ??= issue.message;
  }
  return out;
}

/** "₦ 1,250,000" → 1250000; empty → null. */
function parseAmount(v: string | undefined) {
  const digits = (v ?? "").replace(/[^\d]/g, "");
  return digits ? Number(digits) : null;
}

/** datetime-local values are entered in Lagos time (UTC+1, no DST). */
function lagosLocalToIso(v: string | undefined) {
  if (!v) return null;
  const d = new Date(`${v.length === 16 ? `${v}:00` : v}+01:00`);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

function revalidateProperty(slug?: string | null) {
  revalidatePath("/admin/properties");
  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/properties");
  if (slug) revalidatePath(`/properties/${slug}`);
}

function storagePathFromUrl(url: string) {
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const i = url.indexOf(marker);
  return i === -1 ? null : decodeURIComponent(url.slice(i + marker.length).split("?")[0]);
}

// ---------------------------------------------------------------------------
// Session
// ---------------------------------------------------------------------------

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

// ---------------------------------------------------------------------------
// Properties
// ---------------------------------------------------------------------------

const optionalInt = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v ? Number(v) : null))
  .refine((v) => v === null || (Number.isInteger(v) && v >= 0 && v < 1000), "Enter a whole number");

const propertySchema = z.object({
  id: z.string().trim().optional().default(""),
  title: z.string().trim().min(3, "Give the property a title").max(160),
  slug: z.string().trim().max(80).optional().default(""),
  listing_type: z.enum(["sale", "rent", "shortlet", "lease"]),
  property_type: z.enum([
    "detached",
    "semi-detached",
    "terrace",
    "duplex",
    "apartment",
    "penthouse",
    "bungalow",
    "land",
    "office",
    "commercial",
    "warehouse",
  ]),
  status: z.enum(["available", "under_offer", "sold", "let"]),
  price: z.string().optional().transform(parseAmount),
  price_period: z.enum(["", "year", "month", "night"]).optional().default(""),
  price_on_request: z.boolean(),
  state: z.string().trim().min(1, "Choose a state").max(60),
  city: z.string().trim().min(1, "Enter the city").max(80),
  area: z.string().trim().max(80).optional().default(""),
  address: z.string().trim().max(300).optional().default(""),
  bedrooms: optionalInt,
  bathrooms: optionalInt,
  toilets: optionalInt,
  parking: optionalInt,
  size_sqm: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v ? Number(v.replace(/,/g, "")) : null))
    .refine((v) => v === null || (Number.isFinite(v) && v >= 0), "Enter a valid size"),
  title_document: z.string().trim().max(80).optional().default(""),
  description: z.string().trim().max(6000).optional().default(""),
  features: z.array(z.string().trim().min(1).max(60)).max(40),
  images: z.array(z.string().trim().url("Invalid image URL").max(1000)).max(24),
  featured: z.boolean(),
  published: z.boolean(),
  verified: z.boolean(),
});

function parseJsonArray(v: string | undefined) {
  try {
    const arr = JSON.parse(v ?? "[]");
    return Array.isArray(arr) ? arr.map(String) : [];
  } catch {
    return [];
  }
}

export async function saveProperty(
  _prev: ActionResult<{ id: string; slug: string }> | null,
  formData: FormData,
): Promise<ActionResult<{ id: string; slug: string }>> {
  await requireAdmin();
  const raw = entries(formData);
  const parsed = propertySchema.safeParse({
    ...raw,
    price_on_request: raw.price_on_request === "on",
    featured: raw.featured === "on",
    published: raw.published === "on",
    verified: raw.verified === "on",
    features: parseJsonArray(raw.features),
    images: parseJsonArray(raw.images),
  });
  if (!parsed.success) {
    return { ok: false, error: "Please check the highlighted fields.", fieldErrors: fieldErrors(parsed.error) };
  }
  const v = parsed.data;
  if (!v.price_on_request && !v.price) {
    return { ok: false, error: "Enter a price, or tick “Price on request”.", fieldErrors: { price: "Enter a price" } };
  }

  const supabase = await createClient();

  // Unique slug: base, base-2, base-3…
  const base = slugify(v.slug || v.title) || "property";
  const { data: taken } = await supabase.from("properties").select("id, slug").like("slug", `${base}%`);
  const used = new Set((taken ?? []).filter((r) => r.id !== v.id).map((r) => r.slug as string));
  let slug = base;
  for (let i = 2; used.has(slug); i++) slug = `${base}-${i}`;

  const row = {
    slug,
    title: v.title,
    listing_type: v.listing_type,
    property_type: v.property_type,
    status: v.status,
    price: v.price ?? 0,
    price_period: v.listing_type === "sale" || !v.price_period ? null : v.price_period,
    price_on_request: v.price_on_request,
    state: v.state,
    city: v.city,
    area: v.area,
    address: v.address,
    bedrooms: v.bedrooms,
    bathrooms: v.bathrooms,
    toilets: v.toilets,
    parking: v.parking,
    size_sqm: v.size_sqm,
    title_document: v.title_document || null,
    description: v.description,
    features: Array.from(new Set(v.features)),
    images: v.images,
    featured: v.featured,
    published: v.published,
    verified: v.verified,
  };

  let previousSlug: string | null = null;
  let id = v.id;
  if (id) {
    const { data: prev } = await supabase.from("properties").select("slug").eq("id", id).maybeSingle();
    previousSlug = (prev?.slug as string) ?? null;
    const { error } = await supabase.from("properties").update(row).eq("id", id);
    if (error) return { ok: false, error: `Couldn't save: ${error.message}` };
  } else {
    const { data, error } = await supabase.from("properties").insert(row).select("id").single();
    if (error || !data) return { ok: false, error: `Couldn't create the listing: ${error?.message ?? "unknown error"}` };
    id = String(data.id);
  }

  revalidateProperty(slug);
  if (previousSlug && previousSlug !== slug) revalidatePath(`/properties/${previousSlug}`);
  revalidatePath(`/admin/properties/${id}`);

  if (!v.id) redirect(`/admin/properties/${id}?created=1`);
  return { ok: true, data: { id, slug }, message: "Listing saved." };
}

export async function deleteProperty(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { data } = await supabase.from("properties").select("slug, images").eq("id", id).maybeSingle();
  const { error } = await supabase.from("properties").delete().eq("id", id);
  if (error) throw new Error(error.message);

  const paths = ((data?.images as string[]) ?? []).map(storagePathFromUrl).filter((p): p is string => Boolean(p));
  if (paths.length) await supabase.storage.from(BUCKET).remove(paths);

  revalidateProperty(data?.slug as string | undefined);
  redirect("/admin/properties?deleted=1");
}

export async function togglePropertyFlag(id: string, flag: "published" | "featured", value: boolean) {
  await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("properties")
    .update({ [flag]: value })
    .eq("id", id)
    .select("slug")
    .maybeSingle();
  if (error) throw new Error(error.message);
  revalidateProperty(data?.slug as string | undefined);
}

export async function setPropertyStatus(id: string, status: PropertyStatus) {
  await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase.from("properties").update({ status }).eq("id", id).select("slug").maybeSingle();
  if (error) throw new Error(error.message);
  revalidateProperty(data?.slug as string | undefined);
}

// ---------------------------------------------------------------------------
// Valuation requests
// ---------------------------------------------------------------------------

const statuses = Object.keys(valuationStatusMeta) as [ValuationStatus, ...ValuationStatus[]];

const respondSchema = z.object({
  id: z.uuid(),
  status: z.enum(statuses),
  quote_amount: z.string().optional().transform(parseAmount),
  inspection_date: z.string().optional().transform(lagosLocalToIso),
  message: z.string().trim().max(4000).optional().default(""),
  send_email: z.boolean(),
});

export async function respondToValuation(
  _prev: ActionResult<{ emailed: boolean }> | null,
  formData: FormData,
): Promise<ActionResult<{ emailed: boolean }>> {
  const admin = await requireAdmin();
  const raw = entries(formData);
  const parsed = respondSchema.safeParse({ ...raw, send_email: raw.send_email === "on" });
  if (!parsed.success) {
    return { ok: false, error: "Please check the highlighted fields.", fieldErrors: fieldErrors(parsed.error) };
  }
  const v = parsed.data;
  const supabase = await createClient();

  const { data: current, error: loadError } = await supabase
    .from("valuation_requests")
    .select("*")
    .eq("id", v.id)
    .maybeSingle();
  if (loadError || !current) return { ok: false, error: "This request no longer exists." };

  const statusChanged = current.status !== v.status;
  const hasMessage = v.message.length > 0;
  const quoteChanged = (current.quote_amount ?? null) !== v.quote_amount;
  const inspectionChanged =
    (current.inspection_date ? new Date(current.inspection_date).toISOString() : null) !== v.inspection_date;

  if (!statusChanged && !hasMessage && !quoteChanged && !inspectionChanged) {
    return { ok: false, error: "Nothing has changed. Update the status, quote, inspection date or write a message." };
  }

  const update: Record<string, unknown> = {
    status: v.status,
    quote_amount: v.quote_amount,
    inspection_date: v.inspection_date,
  };
  if (hasMessage) {
    update.admin_response = v.message;
    update.responded_at = new Date().toISOString();
  }
  const { error } = await supabase.from("valuation_requests").update(update).eq("id", v.id);
  if (error) return { ok: false, error: `Couldn't save: ${error.message}` };

  const events: Record<string, unknown>[] = [];
  if (statusChanged) {
    events.push({
      request_id: v.id,
      kind: "status",
      status: v.status,
      message: valuationStatusMeta[v.status].client,
      visible_to_client: true,
      actor: admin.email,
    });
  }
  if (hasMessage || quoteChanged || inspectionChanged) {
    const extras = [
      quoteChanged && v.quote_amount != null ? `Fee quote: ${formatNaira(v.quote_amount)}` : null,
      inspectionChanged && v.inspection_date ? `Inspection: ${formatDateTime(v.inspection_date)}` : null,
    ].filter(Boolean);
    events.push({
      request_id: v.id,
      kind: "response",
      status: v.status,
      message: [v.message, ...extras].filter(Boolean).join("\n"),
      visible_to_client: true,
      actor: admin.email,
    });
  }
  if (events.length) await supabase.from("request_events").insert(events);

  let emailed = false;
  if (v.send_email && emailEnabled) {
    const reference = String(current.reference);
    const trackUrl = `${site.url}/track?ref=${encodeURIComponent(reference)}`;
    const res = await sendEmail({
      to: String(current.email),
      replyTo: (await getContact()).email,
      subject: `Update on your valuation request ${reference}`,
      html: await emailLayout(
        valuationStatusMeta[v.status].client,
        `<p>Dear ${esc(String(current.full_name).split(" ")[0])},</p>` +
          (hasMessage ? `<p style="white-space:pre-wrap">${esc(v.message)}</p>` : "") +
          detailRows([
            ["Reference", reference],
            ["Purpose", valuationPurposeLabel(String(current.purpose))],
            ["Property", `${current.address}, ${current.state}`],
            ["Status", valuationStatusMeta[v.status].label],
            ["Fee quote", v.quote_amount != null ? formatNaira(v.quote_amount) : null],
            ["Inspection", v.inspection_date ? formatDateTime(v.inspection_date) : null],
          ]) +
          `<p><a href="${trackUrl}" style="display:inline-block;background:#013398;color:#fff;padding:10px 18px;border-radius:10px;text-decoration:none;font-weight:bold">Track your request</a></p>`,
      ),
    });
    emailed = !res.skipped && Boolean(res.ok);
  }

  revalidatePath(`/admin/valuations/${v.id}`);
  revalidatePath("/admin/valuations");
  revalidatePath("/admin");
  return {
    ok: true,
    data: { emailed },
    message: emailed ? "Saved and emailed to the client." : "Saved. The client can see this on the Track page.",
  };
}

export async function saveInternalNote(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const admin = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const note = String(formData.get("note") ?? "").trim();
  if (!note) return { ok: false, error: "Write a note first.", fieldErrors: { note: "Write a note first" } };
  if (note.length > 4000) return { ok: false, error: "That note is too long." };

  const supabase = await createClient();
  const { error } = await supabase.from("valuation_requests").update({ internal_notes: note }).eq("id", id);
  if (error) return { ok: false, error: `Couldn't save: ${error.message}` };
  await supabase.from("request_events").insert({
    request_id: id,
    kind: "note",
    message: note,
    visible_to_client: false,
    actor: admin.email,
  });
  revalidatePath(`/admin/valuations/${id}`);
  return { ok: true, message: "Note added." };
}

export async function deleteValuation(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("valuation_requests").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/valuations");
  revalidatePath("/admin");
  redirect("/admin/valuations?deleted=1");
}

// ---------------------------------------------------------------------------
// Consultations, inbox, subscribers
// ---------------------------------------------------------------------------

const consultationSchema = z.object({
  id: z.uuid(),
  status: z.enum(["new", "confirmed", "completed", "cancelled"]),
  admin_notes: z.string().trim().max(4000).optional().default(""),
});

export async function updateConsultation(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const parsed = consultationSchema.safeParse(entries(formData));
  if (!parsed.success) return { ok: false, error: "Couldn't read that update." };
  const v = parsed.data;
  const supabase = await createClient();
  const { error } = await supabase
    .from("consultations")
    .update({ status: v.status as ConsultationStatus, admin_notes: v.admin_notes || null })
    .eq("id", v.id);
  if (error) return { ok: false, error: `Couldn't save: ${error.message}` };
  revalidatePath("/admin/consultations");
  revalidatePath("/admin");
  return { ok: true, message: "Booking updated." };
}

export async function deleteConsultation(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("consultations").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/consultations");
  revalidatePath("/admin");
}

export async function updateMessageStatus(id: string, status: MessageStatus) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("messages").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/inbox");
  revalidatePath("/admin");
}

export async function deleteMessage(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("messages").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/inbox");
  revalidatePath("/admin");
}

export async function deleteSubscriber(email: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("subscribers").delete().eq("email", email);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/subscribers");
}

// ---------------------------------------------------------------------------
// Site settings (contact details and social links)
// ---------------------------------------------------------------------------

/** "instagram.com/x" → "https://instagram.com/x"; "@x" → the network's profile URL. */
function socialUrl(base: string) {
  return z
    .string()
    .trim()
    .max(300)
    .transform((v) => (!v ? "" : v.startsWith("@") ? `${base}${v.slice(1)}` : /^https?:\/\//i.test(v) ? v : `https://${v}`))
    .refine((v) => !v || z.url({ protocol: /^https?$/ }).safeParse(v).success, "Enter a full link, e.g. https://…");
}

const sitePhone = z
  .string()
  .trim()
  .max(30, "Enter a valid phone number")
  .regex(/^$|^[+\d][\d\s()-]{6,}$/, "Enter a valid phone number");

/** Repeated form fields (phones, phones, …) → a cleaned list with at least one entry. */
function listField(item: z.ZodType<string, string>, noun: string, max = 6) {
  return z
    .array(z.string())
    .transform((list) => list.map((v) => v.trim()).filter(Boolean))
    .pipe(
      z
        .array(item)
        .min(1, `Add at least one ${noun}`)
        .max(max, `Up to ${max} ${noun}s`)
        .refine((list) => new Set(list.map((v) => v.toLowerCase())).size === list.length, `That ${noun} is listed twice`),
    );
}

const settingsSchema = z.object({
  addresses: listField(z.string().min(10, "Enter the full address").max(300), "address", 4),
  phones: listField(sitePhone, "phone number"),
  emails: listField(z.string().toLowerCase().pipe(z.email("Enter a valid email address")), "email address", 4),
  whatsapp: sitePhone,
  ...(Object.fromEntries(socialNetworks.map((n) => [n.key, socialUrl(n.base)])) as Record<
    SocialKey,
    ReturnType<typeof socialUrl>
  >),
});

export async function saveSiteSettings(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const parsed = settingsSchema.safeParse({
    ...entries(formData),
    addresses: formData.getAll("addresses"),
    phones: formData.getAll("phones"),
    emails: formData.getAll("emails"),
  });
  if (!parsed.success) {
    return { ok: false, error: "Please check the highlighted fields.", fieldErrors: fieldErrors(parsed.error) };
  }
  const { addresses, phones, emails, ...rest } = parsed.data;
  const row = { addresses, phones, emails, ...Object.fromEntries(Object.entries(rest).map(([k, v]) => [k, v || null])) };
  const supabase = await createClient();
  const { error } = await supabase.from("site_settings").upsert({ id: 1, ...row });
  if (error) return { ok: false, error: `Couldn't save: ${error.message}` };
  // Contact details appear on every page.
  updateTag(SETTINGS_TAG);
  revalidatePath("/", "layout");
  return { ok: true, message: "Saved. The website now shows these details." };
}

// ---------------------------------------------------------------------------
// Admin password
// ---------------------------------------------------------------------------

const passwordSchema = z
  .object({
    current_password: z.string().min(1, "Enter your current password"),
    new_password: z.string().min(8, "Use at least 8 characters").max(72, "Use 72 characters or fewer"),
    confirm_password: z.string(),
  })
  .refine((v) => v.new_password === v.confirm_password, { path: ["confirm_password"], message: "The passwords don't match" })
  .refine((v) => v.new_password !== v.current_password, { path: ["new_password"], message: "Choose a different password" });

/** Changes the signed-in admin's password after checking the current one. No email is involved. */
export async function changePassword(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const admin = await requireAdmin();
  const parsed = passwordSchema.safeParse(entries(formData));
  if (!parsed.success) {
    return { ok: false, error: "Please check the highlighted fields.", fieldErrors: fieldErrors(parsed.error) };
  }
  const v = parsed.data;

  // Check the current password on a throwaway client so the signed-in session is untouched.
  const check = createSupabaseClient(supabaseUrl, supabaseKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { error: wrong } = await check.auth.signInWithPassword({ email: admin.email, password: v.current_password });
  if (wrong) {
    return { ok: false, error: "Your current password isn't right.", fieldErrors: { current_password: "That isn't your current password" } };
  }
  await check.auth.signOut({ scope: "local" });

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: v.new_password });
  if (error) return { ok: false, error: `Couldn't change the password: ${error.message}` };
  return { ok: true, message: "Password changed. Use the new one next time you sign in." };
}
