"use server";

import { after } from "next/server";
import { z } from "zod";
import { adminInbox, detailRows, emailLayout, esc, sendEmail } from "@/lib/email";
import { valuationPurposeLabel } from "@/lib/options";
import { site } from "@/lib/site";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createPublicClient } from "@/lib/supabase/public";
import type { ActionResult, TrackedRequest } from "@/lib/types";

const phone = z
  .string()
  .trim()
  .min(7, "Enter a valid phone number")
  .max(30, "Enter a valid phone number")
  .regex(/^[+\d][\d\s()-]+$/, "Enter a valid phone number");
const email = z.string().trim().toLowerCase().pipe(z.email("Enter a valid email address")).pipe(z.string().max(160));
const name = z.string().trim().min(2, "Enter your full name").max(120);
const optional = (max: number) => z.string().trim().max(max).optional().default("");

function fieldErrors(error: z.ZodError) {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    out[key] ??= issue.message;
  }
  return out;
}

function invalid(error: z.ZodError): ActionResult<never> {
  return { ok: false, error: "Please check the highlighted fields.", fieldErrors: fieldErrors(error) };
}

/** Bots fill the hidden "website" field; real visitors never see it. */
function isBot(formData: FormData) {
  return String(formData.get("website") ?? "").length > 0;
}

function entries(formData: FormData) {
  const obj: Record<string, string> = {};
  formData.forEach((value, key) => {
    if (typeof value === "string") obj[key] = value;
  });
  return obj;
}

function previewReference(prefix: string) {
  const d = new Date();
  const yymm = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}`;
  return `${prefix}-${yymm}-${Math.random().toString(16).slice(2, 8).toUpperCase()}`;
}

const genericError = "We couldn't send that just now. Please try again, or call us on " + site.phones[0].display + ".";

// ---------------------------------------------------------------------------
// Valuation request
// ---------------------------------------------------------------------------

const valuationSchema = z.object({
  full_name: name,
  email,
  phone,
  company: optional(160),
  client_type: optional(60),
  property_type: z.string().trim().min(1, "Choose the type of property").max(60),
  purpose: z.string().trim().min(1, "Choose why you need the valuation").max(60),
  state: z.string().trim().min(1, "Choose a state").max(60),
  city: optional(80),
  address: z.string().trim().min(5, "Enter the property address").max(300),
  land_size: optional(80),
  building_details: optional(600),
  title_document: optional(80),
  property_id: optional(64),
  preferred_date: z
    .string()
    .trim()
    .optional()
    .default("")
    .refine((v) => !v || !Number.isNaN(Date.parse(v)), "Choose a valid date"),
  urgency: z.enum(["standard", "express"]).optional().default("standard"),
  contact_method: optional(30),
  notes: optional(2000),
});

export async function submitValuationRequest(
  _prev: ActionResult<{ reference: string }> | null,
  formData: FormData,
): Promise<ActionResult<{ reference: string }>> {
  if (isBot(formData)) return { ok: true, data: { reference: previewReference("VC") } };
  const parsed = valuationSchema.safeParse(entries(formData));
  if (!parsed.success) return invalid(parsed.error);
  const v = parsed.data;

  if (!isSupabaseConfigured) {
    return { ok: true, data: { reference: previewReference("VC") }, preview: true };
  }

  const { data: reference, error } = await createPublicClient().rpc("submit_valuation_request", { payload: v });
  if (error || !reference) {
    console.error("submit_valuation_request", error?.message);
    return { ok: false, error: genericError };
  }

  after(async () => {
    const purpose = valuationPurposeLabel(v.purpose);
    await sendEmail({
      to: adminInbox,
      replyTo: v.email,
      subject: `New valuation request ${reference} · ${purpose}`,
      html: emailLayout(
        `New valuation request ${reference}`,
        detailRows([
          ["Client", v.full_name],
          ["Email", v.email],
          ["Phone", v.phone],
          ["Company", v.company],
          ["Client type", v.client_type],
          ["Purpose", purpose],
          ["Property type", v.property_type],
          ["Address", `${v.address}${v.city ? `, ${v.city}` : ""}, ${v.state}`],
          ["Land size", v.land_size],
          ["Title document", v.title_document],
          ["Preferred inspection", v.preferred_date],
          ["Urgency", v.urgency],
          ["Notes", v.notes],
        ]) + `<p><a href="${site.url}/admin/valuations" style="color:#1c3aa6">Open in the admin dashboard →</a></p>`,
      ),
    });
    await sendEmail({
      to: v.email,
      subject: `We've received your valuation request (${reference})`,
      html: emailLayout(
        "Your valuation request is in",
        `<p>Dear ${esc(v.full_name.split(" ")[0])},</p>
         <p>Thank you for instructing Valueconnect Consulting. A registered valuer will review your request and send you a written fee quote and proposed inspection date.</p>
         <p>Your reference is <strong>${esc(reference)}</strong>. You can follow progress at any time at
         <a href="${site.url}/track?ref=${encodeURIComponent(reference)}" style="color:#1c3aa6">${site.url.replace(/^https?:\/\//, "")}/track</a>.</p>
         <p>To speed things up, reply to this email with copies of your title document and survey plan.</p>`,
      ),
      replyTo: adminInbox,
    });
  });

  return { ok: true, data: { reference } };
}

