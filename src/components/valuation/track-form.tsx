"use client";

import {
  ArrowRight,
  CalendarDays,
  Check,
  CircleX,
  Loader2,
  Mail,
  MessageSquareText,
  Phone,
  ScanSearch,
} from "lucide-react";
import { useActionState } from "react";
import { trackValuationRequest } from "@/app/actions/public";
import { Badge, type Tone } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Field, FormAlert, Input } from "@/components/ui/field";
import { WhatsAppIcon } from "@/components/ui/social-icons";
import { cn, formatDate, formatDateTime, formatNaira } from "@/lib/format";
import { valuationFlow, valuationPurposeLabel, valuationStatusMeta } from "@/lib/options";
import { site, whatsappLink } from "@/lib/site";
import type { TrackedRequest } from "@/lib/types";

export function TrackForm({ initialReference }: { initialReference: string }) {
  const [state, action, pending] = useActionState(trackValuationRequest, null);
  const errors = state && !state.ok ? state.fieldErrors ?? {} : {};
  const result = state?.ok ? state.data : undefined;

  return (
    <div className="grid gap-6 lg:grid-cols-[400px_minmax(0,1fr)] lg:items-start lg:gap-8">
      <form
        action={action}
        className="rounded-[2rem] bg-white p-5 shadow-lift ring-1 ring-line/80 sm:p-7 lg:sticky lg:top-28"
        noValidate
      >
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-navy-700 text-white">
            <ScanSearch className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-lg font-extrabold">Find your request</h2>
            <p className="text-xs text-muted">Both fields must match your request.</p>
          </div>
        </div>
        <div className="mt-6 space-y-4">
          <Field label="Reference" name="reference" error={errors.reference} hint="Looks like VC-2610-4F7A2C" required>
            <Input
              name="reference"
              defaultValue={initialReference}
              placeholder="VC-XXXX-XXXXXX"
              autoCapitalize="characters"
              autoComplete="off"
              spellCheck={false}
              className="font-mono tracking-wider uppercase"
              invalid={!!errors.reference}
            />
          </Field>
          <Field label="Email address" name="email" error={errors.email} required>
            <Input name="email" type="email" inputMode="email" autoComplete="email" invalid={!!errors.email} />
          </Field>
          {state && !state.ok && !state.fieldErrors && <FormAlert>{state.error}</FormAlert>}
          <Button type="submit" variant="primary" size="lg" className="w-full" disabled={pending}>
            {pending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Checking…
              </>
            ) : (
              <>
                Check status <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </form>

      <div aria-live="polite">{result ? <TrackResult r={result} /> : <TrackHelp />}</div>
    </div>
  );
}

function TrackHelp() {
  return (
    <div className="rounded-[2rem] bg-white p-6 shadow-card ring-1 ring-line/80 sm:p-8">
      <h2 className="text-lg font-extrabold">Where&apos;s my reference?</h2>
      <ul className="mt-4 space-y-4">
        {[
          { icon: Check, title: "On your confirmation screen", body: "We show it straight after you submit a valuation request." },
          { icon: Mail, title: "In your confirmation email", body: "Search your inbox (and spam folder) for “Valueconnect”." },
          { icon: Phone, title: "Ask us", body: "Call or WhatsApp us with your name and property address and we'll find it." },
        ].map(({ icon: Icon, title, body }) => (
          <li key={title} className="flex gap-4">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-aqua-50 text-aqua-700">
              <Icon className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-sm font-bold text-ink">{title}</span>
              <span className="mt-0.5 block text-sm text-body">{body}</span>
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-7 rounded-2xl bg-surface p-5 sm:flex sm:items-center sm:justify-between sm:gap-6">
        <p className="text-sm text-body">Haven&apos;t requested a valuation yet?</p>
        <ButtonLink href="/valuation" variant="accent" className="mt-3 sm:mt-0">
          Request a valuation <ArrowRight className="h-4 w-4" />
        </ButtonLink>
      </div>
    </div>
  );
}

function TrackResult({ r }: { r: TrackedRequest }) {
  const meta = valuationStatusMeta[r.status];
  const cancelled = r.status === "cancelled";
  const current = valuationFlow.indexOf(r.status);
  const events = [...r.events].reverse();

  return (
    <div className="animate-fade-up space-y-5">
      <div className="bg-navy-mesh relative overflow-hidden rounded-[2rem] p-6 text-white shadow-lift sm:p-8">
        <div className="bg-grid-faint absolute inset-0 opacity-50" aria-hidden />
        <div className="relative">
          <p className="text-[0.68rem] font-bold tracking-[0.16em] text-aqua-300 uppercase">Reference</p>
          <div className="mt-1 flex flex-wrap items-center gap-3">
            <p className="font-mono text-2xl font-bold tracking-wider">{r.reference}</p>
            <Badge tone={meta.tone as Tone}>{meta.label}</Badge>
          </div>
          <h2 className="mt-4 text-xl font-extrabold text-white sm:text-2xl">
            {r.firstName ? `Hi ${r.firstName}, ` : ""}
            {meta.client.charAt(0).toLowerCase() + meta.client.slice(1)}.
          </h2>
          <p className="mt-1 text-sm text-navy-100/80">
            {valuationPurposeLabel(r.purpose)} · {r.propertyType} · {r.address}, {r.state.replace("FCT - ", "")}
          </p>
          <p className="mt-1 text-xs text-navy-100/60">
            Submitted {formatDate(r.createdAt)} · Last update {formatDateTime(r.updatedAt)}
          </p>
        </div>
      </div>

      {(r.quoteAmount != null || r.inspectionDate) && (
        <div className="grid gap-3 sm:grid-cols-2">
          {r.quoteAmount != null && (
            <div className="rounded-3xl bg-white p-5 shadow-card ring-1 ring-line/80">
              <p className="text-xs font-bold tracking-wider text-muted uppercase">Fee quote</p>
              <p className="mt-1 text-2xl font-extrabold text-navy-700">{formatNaira(r.quoteAmount)}</p>
              <p className="mt-1 text-xs text-muted">Confirmed in your engagement letter.</p>
            </div>
          )}
          {r.inspectionDate && (
            <div className="rounded-3xl bg-white p-5 shadow-card ring-1 ring-line/80">
              <p className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-muted uppercase">
                <CalendarDays className="h-3.5 w-3.5" /> Inspection
              </p>
              <p className="mt-1 text-lg font-extrabold text-ink">
                {formatDate(r.inspectionDate, { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
              </p>
              <p className="mt-0.5 text-sm text-body">
                {new Date(r.inspectionDate).toLocaleTimeString("en-NG", { hour: "numeric", minute: "2-digit" })}
              </p>
            </div>
          )}
        </div>
      )}

      {r.adminResponse && (
        <div className="rounded-3xl border-l-4 border-aqua-500 bg-aqua-50/70 p-5 ring-1 ring-aqua-100 sm:p-6">
          <p className="flex items-center gap-2 text-xs font-bold tracking-wider text-aqua-800 uppercase">
            <MessageSquareText className="h-4 w-4" /> Message from your valuer
          </p>
          <p className="mt-2 text-[0.95rem] leading-relaxed whitespace-pre-line text-ink">{r.adminResponse}</p>
          {r.respondedAt && <p className="mt-2 text-xs text-muted">{formatDateTime(r.respondedAt)}</p>}
        </div>
      )}

      <div className="rounded-[2rem] bg-white p-6 shadow-card ring-1 ring-line/80 sm:p-8">
        <h3 className="text-base font-extrabold">Progress</h3>
        {cancelled ? (
          <div className="mt-4 flex items-start gap-3 rounded-2xl bg-surface p-4">
            <CircleX className="mt-0.5 h-5 w-5 shrink-0 text-muted" />
            <p className="text-sm text-body">
              This request has been closed. If that&apos;s unexpected, please get in touch and quote your reference.
            </p>
          </div>
        ) : (
          <ol className="mt-5">
            {valuationFlow.map((status, i) => {
              const done = i < current || r.status === "completed";
              const active = i === current && r.status !== "completed";
              const last = i === valuationFlow.length - 1;
              return (
                <li key={status} className="relative flex gap-4 pb-6 last:pb-0">
                  {!last && (
                    <span
                      aria-hidden
                      className={cn("absolute top-8 bottom-0 left-[0.9rem] w-0.5", done ? "bg-aqua-500" : "bg-line")}
                    />
                  )}
                  <span className="relative grid h-7 w-7 shrink-0 place-items-center">
                    {active && <span className="absolute inset-0 animate-ping rounded-full bg-aqua-400/50" />}
                    <span
                      className={cn(
                        "relative grid h-7 w-7 place-items-center rounded-full text-xs font-bold",
                        done && "bg-aqua-500 text-navy-950",
                        active && "bg-navy-700 text-white",
                        !done && !active && "bg-surface text-muted ring-1 ring-line",
                      )}
                    >
                      {done ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : i + 1}
                    </span>
                  </span>
                  <div className="pt-0.5">
                    <p className={cn("text-sm font-bold", done || active ? "text-ink" : "text-muted")}>
                      {valuationStatusMeta[status].client}
                    </p>
                    {active && <p className="mt-0.5 text-xs font-semibold text-aqua-700">Current stage</p>}
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </div>

      {events.length > 0 && (
        <div className="rounded-[2rem] bg-white p-6 shadow-card ring-1 ring-line/80 sm:p-8">
          <h3 className="text-base font-extrabold">Updates</h3>
          <ul className="mt-4 divide-y divide-line">
            {events.map((e, i) => (
              <li key={i} className="flex gap-4 py-3.5 first:pt-0 last:pb-0">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-aqua-500" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink">
                    {e.message || (e.status ? valuationStatusMeta[e.status as keyof typeof valuationStatusMeta]?.client : "Update")}
                  </p>
                  <p className="mt-0.5 text-xs text-muted">{formatDateTime(e.createdAt)}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid gap-2 sm:grid-cols-2">
        <a
          href={whatsappLink(`Hello Valueconnect, I'm following up on valuation request ${r.reference}.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-aqua-500 text-sm font-semibold text-navy-950 transition hover:bg-aqua-400"
        >
          <WhatsAppIcon className="h-4 w-4" /> WhatsApp us
        </a>
        <a
          href={`tel:${site.phones[0].tel}`}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-white text-sm font-semibold text-navy-800 ring-1 ring-line transition hover:bg-navy-50"
        >
          <Phone className="h-4 w-4" /> Call {site.phones[0].display}
        </a>
      </div>
    </div>
  );
}
