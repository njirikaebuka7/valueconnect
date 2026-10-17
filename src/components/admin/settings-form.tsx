"use client";

import { Check, Save } from "lucide-react";
import { useActionState, useTransition, type ReactNode } from "react";
import { saveSiteSettings } from "@/app/actions/admin";
import { buttonClass } from "@/components/ui/button";
import { Field, FormAlert, Input, Textarea } from "@/components/ui/field";
import { socialNetworks, type ContactSettings } from "@/lib/site";

function Section({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-line sm:p-6">
      <h2 className="text-[0.95rem] font-bold">{title}</h2>
      <p className="mt-0.5 text-xs text-muted">{description}</p>
      <div className="mt-5 grid gap-5 sm:grid-cols-2">{children}</div>
    </section>
  );
}

export function SettingsForm({ settings }: { settings: ContactSettings }) {
  const [state, action, pending] = useActionState(saveSiteSettings, null);
  const [, startTransition] = useTransition();
  const errors = state && !state.ok ? state.fieldErrors : undefined;

  const text = (name: keyof ContactSettings, label: string, opts: { required?: boolean; hint?: string; type?: string; placeholder?: string } = {}) => (
    <Field label={label} name={name} required={opts.required} error={errors?.[name]} hint={opts.hint}>
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
      className="max-w-3xl space-y-5 pb-24 lg:pb-10"
    >
      {state && (state.ok ? (
        <FormAlert tone="success">
          <span className="flex items-center gap-2">
            <Check className="h-4 w-4" /> {state.message}
          </span>
        </FormAlert>
      ) : (
        <FormAlert>{state.error}</FormAlert>
      ))}

      <Section title="Contact details" description="Shown in the header, footer, contact page, property pages and emails.">
        <Field label="Office address" name="address" required error={errors?.address} className="sm:col-span-2">
          <Textarea name="address" defaultValue={settings.address} invalid={Boolean(errors?.address)} className="min-h-20" />
        </Field>
        {text("phone_1", "Main phone", { required: true, type: "tel", hint: "Used for every “Call” button." })}
        {text("phone_2", "Second phone", { type: "tel", hint: "Optional." })}
        {text("whatsapp", "WhatsApp number", { type: "tel", hint: "Leave empty to use the main phone." })}
        {text("email", "Email", { required: true, type: "email" })}
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
