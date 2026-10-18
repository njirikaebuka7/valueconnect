"use client";

import { Check, KeyRound, Plus, Save, X } from "lucide-react";
import { useActionState, useState, useTransition, type ReactNode } from "react";
import { changePassword, saveSiteSettings } from "@/app/actions/admin";
import { SubmitButton } from "@/components/admin/client-ui";
import { buttonClass } from "@/components/ui/button";
import { Field, FormAlert, Input, inputClass } from "@/components/ui/field";
import { cn } from "@/lib/format";
import { socialNetworks, type ContactSettings, type SocialKey } from "@/lib/site";
import type { ActionResult } from "@/lib/types";

function Section({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-line sm:p-6">
      <h2 className="text-[0.95rem] font-bold">{title}</h2>
      <p className="mt-0.5 text-xs text-muted">{description}</p>
      <div className="mt-5 grid gap-5 sm:grid-cols-2">{children}</div>
    </section>
  );
}

function Result({ state }: { state: ActionResult | null }) {
  if (!state) return null;
  return state.ok ? (
    <FormAlert tone="success">
      <span className="flex items-center gap-2">
        <Check className="h-4 w-4" /> {state.message}
      </span>
    </FormAlert>
  ) : (
    <FormAlert>{state.error}</FormAlert>
  );
}

