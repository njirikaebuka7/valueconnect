"use client";

import { Loader2, Send } from "lucide-react";
import { useActionState, useState, useTransition } from "react";
import { respondToValuation } from "@/app/actions/admin";
import { buttonClass } from "@/components/ui/button";
import { Field, FormAlert, Input, Select, Textarea } from "@/components/ui/field";
import { cn } from "@/lib/format";
import { valuationStatusMeta } from "@/lib/options";
import type { ValuationStatus } from "@/lib/types";

const templates: { label: string; status?: ValuationStatus; text: string }[] = [
  {
    label: "Ask for documents",
    status: "reviewing",
    text: "Thank you for choosing Valueconnect. To prepare your fee quote, please reply with copies of your title document, survey plan and (if available) the approved building plan.",
  },
  {
    label: "Send fee quote",
    status: "quoted",
    text: "Please find our professional fee above. Once you confirm and payment is made to our official company account, we will book the inspection at a time that suits you.",
  },
  {
    label: "Confirm inspection",
    status: "scheduled",
    text: "Your inspection is booked for the date and time above. Our valuer will call you before arriving. Please ensure access to all areas of the property.",
  },
  {
    label: "Report delivered",
    status: "completed",
    text: "Your signed and sealed valuation report has been delivered. Thank you for instructing Valueconnect Consulting. We're here if you or your lender have any questions.",
  },
];

/** Lagos is UTC+1 all year, so datetime-local values are shown in Lagos time. */
function toLagosInput(iso: string | null) {
  if (!iso) return "";
  return new Date(new Date(iso).getTime() + 60 * 60 * 1000).toISOString().slice(0, 16);
}

export function RespondForm({
  id,
  status,
  quoteAmount,
  inspectionDate,
  emailEnabled,
}: {
  id: string;
  status: ValuationStatus;
  quoteAmount: number | null;
  inspectionDate: string | null;
  emailEnabled: boolean;
}) {
  const [message, setMessage] = useState("");
  const [state, action, pending] = useActionState(
    async (prev: Awaited<ReturnType<typeof respondToValuation>> | null, fd: FormData) => {
      const res = await respondToValuation(prev, fd);
      if (res.ok) setMessage("");
      return res;
    },
    null,
  );
  const [, startTransition] = useTransition();
  const [nextStatus, setNextStatus] = useState<ValuationStatus>(status);
  const [quote, setQuote] = useState(quoteAmount != null ? quoteAmount.toLocaleString("en-NG") : "");
  const errors = state && !state.ok ? state.fieldErrors : undefined;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        startTransition(() => action(fd));
      }}
      className="space-y-4 p-5"
    >
      <input type="hidden" name="id" value={id} />
      {state && (state.ok ? <FormAlert tone="success">{state.message}</FormAlert> : <FormAlert>{state.error}</FormAlert>)}

      <Field label="Status" name="status">
        <Select name="status" value={nextStatus} onChange={(e) => setNextStatus(e.target.value as ValuationStatus)}>
          {(Object.keys(valuationStatusMeta) as ValuationStatus[]).map((s) => (
            <option key={s} value={s}>
              {valuationStatusMeta[s].label}
            </option>
          ))}
        </Select>
      </Field>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 2xl:grid-cols-2">
        <Field label="Fee quote (₦)" name="quote_amount" error={errors?.quote_amount}>
          <Input
            name="quote_amount"
            inputMode="numeric"
            placeholder="e.g. 350,000"
            value={quote}
            onChange={(e) => {
              const digits = e.target.value.replace(/[^\d]/g, "");
              setQuote(digits ? Number(digits).toLocaleString("en-NG") : "");
            }}
          />
        </Field>
        <Field label="Inspection (Lagos time)" name="inspection_date" error={errors?.inspection_date}>
          <Input name="inspection_date" type="datetime-local" defaultValue={toLagosInput(inspectionDate)} />
        </Field>
      </div>

      <Field label="Message to client" name="message" hint="Shown on the client's Track page." error={errors?.message}>
        <Textarea
          name="message"
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write a short update for the client…"
        />
      </Field>
      <div className="flex flex-wrap gap-1.5">
        {templates.map((t) => (
          <button
            key={t.label}
            type="button"
            onClick={() => {
              setMessage(t.text);
              if (t.status) setNextStatus(t.status);
            }}
            className="rounded-full bg-surface px-3 py-1.5 text-xs font-semibold text-navy-700 ring-1 ring-line transition hover:bg-navy-50"
          >
            {t.label}
          </button>
        ))}
      </div>

      <label className={cn("flex items-start gap-3 rounded-xl bg-surface p-3 text-sm", !emailEnabled && "opacity-70")}>
        <input
          type="checkbox"
          name="send_email"
          defaultChecked={emailEnabled}
          disabled={!emailEnabled}
          className="mt-0.5 h-4 w-4 rounded accent-navy-700"
        />
        <span>
          <span className="font-semibold text-ink">Email this update to the client</span>
          <span className="block text-xs text-muted">
            {emailEnabled
              ? "Includes the status, quote, inspection date and a Track link."
              : "Email isn't set up yet (RESEND_API_KEY). The client can still see updates on the Track page."}
          </span>
        </span>
      </label>

      <button type="submit" disabled={pending} className={buttonClass("primary", "md", "w-full")}>
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        {pending ? "Saving…" : "Save & update client"}
      </button>
    </form>
  );
}
