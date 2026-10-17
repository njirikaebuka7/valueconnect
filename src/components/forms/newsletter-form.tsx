"use client";

import { ArrowRight, Check } from "lucide-react";
import { useActionState } from "react";
import { subscribeNewsletter } from "@/app/actions/public";
import { Honeypot } from "@/components/ui/field";
import { cn } from "@/lib/format";

/** Compact sign-up for the dark footer. */
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
      <div className="flex gap-1.5 rounded-xl bg-white/[0.06] p-1 ring-1 ring-white/10 transition focus-within:ring-aqua-400/60">
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          placeholder="Your email address"
          autoComplete="email"
          className="min-w-0 flex-1 bg-transparent px-3 text-sm text-white placeholder:text-navy-100/45 focus:outline-none"
        />
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-9 shrink-0 items-center gap-1 rounded-lg bg-aqua-500 px-3.5 text-xs font-bold text-navy-950 transition hover:bg-aqua-400 disabled:opacity-60"
        >
          {pending ? "Joining…" : "Subscribe"}
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
      {state && !state.ok && (
        <p className="mt-2 text-xs font-medium text-red-300">{state.fieldErrors?.email ?? state.error}</p>
      )}
    </form>
  );
}
