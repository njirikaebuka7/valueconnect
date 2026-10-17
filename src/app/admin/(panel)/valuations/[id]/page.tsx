import {
  Building2,
  CalendarClock,
  Eye,
  EyeOff,
  Lock,
  Mail,
  MessageSquareText,
  Phone,
  Trash2,
  UserRound,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteValuation } from "@/app/actions/admin";
import { ConfirmForm } from "@/components/admin/client-ui";
import { NoteForm } from "@/components/admin/note-form";
import { RespondForm } from "@/components/admin/respond-form";
import { Card, CardHeader, DetailList, PageHeader, ValuationStatusBadge } from "@/components/admin/ui";
import { Badge } from "@/components/ui/badge";
import { buttonClass } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/ui/social-icons";
import { requireAdmin } from "@/lib/auth";
import { mapRequestEvent, mapValuationRequest } from "@/lib/data/mappers";
import { emailEnabled } from "@/lib/email";
import { cn, formatDate, formatDateTime, formatNaira } from "@/lib/format";
import { valuationPurposeLabel, valuationStatusMeta } from "@/lib/options";
import { createClient } from "@/lib/supabase/server";
import type { ValuationStatus } from "@/lib/types";

export const metadata: Metadata = { title: "Valuation request" };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** 0814… → 234814… for wa.me links. */
function whatsappNumber(phone: string) {
  const d = phone.replace(/\D/g, "");
  if (d.startsWith("234")) return d;
  if (d.startsWith("0") && d.length === 11) return `234${d.slice(1)}`;
  return d;
}

const eventIcon = {
  created: MessageSquareText,
  status: CalendarClock,
  response: Mail,
  note: Lock,
} as const;

