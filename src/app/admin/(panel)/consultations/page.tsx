import { CalendarClock, Clock, Mail, Phone, Trash2, Video } from "lucide-react";
import type { Metadata } from "next";
import { deleteConsultation } from "@/app/actions/admin";
import { ConfirmForm } from "@/components/admin/client-ui";
import { ConsultationEditor } from "@/components/admin/consultation-editor";
import { buildHref, Card, ConsultationStatusBadge, EmptyState, FilterTabs, PageHeader } from "@/components/admin/ui";
import { FormAlert } from "@/components/ui/field";
import { WhatsAppIcon } from "@/components/ui/social-icons";
import { requireAdmin } from "@/lib/auth";
import { mapConsultation } from "@/lib/data/mappers";
import { formatDate, timeAgo } from "@/lib/format";
import { consultationModes, consultationStatusMeta } from "@/lib/options";
import { createClient } from "@/lib/supabase/server";
import type { ConsultationStatus } from "@/lib/types";

export const metadata: Metadata = { title: "Consultations" };

/** Today's date in Lagos (UTC+1), as YYYY-MM-DD. */
function lagosToday() {
  return new Date(Date.now() + 3600_000).toISOString().slice(0, 10);
}

function waNumber(phone: string) {
  const d = phone.replace(/\D/g, "");
  return d.startsWith("0") && d.length === 11 ? `234${d.slice(1)}` : d;
}

export default async function ConsultationsPage({ searchParams }: PageProps<"/admin/consultations">) {
  await requireAdmin();
  const sp = await searchParams;
  const raw = Array.isArray(sp.status) ? sp.status[0] : sp.status;
  const status = raw && raw in consultationStatusMeta ? (raw as ConsultationStatus) : undefined;

  const supabase = await createClient();
  let query = supabase
    .from("consultations")
    .select("*")
    .order("preferred_date", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false })
    .limit(200);
  if (status) query = query.eq("status", status);
  const [{ data, error }, all] = await Promise.all([query, supabase.from("consultations").select("status").limit(5000)]);
  const items = (data ?? []).map(mapConsultation);
  const counts = (all.data ?? []).reduce<Record<string, number>>((acc, r) => {
    acc[r.status as string] = (acc[r.status as string] ?? 0) + 1;
    return acc;
  }, {});
  const today = lagosToday();

  return (
    <>
      <PageHeader title="Consultations" description="Bookings made through the website's consultation form." />

      <FilterTabs
        items={[
          { href: "/admin/consultations", label: "All", count: all.data?.length ?? 0, active: !status },
          ...(Object.keys(consultationStatusMeta) as ConsultationStatus[]).map((s) => ({
            href: buildHref("/admin/consultations", { status: s }),
            label: consultationStatusMeta[s].label,
            count: counts[s] ?? 0,
            active: status === s,
          })),
        ]}
      />

      {error ? (
        <div className="mt-4">
          <FormAlert>Couldn&apos;t load bookings: {error.message}</FormAlert>
        </div>
      ) : items.length === 0 ? (
        <Card className="mt-4">
          <EmptyState icon={CalendarClock} title="No bookings here" body="New consultation requests will appear in this list." />
        </Card>
      ) : (
        <ul className="mt-4 grid gap-3">
          {items.map((c) => {
            const upcoming = c.preferredDate && c.preferredDate >= today;
            return (
              <li key={c.id}>
                <Card className="p-4 sm:p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex gap-4">
                      <div className="grid w-16 shrink-0 place-items-center rounded-2xl bg-navy-50 py-2 text-center">
                        {c.preferredDate ? (
                          <>
                            <span className="text-[0.65rem] font-bold text-aqua-700 uppercase">
                              {formatDate(c.preferredDate, { month: "short" })}
                            </span>
                            <span className="text-2xl leading-none font-extrabold text-navy-800">
                              {formatDate(c.preferredDate, { day: "numeric" })}
                            </span>
                          </>
                        ) : (
                          <CalendarClock className="h-6 w-6 text-navy-600" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold text-ink">{c.fullName}</p>
                          <ConsultationStatusBadge status={c.status} />
                          {upcoming && c.status !== "cancelled" && (
                            <span className="text-[0.68rem] font-semibold text-aqua-700">Upcoming</span>
                          )}
                        </div>
                        <p className="mt-0.5 text-sm text-body">{c.service}</p>
                        <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {c.preferredTime ?? "Any time"}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Video className="h-3 w-3" />
                            {consultationModes.find((m) => m.value === c.mode)?.label ?? c.mode}
                          </span>
                          <span className="font-mono">{c.reference}</span>
                          <span>{timeAgo(c.createdAt)}</span>
                        </p>
                        {c.message && <p className="mt-2 text-sm whitespace-pre-wrap text-body">{c.message}</p>}
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-1.5">
                      <a href={`tel:${c.phone}`} aria-label="Call" title={c.phone} className="grid h-9 w-9 place-items-center rounded-xl ring-1 ring-line hover:bg-surface">
                        <Phone className="h-4 w-4 text-navy-700" />
                      </a>
                      <a
                        href={`https://wa.me/${waNumber(c.phone)}?text=${encodeURIComponent(`Hello ${c.fullName.split(" ")[0]}, this is Valueconnect Consulting about your consultation booking ${c.reference}.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="WhatsApp"
                        className="grid h-9 w-9 place-items-center rounded-xl ring-1 ring-line hover:bg-surface"
                      >
                        <WhatsAppIcon className="h-4 w-4 text-navy-700" />
                      </a>
                      <a
                        href={`mailto:${c.email}?subject=${encodeURIComponent(`Your consultation booking ${c.reference}`)}`}
                        aria-label="Email"
                        title={c.email}
                        className="grid h-9 w-9 place-items-center rounded-xl ring-1 ring-line hover:bg-surface"
                      >
                        <Mail className="h-4 w-4 text-navy-700" />
                      </a>
                      <ConfirmForm
                        action={deleteConsultation.bind(null, c.id)}
                        message={`Delete the booking from ${c.fullName}?`}
                        buttonClassName="grid h-9 w-9 place-items-center rounded-xl text-red-600 ring-1 ring-line hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" aria-label="Delete" />
                      </ConfirmForm>
                    </div>
                  </div>
                  <div className="mt-4 border-t border-line pt-4">
                    <ConsultationEditor id={c.id} status={c.status} notes={c.adminNotes} />
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