/** Editable list submitted as repeated fields; the first entry is the main one. */
function ListEditor({
  name,
  label,
  noun,
  hint,
  initial,
  max,
  error,
  type = "text",
  placeholder,
}: {
  name: string;
  label: string;
  noun: string;
  hint: string;
  initial: string[];
  max: number;
  error?: string;
  type?: string;
  placeholder?: string;
}) {
  const [rows, setRows] = useState(() =>
    (initial.length ? initial : [""]).map((value, i) => ({ id: `row-${i}`, value })),
  );
  const update = (id: string, value: string) => setRows((r) => r.map((row) => (row.id === id ? { ...row, value } : row)));
  const remove = (id: string) => setRows((r) => r.filter((row) => row.id !== id));
  const makeMain = (id: string) => setRows((r) => [...r.filter((row) => row.id === id), ...r.filter((row) => row.id !== id)]);
  const add = () => setRows((r) => [...r, { id: crypto.randomUUID(), value: "" }]);

  return (
    <fieldset className="sm:col-span-2">
      <legend className="text-sm font-semibold text-ink">{label}</legend>
      <p className="text-xs text-muted">{hint}</p>
      <ul className="mt-2.5 space-y-2">
        {rows.map((row, i) => (
          <li key={row.id} className="flex items-center gap-2">
            <input
              name={name}
              type={type}
              value={row.value}
              onChange={(e) => update(row.id, e.target.value)}
              placeholder={placeholder}
              aria-label={`${label} ${i + 1}`}
              aria-invalid={Boolean(error) || undefined}
              className={cn(inputClass, "h-11 min-w-0 flex-1")}
            />
            {i === 0 ? (
              <span className="w-[4.75rem] shrink-0 rounded-full bg-navy-50 py-1 text-center text-[0.68rem] font-bold tracking-wide text-navy-700 uppercase">
                Main
              </span>
            ) : (
              <button
                type="button"
                onClick={() => makeMain(row.id)}
                className="w-[4.75rem] shrink-0 rounded-full py-1 text-[0.72rem] font-semibold text-navy-700 ring-1 ring-line hover:bg-surface"
              >
                Make main
              </button>
            )}
            <button
              type="button"
              onClick={() => remove(row.id)}
              disabled={rows.length === 1}
              aria-label={`Remove ${noun} ${i + 1}`}
              title={rows.length === 1 ? `Keep at least one ${noun}` : `Remove ${noun}`}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted ring-1 ring-line transition hover:bg-red-50 hover:text-red-600 disabled:opacity-35 disabled:hover:bg-transparent disabled:hover:text-muted"
            >
              <X className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>
      {error && <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>}
      {rows.length < max && (
        <button
          type="button"
          onClick={add}
          className="mt-2.5 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold text-navy-700 ring-1 ring-line hover:bg-surface"
        >
          <Plus className="h-4 w-4" /> Add {noun}
        </button>
      )}
    </fieldset>
  );
}

export function SettingsForm({ settings }: { settings: ContactSettings }) {
  const [state, action, pending] = useActionState(saveSiteSettings, null);
  const [, startTransition] = useTransition();
  const errors = state && !state.ok ? state.fieldErrors : undefined;

  const text = (name: "whatsapp" | SocialKey, label: string, opts: { hint?: string; type?: string; placeholder?: string } = {}) => (
    <Field label={label} name={name} error={errors?.[name]} hint={opts.hint}>
      <Input
        name={name}
        type={opts.type ?? "text"}
        defaultValue={settings[name]}
        placeholder={opts.placeholder}
        invalid={Boolean(errors?.[name])}
      />
    </Field>
  );

  return (
    <form
      // Submitting manually keeps what was typed if validation fails.
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        startTransition(() => action(fd));
      }}
      className="space-y-5"
    >
      <Result state={state} />

      <Section title="Contact details" description="Shown in the header, footer, contact page, property pages and emails.">
        <ListEditor
          name="addresses"
          label="Office addresses"
          noun="address"
          hint="The main address is used for the map and directions."
          initial={settings.addresses}
          max={4}
          error={errors?.addresses}
          placeholder="Street, area, city"
        />
        <ListEditor
          name="phones"
          label="Phone numbers"
          noun="phone number"
          hint="The main number is used on every “Call” button."
          initial={settings.phones}
          max={6}
          error={errors?.phones}
          type="tel"
          placeholder="0814 483 3999"
        />
        <ListEditor
          name="emails"
          label="Email addresses"
          noun="email"
          hint="The main email is where client replies go."
          initial={settings.emails}
          max={4}
          error={errors?.emails}
          type="email"
          placeholder="info@valueconnect.com.ng"
        />
        {text("whatsapp", "WhatsApp number", { type: "tel", hint: "Leave empty to use the main phone number." })}
      </Section>

      <Section title="Social media" description="Paste the full page link or just the @handle. Leave a box empty to hide that icon.">
        {socialNetworks.map((n) => (
          <div key={n.key}>{text(n.key, n.label, { placeholder: `${n.base}…` })}</div>
        ))}
      </Section>

      <div className="flex justify-end">
        <button type="submit" disabled={pending} className={buttonClass("primary", "md")}>
          <Save className="h-4 w-4" /> {pending ? "Saving…" : "Save settings"}
        </button>
      </div>
    </form>
  );
}

export function PasswordForm({ email }: { email: string }) {
  const [state, action] = useActionState(changePassword, null);
  const errors = state && !state.ok ? state.fieldErrors : undefined;
  const field = (name: string, label: string, autoComplete: string, hint?: string) => (
    <Field label={label} name={name} error={errors?.[name]} hint={hint}>
      <Input name={name} type="password" autoComplete={autoComplete} required invalid={Boolean(errors?.[name])} />
    </Field>
  );
  return (
    // The form clears after each attempt, so passwords never linger on screen.
    <form action={action} className="space-y-5">
      <Result state={state} />
      <Section title="Your password" description={`Signed in as ${email}. The change takes effect immediately; no email is sent.`}>
        {/* Lets password managers save the new password against the right account. */}
        <input type="email" name="username" value={email} autoComplete="username" readOnly hidden />
        <div className="sm:col-span-2 sm:max-w-sm">{field("current_password", "Current password", "current-password")}</div>
        {field("new_password", "New password", "new-password", "At least 8 characters.")}
        {field("confirm_password", "Confirm new password", "new-password")}
      </Section>
      <div className="flex justify-end">
        <SubmitButton pendingText="Changing…">
          <KeyRound className="h-4 w-4" /> Change password
        </SubmitButton>
      </div>
    </form>
  );
}
