"use client";

import { Building2, CalendarCheck, CheckCircle2, Copy, Phone, Video } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { submitConsultation } from "@/app/actions/public";
import { Button, ButtonLink } from "@/components/ui/button";
import { Field, FormAlert, Honeypot, Input, Select, Textarea } from "@/components/ui/field";
import { services } from "@/lib/content";
import { cn } from "@/lib/format";
import { consultationModes, consultationTimes } from "@/lib/options";

const modeIcons = { in_person: Building2, phone: Phone, video: Video } as const;

function isoDate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function ConsultationForm({ defaultService }: { defaultService?: string }) {
  const [state, action, pending] = useActionState(submitConsultation, null);
  const [minDate, setMinDate] = useState<string>();
  const [copied, setCopied] = useState(false);
  const errors = state && !state.ok ? state.fieldErrors ?? {} : {};

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- date depends on the visitor's clock
    setMinDate(isoDate(new Date()));
  }, []);

  if (state?.ok && state.data) {
    const reference = state.data.reference;
    return (
      <div className="animate-fade-up rounded-3xl bg-surface p-7 text-center ring-1 ring-line sm:p-10" role="status">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-aqua-500 text-navy-950 shadow-card">
          <CalendarCheck className="h-8 w-8" />
        </span>
        <h3 className="mt-6 text-2xl font-bold">Request received</h3>
        <p className="mx-auto mt-2 max-w-md text-sm">
          We&apos;ll call or email to confirm your slot. Keep your reference handy in case you need to reschedule.
        </p>
        <button
          type="button"
          onClick={() => {
            navigator.clipboard?.writeText(reference).then(() => setCopied(true));
          }}
          className="mx-auto mt-6 flex items-center gap-3 rounded-2xl bg-white px-5 py-3 font-mono text-lg font-bold tracking-wider text-navy-800 shadow-card ring-1 ring-line"
        >
          {reference}
          {copied ? <CheckCircle2 className="h-4 w-4 text-aqua-600" /> : <Copy className="h-4 w-4 text-muted" />}
        </button>
        {state.preview && (
          <p className="mx-auto mt-4 max-w-sm text-xs text-muted">
            Preview mode: the site isn&apos;t connected to its database yet, so this booking wasn&apos;t stored.
          </p>
        )}
        <div className="mt-7 flex flex-col justify-center gap-2.5 sm:flex-row">
          <ButtonLink href="/" variant="outline">
            Back to home
          </ButtonLink>
          <ButtonLink href="/valuation" variant="primary">
            Request a valuation
          </ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <form action={action} noValidate className="relative space-y-5">
      <Honeypot />
      {state && !state.ok && <FormAlert>{state.error}</FormAlert>}

      <Field label="What would you like to discuss?" name="service" required error={errors.service}>
        <Select name="service" required defaultValue={defaultService ?? ""} invalid={!!errors.service}>
          <option value="" disabled>
            Choose a service
          </option>
          {services.map((s) => (
            <option key={s.slug} value={s.title}>
              {s.title}
            </option>
          ))}
          <option value="General enquiry">General enquiry</option>
        </Select>
      </Field>

      <fieldset>
        <legend className="text-sm font-semibold text-ink">How should we meet?</legend>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {consultationModes.map((m, i) => {
            const Icon = modeIcons[m.value];
            return (
              <label key={m.value} className="cursor-pointer">
                <input type="radio" name="mode" value={m.value} defaultChecked={i === 0} className="peer sr-only" />
                <span className="flex h-full flex-col items-center gap-2 rounded-2xl bg-white p-3 text-center text-xs font-semibold text-body ring-1 ring-line transition peer-checked:bg-navy-700 peer-checked:text-white peer-checked:ring-navy-700 peer-focus-visible:ring-2 peer-focus-visible:ring-aqua-500 sm:p-4 sm:text-sm">
                  <Icon className="h-5 w-5" />
                  {m.label}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Preferred date" name="preferred_date" required error={errors.preferred_date}>
          <Input name="preferred_date" type="date" min={minDate} required invalid={!!errors.preferred_date} />
        </Field>
        <fieldset>
          <legend className="text-sm font-semibold text-ink">Preferred time</legend>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {consultationTimes.map((t, i) => (
              <label key={t} className="cursor-pointer">
                <input type="radio" name="preferred_time" value={t} defaultChecked={i === 1} className="peer sr-only" />
                <span
                  className={cn(
                    "inline-flex h-10 items-center rounded-xl bg-white px-3 text-sm font-semibold text-body ring-1 ring-line transition",
                    "peer-checked:bg-aqua-500 peer-checked:text-navy-950 peer-checked:ring-aqua-500 peer-focus-visible:ring-2 peer-focus-visible:ring-navy-500",
                  )}
                >
                  {t}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" name="full_name" required error={errors.full_name}>
          <Input name="full_name" autoComplete="name" required invalid={!!errors.full_name} placeholder="Tunde Bakare" />
        </Field>
        <Field label="Phone" name="phone" required error={errors.phone}>
          <Input name="phone" type="tel" autoComplete="tel" required invalid={!!errors.phone} placeholder="0803 000 0000" />
        </Field>
      </div>
      <Field label="Email" name="email" required error={errors.email}>
        <Input name="email" type="email" autoComplete="email" required invalid={!!errors.email} placeholder="you@example.com" />
      </Field>
      <Field label="Anything we should know?" name="message" error={errors.message} hint="Optional: property location, deadline, lender, etc.">
        <Textarea name="message" rows={4} invalid={!!errors.message} />
      </Field>

      <Button type="submit" variant="primary" size="lg" disabled={pending} className="w-full">
        {pending ? "Booking…" : "Request this slot"} <CalendarCheck className="h-4 w-4" />
      </Button>
      <p className="text-center text-xs text-muted">We&apos;ll confirm by phone or email before your consultation.</p>
    </form>
  );
}