export default async function ValuationDetailPage({ params }: PageProps<"/admin/valuations/[id]">) {
  await requireAdmin();
  const { id } = await params;
  if (!UUID.test(id)) notFound();

  const supabase = await createClient();
  const [{ data }, { data: eventRows }] = await Promise.all([
    supabase.from("valuation_requests").select("*, properties(title, slug)").eq("id", id).maybeSingle(),
    supabase.from("request_events").select("*").eq("request_id", id).order("created_at", { ascending: false }),
  ]);
  if (!data) notFound();

  const r = mapValuationRequest(data);
  const linked = data.properties as { title: string; slug: string } | null;
  const events = (eventRows ?? []).map(mapRequestEvent);
  const firstName = r.fullName.split(" ")[0];
  const waText = `Hello ${firstName}, this is Valueconnect Consulting regarding your valuation request ${r.reference}.`;

  return (
    <>
      <PageHeader
        back={{ href: "/admin/valuations", label: "All requests" }}
        title={
          <span className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-xl sm:text-2xl">{r.reference}</span>
            <ValuationStatusBadge status={r.status} />
            {r.urgency === "express" && <Badge tone="amber">Express</Badge>}
          </span>
        }
        description={`Received ${formatDateTime(r.createdAt)} · ${valuationPurposeLabel(r.purpose)}`}
        actions={
          <>
            <a href={`tel:${r.phone}`} className={buttonClass("outline", "sm")}>
              <Phone className="h-4 w-4" /> Call
            </a>
            <a
              href={`https://wa.me/${whatsappNumber(r.phone)}?text=${encodeURIComponent(waText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClass("outline", "sm")}
            >
              <WhatsAppIcon className="h-4 w-4" /> WhatsApp
            </a>
            <a
              href={`mailto:${r.email}?subject=${encodeURIComponent(`Your valuation request ${r.reference}`)}`}
              className={buttonClass("primary", "sm")}
            >
              <Mail className="h-4 w-4" /> Email
            </a>
          </>
        }
      />

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_24rem] xl:grid-cols-[1fr_27rem]">
        <div className="grid gap-6">
          <Card>
            <CardHeader title="Client" icon={UserRound} />
            <DetailList
              rows={[
                ["Name", r.fullName],
                ["Email", <a key="e" href={`mailto:${r.email}`} className="text-navy-700 hover:underline">{r.email}</a>],
                ["Phone", <a key="p" href={`tel:${r.phone}`} className="text-navy-700 hover:underline">{r.phone}</a>],
                ["Company", r.company],
                ["Client type", r.clientType],
                ["Preferred contact", r.contactMethod],
              ]}
            />
          </Card>

          <Card>
            <CardHeader title="Property" icon={Building2} />
            <DetailList
              rows={[
                ["Purpose", valuationPurposeLabel(r.purpose)],
                ["Property type", r.propertyType],
                ["Address", r.address],
                ["City / State", [r.city, r.state].filter(Boolean).join(", ")],
                ["Land / plot size", r.landSize],
                ["Building details", r.buildingDetails],
                ["Title document", r.titleDocument],
                [
                  "Linked listing",
                  linked ? (
                    <Link key="l" href={`/properties/${linked.slug}`} target="_blank" className="text-navy-700 hover:underline">
                      {linked.title}
                    </Link>
                  ) : null,
                ],
              ]}
            />
          </Card>

          <Card>
            <CardHeader title="Scheduling & notes" icon={CalendarClock} />
            <DetailList
              rows={[
                ["Preferred inspection", r.preferredDate ? formatDate(r.preferredDate) : "No preference"],
                ["Turnaround", r.urgency === "express" ? "Express" : "Standard"],
                ["Fee quote", r.quoteAmount != null ? formatNaira(r.quoteAmount) : "Not quoted yet"],
                ["Inspection booked", r.inspectionDate ? formatDateTime(r.inspectionDate) : "Not booked yet"],
                ["Client's notes", r.notes ? <span key="n" className="whitespace-pre-wrap">{r.notes}</span> : null],
                ["Last response", r.adminResponse ? <span key="a" className="whitespace-pre-wrap">{r.adminResponse}</span> : null],
              ]}
            />
          </Card>

          <Card>
            <CardHeader title="Timeline" icon={MessageSquareText} />
            {events.length === 0 ? (
              <p className="px-5 py-6 text-sm text-muted">No activity yet.</p>
            ) : (
              <ol className="relative space-y-5 px-5 py-5">
                {events.map((e) => {
                  const Icon = eventIcon[e.kind] ?? MessageSquareText;
                  return (
                    <li key={e.id} className="relative flex gap-3">
                      <span
                        className={cn(
                          "grid h-8 w-8 shrink-0 place-items-center rounded-full ring-4 ring-white",
                          e.kind === "note" ? "bg-slate-100 text-slate-600" : "bg-navy-50 text-navy-700",
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold text-ink">
                            {e.kind === "created"
                              ? "Request received"
                              : e.kind === "status"
                                ? `Status → ${e.status ? valuationStatusMeta[e.status as ValuationStatus]?.label : ""}`
                                : e.kind === "response"
                                  ? "Update sent to client"
                                  : "Internal note"}
                          </p>
                          {e.visibleToClient ? (
                            <span className="inline-flex items-center gap-1 text-[0.68rem] font-semibold text-aqua-700">
                              <Eye className="h-3 w-3" /> Client can see
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[0.68rem] font-semibold text-muted">
                              <EyeOff className="h-3 w-3" /> Staff only
                            </span>
                          )}
                        </div>
                        {e.message && e.kind !== "created" && (
                          <p className="mt-1 text-sm whitespace-pre-wrap text-body">{e.message}</p>
                        )}
                        <p className="mt-1 text-xs text-muted">
                          {formatDateTime(e.createdAt)}
                          {e.actor && e.actor !== "client" ? ` · ${e.actor}` : ""}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}
          </Card>
        </div>

        <div className="grid gap-6 lg:sticky lg:top-6">
          <Card>
            <CardHeader title="Respond to client" icon={Mail} />
            <RespondForm
              id={r.id}
              status={r.status}
              quoteAmount={r.quoteAmount}
              inspectionDate={r.inspectionDate}
              emailEnabled={emailEnabled}
            />
          </Card>

          <Card>
            <CardHeader title="Internal notes" icon={Lock} />
            {r.internalNotes && (
              <p className="mx-5 mt-5 rounded-xl bg-surface p-3 text-sm whitespace-pre-wrap text-body">{r.internalNotes}</p>
            )}
            <NoteForm id={r.id} />
          </Card>

          <ConfirmForm
            action={deleteValuation.bind(null, r.id)}
            message={`Delete request ${r.reference}? This can't be undone.`}
            buttonClassName="inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-red-600 ring-1 ring-red-200 transition hover:bg-red-50"
            pendingText="Deleting…"
          >
            <Trash2 className="h-4 w-4" /> Delete request
          </ConfirmForm>
        </div>
      </div>
    </>
  );
}