// ---------------------------------------------------------------------------
// Track a request
// ---------------------------------------------------------------------------

const trackSchema = z.object({
  reference: z.string().trim().min(6, "Enter your reference, e.g. VC-2610-4F7A2C").max(40),
  email,
});

export async function trackValuationRequest(
  _prev: ActionResult<TrackedRequest> | null,
  formData: FormData,
): Promise<ActionResult<TrackedRequest>> {
  const parsed = trackSchema.safeParse(entries(formData));
  if (!parsed.success) return invalid(parsed.error);

  if (!isSupabaseConfigured) {
    return {
      ok: false,
      error: "Request tracking goes live once the site is connected to its database. Please call or WhatsApp us for an update.",
    };
  }

  const { data, error } = await createPublicClient().rpc("track_valuation_request", {
    p_reference: parsed.data.reference,
    p_email: parsed.data.email,
  });
  if (error) {
    console.error("track_valuation_request", error.message);
    return { ok: false, error: genericError };
  }
  if (!data) {
    return { ok: false, error: "We couldn't find a request with that reference and email. Check both and try again." };
  }
  const r = data as Record<string, unknown>;
  return {
    ok: true,
    data: {
      reference: String(r.reference),
      status: r.status as TrackedRequest["status"],
      firstName: String(r.full_name ?? ""),
      propertyType: String(r.property_type ?? ""),
      purpose: String(r.purpose ?? ""),
      address: String(r.address ?? ""),
      state: String(r.state ?? ""),
      urgency: (r.urgency as TrackedRequest["urgency"]) ?? "standard",
      quoteAmount: r.quote_amount == null ? null : Number(r.quote_amount),
      inspectionDate: (r.inspection_date as string) ?? null,
      adminResponse: (r.admin_response as string) ?? null,
      respondedAt: (r.responded_at as string) ?? null,
      createdAt: String(r.created_at),
      updatedAt: String(r.updated_at),
      events: ((r.events as Record<string, unknown>[]) ?? []).map((e) => ({
        kind: String(e.kind),
        status: (e.status as string) ?? null,
        message: (e.message as string) ?? null,
        createdAt: String(e.created_at),
      })),
    },
  };
}

// ---------------------------------------------------------------------------
// Consultation booking
// ---------------------------------------------------------------------------

const consultationSchema = z.object({
  full_name: name,
  email,
  phone,
  service: z.string().trim().min(1, "Choose a service").max(80),
  mode: z.enum(["in_person", "phone", "video"]).optional().default("in_person"),
  preferred_date: z
    .string()
    .trim()
    .min(1, "Choose a date")
    .refine((v) => !Number.isNaN(Date.parse(v)), "Choose a valid date"),
  preferred_time: optional(20),
  message: optional(2000),
});

