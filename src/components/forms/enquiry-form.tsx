"use client";

import { CheckCircle2, Send } from "lucide-react";
import { useActionState } from "react";
import { submitMessage } from "@/app/actions/public";
import { Button } from "@/components/ui/button";
import { Field, FormAlert, Honeypot, Input, Textarea } from "@/components/ui/field";
import { cn } from "@/lib/format";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function EnquiryForm({
  propertyId,
  propertyTitle,
  idPrefix = "enquiry",
  className,
}: {
  propertyId: string;
  propertyTitle: string;
  /** Lets two copies of the form (sidebar and sheet) live on one page. */
  idPrefix?: string;
  className?: string;
}) {
  const [state, action, pending] = useActionState(submitMessage, null);
  const errors = state && !state.ok ? state.fieldErrors ?? {} : {};
  const id = (name: string) => `${idPrefix}-${name}`;

  if (state?.ok) {
    return (
      <div className={cn("rounded-2xl bg-aqua-50 p-5 text-center ring-1 ring-aqua-200", className)} role="status">
        <CheckCircle2 className="mx-auto h-10 w-10 text-aqua-600" />
        <p className="mt-3 font-bold text-ink">Enquiry sent</p>
        <p className="mt-1 text-sm text-body">
          Thank you. A member of our agency team will call or email you shortly about this property.
        </p>
        {state.preview && (
          <p className="mt-3 text-xs text-muted">Preview mode: the site isn&apos;t connected to its database yet, so this wasn&apos;t stored.</p>
        )}
      </div>
    );
  }

  return (
    <form action={action} className={cn("relative space-y-3.5", className)} noValidate>
      <Honeypot />
      <input type="hidden" name="kind" value="enquiry" />
      <input type="hidden" name="property_title" value={propertyTitle} />
      {UUID.test(propertyId) && <input type="hidden" name="property_id" value={propertyId} />}

      <Field label="Full name" name={id("full_name")} error={errors.full_name} required>
        <Input id={id("full_name")} name="full_name" autoComplete="name" required invalid={!!errors.full_name} />
      </Field>
      <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        <Field label="Email" name={id("email")} error={errors.email} required>
          <Input id={id("email")} name="email" type="email" autoComplete="email" required invalid={!!errors.email} />
        </Field>
        <Field label="Phone" name={id("phone")} error={errors.phone}>
          <Input id={id("phone")} name="phone" type="tel" autoComplete="tel" placeholder="080…" invalid={!!errors.phone} />
        </Field>
      </div>
      <Field label="Message" name={id("message")} error={errors.message} required>
        <Textarea
          id={id("message")}
          name="message"
          rows={4}
          required
          invalid={!!errors.message}
          defaultValue={`Hello, I'm interested in "${propertyTitle}". Please send me more details and available viewing times.`}
        />
      </Field>

      {state && !state.ok && !state.fieldErrors && <FormAlert>{state.error}</FormAlert>}

      <Button type="submit" variant="primary" size="lg" className="w-full" disabled={pending}>
        {pending ? "Sending…" : "Send enquiry"}
        <Send className="h-4 w-4" />
      </Button>
      <p className="text-center text-[0.7rem] text-muted">We&apos;ll only use your details to respond to this enquiry.</p>
    </form>
  );
}
