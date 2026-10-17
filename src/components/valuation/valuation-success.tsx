"use client";

import { Check, Copy, House, ScanSearch } from "lucide-react";
import { useState } from "react";
import { useContact } from "@/components/layout/contact-context";
import { ButtonLink, buttonClass } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/ui/social-icons";
import { cn } from "@/lib/format";
import { whatsappLink } from "@/lib/site";

const nextSteps = [
  { title: "We review your request", body: "A registered valuer checks the details and confirms the right basis of value." },
  { title: "You receive a fee quote", body: "A written quote, scope and delivery date, plus a list of any documents we need." },
  { title: "We inspect and report", body: "Once you accept, we inspect the property and deliver your signed and sealed report." },
];

export function ValuationSuccess({ reference, preview }: { reference: string; preview: boolean }) {
  const contact = useContact();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(reference);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked; the reference is still on screen.
    }
  };

  return (
    <div className="animate-fade-up py-4 text-center sm:py-8" role="status" aria-live="polite">
      <div className="relative mx-auto h-24 w-24">
        <span className="absolute inset-0 animate-ping rounded-full bg-aqua-300/40 [animation-duration:2s] [animation-iteration-count:2]" />
        <span className="relative grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-aqua-400 to-navy-700 shadow-glow">
          <Check className="h-11 w-11 text-white" strokeWidth={3} />
        </span>
      </div>
      <h2 className="mt-6 text-2xl font-extrabold sm:text-3xl">Request received</h2>
      <p className="mx-auto mt-2 max-w-md text-[0.95rem] leading-relaxed text-body">
        Thank you. Keep this reference: you&apos;ll need it to track your request and when you send documents.
      </p>

      <button
        type="button"
        onClick={copy}
        className="group mx-auto mt-6 flex items-center gap-3 rounded-2xl bg-navy-950 py-3 pr-3 pl-5 text-white shadow-lift transition active:scale-[0.98]"
        aria-label={`Copy reference ${reference}`}
      >
        <span className="text-left">
          <span className="block text-[0.65rem] font-bold tracking-[0.16em] text-aqua-300 uppercase">Your reference</span>
          <span className="font-mono text-xl font-bold tracking-wider sm:text-2xl">{reference}</span>
        </span>
        <span
          className={cn(
            "grid h-10 w-10 place-items-center rounded-xl transition",
            copied ? "bg-aqua-500 text-navy-950" : "bg-white/10 group-hover:bg-white/20",
          )}
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </span>
      </button>
      <p className="mt-2 h-4 text-xs font-semibold text-aqua-700">{copied ? "Copied to clipboard" : ""}</p>

      {preview && (
        <p className="mx-auto mt-3 max-w-md rounded-xl bg-surface px-4 py-2.5 text-xs text-muted">
          Preview mode: the site isn&apos;t connected to its database yet, so this request wasn&apos;t stored. Please call
          or WhatsApp us to instruct a valuation today.
        </p>
      )}

      <ol className="mx-auto mt-8 max-w-lg space-y-3 text-left">
        {nextSteps.map((s, i) => (
          <li key={s.title} className="flex gap-4 rounded-2xl bg-surface p-4">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-navy-700 text-sm font-bold text-white">
              {i + 1}
            </span>
            <span>
              <span className="block text-sm font-bold text-ink">{s.title}</span>
              <span className="mt-0.5 block text-xs leading-relaxed text-body">{s.body}</span>
            </span>
          </li>
        ))}
      </ol>

      <div className="mx-auto mt-8 flex max-w-lg flex-col gap-2 sm:flex-row sm:justify-center">
        <ButtonLink href={`/track?ref=${encodeURIComponent(reference)}`} variant="primary" size="lg">
          <ScanSearch className="h-4 w-4" /> Track this request
        </ButtonLink>
        <a
          href={whatsappLink(contact.whatsapp, `Hello Valueconnect, here are the documents for valuation request ${reference}.`)}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClass("accent", "lg")}
        >
          <WhatsAppIcon className="h-4 w-4" /> Send documents
        </a>
      </div>
      <ButtonLink href="/" variant="ghost" className="mt-3">
        <House className="h-4 w-4" /> Back home
      </ButtonLink>
    </div>
  );
}
