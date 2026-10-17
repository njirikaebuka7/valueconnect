"use client";

import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CalendarDays,
  Check,
  ClipboardList,
  FileText,
  Loader2,
  Pencil,
  UserRound,
  X,
  Zap,
} from "lucide-react";
import { useActionState, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { submitValuationRequest } from "@/app/actions/public";
import { Button } from "@/components/ui/button";
import { Field, FormAlert, Honeypot, Input, Select, Textarea } from "@/components/ui/field";
import { Photo } from "@/components/ui/photo";
import { requiredDocuments } from "@/lib/content";
import { cn, formatDate } from "@/lib/format";
import {
  clientTypes,
  nigerianStates,
  titleDocuments,
  valuationAssetTypes,
  valuationPurposeLabel,
  valuationPurposes,
} from "@/lib/options";
import { ValuationSuccess } from "./valuation-success";

export interface WizardProperty {
  id: string;
  slug: string;
  title: string;
  image: string | null;
  place: string;
}

export interface WizardInitial {
  purpose: string;
  property_type: string;
  state: string;
  city: string;
  address: string;
  land_size: string;
  title_document: string;
}

type Values = WizardInitial & {
  building_details: string;
  full_name: string;
  email: string;
  phone: string;
  company: string;
  client_type: string;
  contact_method: string;
  preferred_date: string;
  urgency: "standard" | "express";
  notes: string;
  consent: boolean;
};

type Errors = Partial<Record<keyof Values | "form", string>>;

const steps = [
  { label: "Asset", icon: Building2 },
  { label: "Your details", icon: UserRound },
  { label: "Inspection", icon: CalendarDays },
  { label: "Review", icon: ClipboardList },
] as const;

const fieldStep: Record<string, number> = {
  purpose: 0,
  property_type: 0,
  state: 0,
  city: 0,
  address: 0,
  land_size: 0,
  building_details: 0,
  title_document: 0,
  property_id: 0,
  full_name: 1,
  email: 1,
  phone: 1,
  company: 1,
  client_type: 1,
  contact_method: 1,
  preferred_date: 2,
  urgency: 2,
  notes: 2,
};

const contactMethods = ["Phone call", "WhatsApp", "Email"] as const;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^[+\d][\d\s()-]{6,}$/;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function validate(step: number, v: Values, minDate: string): Errors {
  const e: Errors = {};
  if (step === 0) {
    if (!v.purpose) e.purpose = "Choose why you need the valuation";
    if (!v.property_type) e.property_type = "Choose the type of property";
    if (!v.state) e.state = "Choose a state";
    if (v.address.trim().length < 5) e.address = "Enter the property address";
  }
  if (step === 1) {
    if (v.full_name.trim().length < 2) e.full_name = "Enter your full name";
    if (!EMAIL.test(v.email.trim())) e.email = "Enter a valid email address";
    if (!PHONE.test(v.phone.trim())) e.phone = "Enter a valid phone number";
  }
  if (step === 2) {
    if (v.preferred_date && v.preferred_date < minDate) e.preferred_date = "Choose a date from tomorrow onwards";
  }
  if (step === 3) {
    if (!v.consent) e.consent = "Please confirm so we can contact you";
  }
  return e;
}

export function ValuationWizard({
  initial,
  property,
  minDate,
}: {
  initial: WizardInitial;
  property: WizardProperty | null;
  minDate: string;
}) {
  const [state, formAction, pending] = useActionState(submitValuationRequest, null);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Errors>({});
  const [linked, setLinked] = useState(property);
  const [values, setValues] = useState<Values>({
    ...initial,
    building_details: "",
    full_name: "",
    email: "",
    phone: "",
    company: "",
    client_type: "Individual",
    contact_method: "Phone call",
    preferred_date: "",
    urgency: "standard",
    notes: "",
    consent: false,
  });
  const topRef = useRef<HTMLDivElement>(null);

  // When the server rejects fields, jump back to the first step that holds one.
  const [handled, setHandled] = useState(state);
  if (state !== handled) {
    setHandled(state);
    if (state && !state.ok && state.fieldErrors) {
      const fe = state.fieldErrors;
      setErrors(fe as Errors);
      const first = Math.min(...Object.keys(fe).map((k) => fieldStep[k] ?? 3));
      setStep(Number.isFinite(first) ? first : 3);
    }
  }

  if (state?.ok && state.data) {
    return <ValuationSuccess reference={state.data.reference} preview={Boolean(state.preview)} />;
  }

  const set = <K extends keyof Values>(key: K, value: Values[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const scrollTop = () => topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const goTo = (n: number) => {
    setStep(n);
    scrollTop();
  };

  const next = () => {
    const e = validate(step, values, minDate);
    if (Object.keys(e).length) {
      setErrors(e);
      const first = Object.keys(e)[0];
      requestAnimationFrame(() => document.getElementsByName(first)[0]?.focus());
      return;
    }
    goTo(Math.min(step + 1, steps.length - 1));
  };

  const onKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
    const target = e.target as HTMLElement;
    if (e.key === "Enter" && step < steps.length - 1 && target.tagName !== "TEXTAREA" && target.tagName !== "BUTTON") {
      e.preventDefault();
      next();
    }
  };

  const err = (k: keyof Values) => errors[k];
  const serverError = state && !state.ok && !state.fieldErrors ? state.error : null;

  return (
    <div ref={topRef} className="scroll-mt-24">
      {/* Progress */}
      <div className="flex items-center justify-between gap-2">
        {steps.map((s, i) => {
          const done = i < step;
          const active = i === step;
          return (
            <button
              key={s.label}
              type="button"
              disabled={i > step}
              onClick={() => i < step && goTo(i)}
              className="group flex flex-1 flex-col items-center gap-1.5 text-center disabled:cursor-default sm:flex-row sm:gap-2.5 sm:text-left"
              aria-current={active ? "step" : undefined}
            >
              <span
                className={cn(
                  "grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-bold transition",
                  done && "bg-aqua-500 text-navy-950",
                  active && "bg-navy-700 text-white shadow-[0_0_0_5px_rgb(1_51_152/0.12)]",
                  !done && !active && "bg-surface text-muted ring-1 ring-line",
                )}
              >
                {done ? <Check className="h-4 w-4" strokeWidth={3} /> : <s.icon className="h-4 w-4" />}
              </span>
              <span
                className={cn(
                  "text-[0.7rem] font-semibold sm:text-sm",
                  active ? "text-ink" : done ? "text-navy-700" : "text-muted",
                )}
              >
                {s.label}
              </span>
            </button>
          );
        })}
      </div>
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-surface">
        <div
          className="h-full rounded-full bg-gradient-to-r from-navy-700 to-aqua-500 transition-all duration-500"
          style={{ width: `${((step + 1) / steps.length) * 100}%` }}
        />
      </div>

      <form
        action={formAction}
        onKeyDown={onKeyDown}
        onSubmit={(e) => {
          const all = [0, 1, 2, 3].reduce<Errors>((acc, n) => ({ ...acc, ...validate(n, values, minDate) }), {});
          if (step !== steps.length - 1 || Object.keys(all).length) {
            e.preventDefault();
            if (Object.keys(all).length) {
              setErrors(all);
              const first = Math.min(...Object.keys(all).map((k) => fieldStep[k] ?? 3));
              goTo(first);
            }
          }
        }}
        className="relative mt-8"
        noValidate
      >
        <Honeypot />
        {linked && UUID.test(linked.id) && <input type="hidden" name="property_id" value={linked.id} />}

        {/* Step 1: property */}
        <fieldset hidden={step !== 0} className="animate-fade-up space-y-6">
          <StepTitle
            title="What are we valuing, and why?"
            subtitle="The purpose decides the basis of value, so it matters as much as the property."
          />

          {linked && (
            <div className="flex items-center gap-3 rounded-2xl bg-surface p-3 ring-1 ring-line">
              <div className="relative h-14 w-16 shrink-0 overflow-hidden rounded-xl bg-navy-950">
                <Photo src={linked.image} alt="" fill sizes="64px" className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[0.7rem] font-bold tracking-wider text-aqua-700 uppercase">Linked listing</p>
                <p className="truncate text-sm font-bold text-ink">{linked.title}</p>
                <p className="truncate text-xs text-muted">{linked.place}</p>
              </div>
              <button
                type="button"
                onClick={() => setLinked(null)}
                aria-label="Unlink this listing"
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-muted hover:bg-white hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          <fieldset>
            <legend className="text-sm font-semibold text-ink">
              Purpose of valuation <span className="text-aqua-600">*</span>
            </legend>
            <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
              {valuationPurposes.map((p) => {
                const checked = values.purpose === p.value;
                return (
                  <label
                    key={p.value}
                    className={cn(
                      "relative flex cursor-pointer items-start gap-3 rounded-2xl border p-3.5 transition",
                      checked
                        ? "border-navy-700 bg-navy-50/70 shadow-[0_0_0_3px_rgb(1_51_152/0.08)]"
                        : "border-line bg-white hover:border-navy-200",
                    )}
                  >
                    <input
                      type="radio"
                      name="purpose"
                      value={p.value}
                      checked={checked}
                      onChange={() => set("purpose", p.value)}
                      className="peer sr-only"
                    />
                    <span
                      className={cn(
                        "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 transition peer-focus-visible:ring-4 peer-focus-visible:ring-aqua-500/25",
                        checked ? "border-navy-700 bg-navy-700" : "border-line",
                      )}
                    >
                      {checked && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                    </span>
                    <span>
                      <span className="block text-sm font-bold text-ink">{p.label}</span>
                      <span className="mt-0.5 block text-xs text-muted">{p.hint}</span>
                    </span>
                  </label>
                );
              })}
            </div>
            {err("purpose") && <p className="mt-2 text-xs font-medium text-red-600">{err("purpose")}</p>}
          </fieldset>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="What needs valuing?" name="property_type" error={err("property_type")} required>
              <Select
                name="property_type"
                value={values.property_type}
                onChange={(e) => set("property_type", e.target.value)}
                invalid={!!err("property_type")}
              >
                <option value="">Select a type</option>
                {valuationAssetTypes.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </Select>
            </Field>
            <Field label="Title document" name="title_document" hint="Not sure? Choose the last option.">
              <Select name="title_document" value={values.title_document} onChange={(e) => set("title_document", e.target.value)}>
                <option value="">Select a document</option>
                {titleDocuments.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </Select>
            </Field>
            <Field label="State" name="state" error={err("state")} required>
              <Select name="state" value={values.state} onChange={(e) => set("state", e.target.value)} invalid={!!err("state")}>
                <option value="">Select a state</option>
                {nigerianStates.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </Select>
            </Field>
            <Field label="City / area" name="city">
              <Input
                name="city"
                value={values.city}
                onChange={(e) => set("city", e.target.value)}
                placeholder="e.g. Lekki Phase 1"
                autoComplete="address-level2"
              />
            </Field>
          </div>
          <Field label="Address or location" name="address" error={err("address")} required>
            <Input
              name="address"
              value={values.address}
              onChange={(e) => set("address", e.target.value)}
              placeholder="House number, street and nearest landmark"
              autoComplete="street-address"
              invalid={!!err("address")}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Land size" name="land_size" hint="e.g. 600sqm, 1 plot, 2 acres">
              <Input name="land_size" value={values.land_size} onChange={(e) => set("land_size", e.target.value)} />
            </Field>
            <Field label="Building details" name="building_details" hint="e.g. 5-bed detached duplex with BQ">
              <Input
                name="building_details"
                value={values.building_details}
                onChange={(e) => set("building_details", e.target.value)}
              />
            </Field>
          </div>
        </fieldset>

        {/* Step 2: client */}
        <fieldset hidden={step !== 1} className="animate-fade-up space-y-6">
          <StepTitle title="Who should we send the quote to?" subtitle="We'll use these details for your fee quote and inspection." />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name" name="full_name" error={err("full_name")} required className="sm:col-span-2">
              <Input
                name="full_name"
                value={values.full_name}
                onChange={(e) => set("full_name", e.target.value)}
                autoComplete="name"
                invalid={!!err("full_name")}
              />
            </Field>
            <Field label="Email address" name="email" error={err("email")} required>
              <Input
                name="email"
                type="email"
                inputMode="email"
                value={values.email}
                onChange={(e) => set("email", e.target.value)}
                autoComplete="email"
                invalid={!!err("email")}
              />
            </Field>
            <Field label="Phone number" name="phone" error={err("phone")} required>
              <Input
                name="phone"
                type="tel"
                inputMode="tel"
                value={values.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="0801 234 5678"
                autoComplete="tel"
                invalid={!!err("phone")}
              />
            </Field>
          </div>

          <ChipRadio
            legend="You are…"
            name="client_type"
            options={clientTypes}
            value={values.client_type}
            onChange={(v) => set("client_type", v)}
          />

          {values.client_type !== "Individual" && (
            <Field label="Organisation name" name="company">
              <Input name="company" value={values.company} onChange={(e) => set("company", e.target.value)} autoComplete="organization" />
            </Field>
          )}
          {values.client_type === "Individual" && <input type="hidden" name="company" value="" />}

          <ChipRadio
            legend="Best way to reach you"
            name="contact_method"
            options={contactMethods}
            value={values.contact_method}
            onChange={(v) => set("contact_method", v)}
          />
        </fieldset>

        {/* Step 3: inspection */}
        <fieldset hidden={step !== 2} className="animate-fade-up space-y-6">
          <StepTitle title="When can we inspect?" subtitle="We'll confirm an exact slot when we send your quote." />
          <Field
            label="Preferred inspection date"
            name="preferred_date"
            error={err("preferred_date")}
            hint="Optional. Weekdays work best."
          >
            <Input
              name="preferred_date"
              type="date"
              min={minDate}
              value={values.preferred_date}
              onChange={(e) => set("preferred_date", e.target.value)}
              invalid={!!err("preferred_date")}
            />
          </Field>

          <fieldset>
            <legend className="text-sm font-semibold text-ink">How soon do you need the report?</legend>
            <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
              {(
                [
                  {
                    value: "standard",
                    title: "Standard",
                    body: "Delivery date confirmed in your quote once we've reviewed your documents.",
                    icon: CalendarDays,
                  },
                  {
                    value: "express",
                    title: "Express",
                    body: "Prioritised inspection and reporting. Subject to availability; the fee may differ.",
                    icon: Zap,
                  },
                ] as const
              ).map((o) => {
                const checked = values.urgency === o.value;
                return (
                  <label
                    key={o.value}
                    className={cn(
                      "flex cursor-pointer gap-3 rounded-2xl border p-4 transition",
                      checked ? "border-navy-700 bg-navy-50/70" : "border-line hover:border-navy-200",
                    )}
                  >
                    <input
                      type="radio"
                      name="urgency"
                      value={o.value}
                      checked={checked}
                      onChange={() => set("urgency", o.value)}
                      className="peer sr-only"
                    />
                    <span
                      className={cn(
                        "grid h-10 w-10 shrink-0 place-items-center rounded-xl transition peer-focus-visible:ring-4 peer-focus-visible:ring-aqua-500/25",
                        checked ? "bg-navy-700 text-white" : "bg-surface text-navy-600",
                      )}
                    >
                      <o.icon className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block text-sm font-bold text-ink">{o.title}</span>
                      <span className="mt-0.5 block text-xs leading-relaxed text-muted">{o.body}</span>
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <Field label="Anything else we should know?" name="notes" hint="Lender name, access arrangements, deadlines…">
            <Textarea name="notes" rows={4} value={values.notes} onChange={(e) => set("notes", e.target.value)} />
          </Field>

          <div className="rounded-2xl bg-surface p-4 ring-1 ring-line/70">
            <p className="flex items-center gap-2 text-sm font-bold text-ink">
              <FileText className="h-4 w-4 text-aqua-600" /> Documents to have ready
            </p>
            <ul className="mt-3 space-y-2">
              {requiredDocuments.slice(0, 5).map((d) => (
                <li key={d} className="flex gap-2 text-xs leading-relaxed text-body">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-aqua-600" strokeWidth={3} />
                  {d}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-muted">Copies are fine to start. You can send them after we reply.</p>
          </div>
        </fieldset>

        {/* Step 4: review */}
        <fieldset hidden={step !== 3} className="animate-fade-up space-y-5">
          <StepTitle title="Check and send" subtitle="Review your request. You can edit any section before sending." />
          <ReviewGroup title="Asset" onEdit={() => goTo(0)}>
            <ReviewRow label="Purpose" value={values.purpose ? valuationPurposeLabel(values.purpose) : ""} />
            <ReviewRow label="Type" value={values.property_type} />
            <ReviewRow
              label="Address"
              value={[values.address, values.city, values.state].filter(Boolean).join(", ")}
            />
            <ReviewRow label="Title" value={values.title_document} />
            <ReviewRow label="Land size" value={values.land_size} />
            <ReviewRow label="Building" value={values.building_details} />
            {linked && <ReviewRow label="Listing" value={linked.title} />}
          </ReviewGroup>
          <ReviewGroup title="Your details" onEdit={() => goTo(1)}>
            <ReviewRow label="Name" value={values.full_name} />
            <ReviewRow label="Email" value={values.email} />
            <ReviewRow label="Phone" value={values.phone} />
            <ReviewRow label="Client" value={[values.client_type, values.company].filter(Boolean).join(" · ")} />
            <ReviewRow label="Contact by" value={values.contact_method} />
          </ReviewGroup>
          <ReviewGroup title="Inspection" onEdit={() => goTo(2)}>
            <ReviewRow
              label="Preferred date"
              value={values.preferred_date ? formatDate(values.preferred_date, { weekday: "short", day: "numeric", month: "short", year: "numeric" }) : "Flexible"}
            />
            <ReviewRow label="Urgency" value={values.urgency === "express" ? "Express" : "Standard"} />
            <ReviewRow label="Notes" value={values.notes} />
          </ReviewGroup>

          <label
            className={cn(
              "flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition",
              err("consent") ? "border-red-300 bg-red-50/50" : "border-line",
            )}
          >
            <input
              type="checkbox"
              name="consent"
              checked={values.consent}
              onChange={(e) => set("consent", e.target.checked)}
              className="mt-0.5 h-5 w-5 shrink-0 accent-navy-700"
            />
            <span className="text-sm leading-relaxed text-body">
              I agree to be contacted about this request and to Valueconnect&apos;s{" "}
              <a href="/privacy" target="_blank" className="font-semibold text-navy-700 underline">
                privacy policy
              </a>
              .
            </span>
          </label>
          {err("consent") && <p className="-mt-3 text-xs font-medium text-red-600">{err("consent")}</p>}
        </fieldset>

        {serverError && (
          <div className="mt-6">
            <FormAlert>{serverError}</FormAlert>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between gap-3 border-t border-line pt-6">
          {step > 0 ? (
            <Button variant="ghost" onClick={() => goTo(step - 1)}>
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
          ) : (
            <span className="text-xs text-muted">Takes about 2 minutes</span>
          )}
          {step < steps.length - 1 ? (
            <Button variant="primary" size="lg" onClick={next}>
              Continue <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button type="submit" variant="accent" size="lg" disabled={pending}>
              {pending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Sending…
                </>
              ) : (
                <>
                  Send request <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

function StepTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <h2 className="text-xl font-extrabold sm:text-2xl">{title}</h2>
      <p className="mt-1 text-sm text-body">{subtitle}</p>
    </div>
  );
}

function ChipRadio<T extends string>({
  legend,
  name,
  options,
  value,
  onChange,
}: {
  legend: string;
  name: string;
  options: readonly T[];
  value: string;
  onChange: (v: T) => void;
}) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold text-ink">{legend}</legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((o) => {
          const checked = value === o;
          return (
            <label
              key={o}
              className={cn(
                "inline-flex h-10 cursor-pointer items-center rounded-full px-4 text-sm font-semibold transition has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-aqua-500/25",
                checked ? "bg-navy-700 text-white" : "bg-surface text-body ring-1 ring-line hover:ring-navy-200",
              )}
            >
              <input type="radio" name={name} value={o} checked={checked} onChange={() => onChange(o)} className="sr-only" />
              {checked && <Check className="mr-1.5 h-3.5 w-3.5" strokeWidth={3} />}
              {o}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function ReviewGroup({ title, onEdit, children }: { title: string; onEdit: () => void; children: ReactNode }) {
  return (
    <section className="rounded-2xl bg-surface p-4 ring-1 ring-line/70 sm:p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-extrabold text-ink">{title}</h3>
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold text-navy-700 hover:bg-white"
        >
          <Pencil className="h-3 w-3" /> Edit
        </button>
      </div>
      <dl className="mt-3 space-y-2">{children}</dl>
    </section>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="grid grid-cols-[7rem_1fr] gap-3 text-sm">
      <dt className="text-muted">{label}</dt>
      <dd className="font-medium break-words text-ink">{value}</dd>
    </div>
  );
}
