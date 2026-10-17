"use client";

import { CheckCircle2, Send } from "lucide-react";
import { useActionState } from "react";
import { submitMessage } from "@/app/actions/public";
import { Button } from "@/components/ui/button";
import { Field, FormAlert, Honeypot, Input, Textarea } from "@/components/ui/field";

export function ContactForm() {
  const [state, action, pending] = useActionState(submitMessage, null);
  const errors = state && !state.ok ? state.fieldErrors ?? {} : {};

  if (state?.ok) {
    return (
      <div className="animate-fade-up rounded-3xl bg-surface p-8 text-center ring-1 ring-line" role="status">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-aqua-500 text-navy-950">
          <CheckCircle2 className="h-7 w-7" />
        </span>
        <h3 className="mt-5 text-xl font-bold">Message sent, thank you</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm">
          Our team will get back to you shortly by email or phone.
        </p>
        {state.preview && (
          <p className="mx-auto mt-4 max-w-sm text-xs text-muted">
            Preview mode: the site isn&apos;t connected to its database yet, so this message wasn&apos;t stored.
          </p>
        )}
      </div>
    );
  }

  return (
    <form action={action} noValidate className="relative space-y-4">
      <Honeypot />
      <input type="hidden" name="kind" value="contact" />
      {state && !state.ok && <FormAlert>{state.error}</FormAlert>}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" name="full_name" required error={errors.full_name}>
          <Input name="full_name" autoComplete="name" required invalid={!!errors.full_name} placeholder="Adaeze Okafor" />
        </Field>
        <Field label="Email" name="email" required error={errors.email}>
          <Input name="email" type="email" autoComplete="email" required invalid={!!errors.email} placeholder="you@example.com" />
        </Field>
        <Field label="Phone" name="phone" error={errors.phone}>
          <Input name="phone" type="tel" autoComplete="tel" invalid={!!errors.phone} placeholder="0803 000 0000" />
        </Field>
        <Field label="Subject" name="subject" error={errors.subject}>
          <Input name="subject" invalid={!!errors.subject} placeholder="How can we help?" />
        </Field>
      </div>
      <Field label="Message" name="message" required error={errors.message}>
        <Textarea name="message" rows={5} required invalid={!!errors.message} placeholder="Tell us about your property or question…" />
      </Field>
      <Button type="submit" variant="primary" size="lg" disabled={pending} className="w-full sm:w-auto">
        {pending ? "Sending…" : "Send message"} <Send className="h-4 w-4" />
      </Button>
    </form>
  );
}
