"use client";

import { Loader2 } from "lucide-react";
import { useOptimistic, useTransition, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { buttonClass } from "@/components/ui/button";
import { cn } from "@/lib/format";

export function SubmitButton({
  children,
  pendingText,
  variant = "primary",
  size = "md",
  className,
}: {
  children: ReactNode;
  pendingText?: string;
  variant?: Parameters<typeof buttonClass>[0];
  size?: Parameters<typeof buttonClass>[1];
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={buttonClass(variant, size, className)}>
      {pending && <Loader2 className="h-4 w-4 animate-spin" />}
      {pending && pendingText ? pendingText : children}
    </button>
  );
}

/** A one-button form that asks before running a destructive Server Action. */
export function ConfirmForm({
  action,
  message,
  children,
  className,
  buttonClassName,
  pendingText,
}: {
  action: () => Promise<void>;
  message: string;
  children: ReactNode;
  className?: string;
  buttonClassName?: string;
  pendingText?: string;
}) {
  return (
    <form
      action={action}
      className={className}
      onSubmit={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      <ConfirmButton className={buttonClassName} pendingText={pendingText}>
        {children}
      </ConfirmButton>
    </form>
  );
}

function ConfirmButton({ children, className, pendingText }: { children: ReactNode; className?: string; pendingText?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={cn("disabled:opacity-60", className)}>
      {pending && pendingText ? pendingText : children}
    </button>
  );
}

/** Switch that flips a boolean through a Server Action, updating instantly. */
export function FlagToggle({
  value,
  onToggle,
  label,
  size = "md",
}: {
  value: boolean;
  onToggle: (next: boolean) => Promise<void>;
  label: string;
  size?: "sm" | "md";
}) {
  const [optimistic, setOptimistic] = useOptimistic(value);
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      role="switch"
      aria-checked={optimistic}
      aria-label={label}
      title={label}
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          setOptimistic(!optimistic);
          await onToggle(!optimistic);
        })
      }
      className={cn(
        "relative inline-flex shrink-0 items-center rounded-full transition disabled:opacity-70",
        size === "sm" ? "h-5 w-9" : "h-6 w-11",
        optimistic ? "bg-aqua-500" : "bg-slate-300",
      )}
    >
      <span
        className={cn(
          "inline-block rounded-full bg-white shadow transition",
          size === "sm" ? "h-4 w-4" : "h-5 w-5",
          optimistic ? (size === "sm" ? "translate-x-4.5" : "translate-x-5.5") : "translate-x-0.5",
        )}
      />
    </button>
  );
}
