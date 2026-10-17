"use client";

import { ArrowRight, Check } from "lucide-react";
import { useActionState } from "react";
import { subscribeNewsletter } from "@/app/actions/public";
import { Honeypot } from "@/components/ui/field";
import { cn } from "@/lib/format";

export function NewsletterForm({ className }: { className?: string }) {
  const [state, action, pending] = useActionState(subscribeNewsletter, null);
  if (state?.ok) {
    return (
      <p className={cn("flex items-center gap-2 text-sm font-semibold text-aqua-200", className)} role="status">
        <Check className="h-4 w-4" /> You&apos;re on the list. Thank you!
      </p>
    );
  }
  return (
    <form action={action} className={cn("relative w-full", className)} noValidate>
      <Honeypot />
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <div className="flex gap-2 rounded-2xl bg-white p-1.5 shadow-card">
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          placeholder="Your email address"
          autoComplete="email"
          className="min-w-0 flex-1 bg-transparent px-3 text-sm text-ink placeholder:text-muted focus:outline-none"
        />
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-11 items-center gap-1.5 rounded-xl bg-navy-700 px-4 text-sm font-semibold text-white transition hover:bg-navy-800 disabled:opacity-60"
        >
          {pending ? "Joining…" : "Subscribe"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
      {state && !state.ok && (
        <p className="mt-2 text-xs font-medium text-red-200">{state.fieldErrors?.email ?? state.error}</p>
      )}
    </form>
  );
}
