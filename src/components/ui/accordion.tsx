import { Plus } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/format";

/** Native <details> accordion: accessible and works without JavaScript. */
export function Accordion({
  items,
  className,
  defaultOpen = 0,
}: {
  items: ReadonlyArray<{ q: string; a: ReactNode }>;
  className?: string;
  defaultOpen?: number | null;
}) {
  return (
    <div className={cn("space-y-3", className)}>
      {items.map((item, i) => (
        <details
          key={item.q}
          open={i === defaultOpen}
          className="group rounded-2xl bg-white ring-1 ring-line transition open:shadow-card open:ring-aqua-200"
        >
          <summary className="flex cursor-pointer list-none items-start justify-between gap-4 px-5 py-4 text-left [&::-webkit-details-marker]:hidden">
            <span className="text-[0.95rem] font-semibold text-ink">{item.q}</span>
            <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-navy-50 text-navy-700 transition group-open:rotate-45 group-open:bg-aqua-500 group-open:text-navy-950">
              <Plus className="h-3.5 w-3.5" strokeWidth={2.6} />
            </span>
          </summary>
          <div className="px-5 pb-5 text-sm leading-relaxed text-body">{item.a}</div>
        </details>
      ))}
    </div>
  );
}
