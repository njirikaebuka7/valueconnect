"use client";

import { Loader2 } from "lucide-react";
import { useActionState, useTransition } from "react";
import { updateConsultation } from "@/app/actions/admin";
import { buttonClass } from "@/components/ui/button";
import { Select, Textarea } from "@/components/ui/field";
import { consultationStatusMeta } from "@/lib/options";
import type { ConsultationStatus } from "@/lib/types";

export function ConsultationEditor({ id, status, notes }: { id: string; status: ConsultationStatus; notes: string | null }) {
  const [state, action, pending] = useActionState(updateConsultation, null);
  const [, startTransition] = useTransition();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        startTransition(() => action(fd));
      }}
      className="space-y-3"
    >
      <input type="hidden" name="id" value={id} />
      <div className="grid gap-3 sm:grid-cols-[11rem_1fr]">
        <Select name="status" defaultValue={status} aria-label="Status" className="h-10 text-sm">
          {(Object.keys(consultationStatusMeta) as ConsultationStatus[]).map((s) => (
            <option key={s} value={s}>
              {consultationStatusMeta[s].label}
            </option>
          ))}
        </Select>
        <Textarea
          name="admin_notes"
          defaultValue={notes ?? ""}
          rows={1}
          placeholder="Staff notes (e.g. confirmed by phone)"
          aria-label="Staff notes"
          className="min-h-10 py-2 text-sm"
        />
      </div>
      <div className="flex items-center gap-3">
        <button type="submit" disabled={pending} className={buttonClass("primary", "sm")}>
          {pending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          {pending ? "Saving…" : "Save"}
        </button>
        {state && (
          <p className={state.ok ? "text-xs font-semibold text-aqua-700" : "text-xs font-semibold text-red-600"} role="status">
            {state.ok ? state.message : state.error}
          </p>
        )}
      </div>
    </form>
  );
}