export async function submitConsultation(
  _prev: ActionResult<{ reference: string }> | null,
  formData: FormData,
): Promise<ActionResult<{ reference: string }>> {
  if (isBot(formData)) return { ok: true, data: { reference: previewReference("BK") } };
  const parsed = consultationSchema.safeParse(entries(formData));
  if (!parsed.success) return invalid(parsed.error);
  const v = parsed.data;

  if (!isSupabaseConfigured) {
    return { ok: true, data: { reference: previewReference("BK") }, preview: true };
  }

  const { data: reference, error } = await createPublicClient().rpc("submit_consultation", { payload: v });
  if (error || !reference) {
    console.error("submit_consultation", error?.message);
    return { ok: false, error: genericError };
  }

  after(async () => {
    await sendEmail({
      to: adminInbox,
      replyTo: v.email,
      subject: `Consultation booking ${reference} · ${v.service}`,
      html: emailLayout(
        `New consultation booking ${reference}`,
        detailRows([
          ["Client", v.full_name],
          ["Email", v.email],
          ["Phone", v.phone],
          ["Service", v.service],
          ["Mode", v.mode.replace("_", " ")],
          ["Preferred date", v.preferred_date],
          ["Preferred time", v.preferred_time],
          ["Message", v.message],
        ]),
      ),
    });
    await sendEmail({
      to: v.email,
      replyTo: adminInbox,
      subject: `Consultation request received (${reference})`,
      html: emailLayout(
        "Thanks, we'll confirm your slot shortly",
        `<p>Dear ${esc(v.full_name.split(" ")[0])},</p><p>We've received your request for a ${esc(v.service)} consultation on ${esc(v.preferred_date)}${v.preferred_time ? ` at ${esc(v.preferred_time)}` : ""}. Our team will call or email to confirm.</p><p>Reference: <strong>${esc(reference)}</strong></p>`,
      ),
    });
  });

  return { ok: true, data: { reference } };
}

// ---------------------------------------------------------------------------
// Contact form and property enquiries
// ---------------------------------------------------------------------------

const messageSchema = z.object({
  kind: z.enum(["contact", "enquiry"]).optional().default("contact"),
  full_name: name,
  email,
  phone: z.union([z.literal(""), phone]).optional().default(""),
  subject: optional(160),
  message: z.string().trim().min(5, "Tell us a little more").max(4000),
  property_id: optional(64),
  property_title: optional(160),
});

export async function submitMessage(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  if (isBot(formData)) return { ok: true };
  const parsed = messageSchema.safeParse(entries(formData));
  if (!parsed.success) return invalid(parsed.error);
  const v = parsed.data;

  if (!isSupabaseConfigured) return { ok: true, preview: true };

  const { property_title, ...payload } = v;
  const { error } = await createPublicClient().rpc("submit_message", { payload });
  if (error) {
    console.error("submit_message", error.message);
    return { ok: false, error: genericError };
  }

  after(async () => {
    await sendEmail({
      to: adminInbox,
      replyTo: v.email,
      subject: v.kind === "enquiry" ? `Property enquiry · ${property_title || "listing"}` : `Website message · ${v.subject || v.full_name}`,
      html: emailLayout(
        v.kind === "enquiry" ? "New property enquiry" : "New website message",
        detailRows([
          ["Name", v.full_name],
          ["Email", v.email],
          ["Phone", v.phone],
          ["Property", property_title],
          ["Subject", v.subject],
        ]) + `<p style="white-space:pre-wrap">${esc(v.message)}</p>`,
      ),
    });
  });

  return { ok: true };
}

// ---------------------------------------------------------------------------
// Newsletter
// ---------------------------------------------------------------------------

export async function subscribeNewsletter(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  if (isBot(formData)) return { ok: true };
  const parsed = z.object({ email }).safeParse(entries(formData));
  if (!parsed.success) return invalid(parsed.error);
  if (!isSupabaseConfigured) return { ok: true, preview: true };

  const { error } = await createPublicClient().rpc("subscribe_newsletter", { p_email: parsed.data.email });
  if (error) {
    console.error("subscribe_newsletter", error.message);
    return { ok: false, error: genericError };
  }
  return { ok: true };
}
