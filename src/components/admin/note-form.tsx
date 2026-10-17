"use client";

import { useActionState, useEffect, useRef, useTransition } from "react";
import { saveInternalNote } from "@/app/actions/admin";
import { buttonClass } from "@/components/ui/button";
import { FormAlert, Textarea } from "@/components/ui/field";

export function NoteForm({ id }: { id: string }) {
  const [state, action, pending] = useActionState(saveInternalNote, null);
  const [, startTransition] = useTransition();
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state?.ok) ref.current?.reset();
  }, [state]);

  return (
    <form
      ref={ref}
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        startTransition(() => action(fd));
      }}
      className="space-y-3 p-5"
    >
      <input type="hidden" name="id" value={id} />
      {state && !state.ok && <FormAlert>{state.error}</FormAlert>}
      {state?.ok && <FormAlert tone="success">{state.message}</FormAlert>}
      <Textarea name="note" rows={3} placeholder="Only staff can see this note…" aria-label="Internal note" />
      <button type="submit" disabled={pending} className={buttonClass("outline", "sm")}>
        {pending ? "Adding…" : "Add note"}
      </button>
    </form>
  );
}
