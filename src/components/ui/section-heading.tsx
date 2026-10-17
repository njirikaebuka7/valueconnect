import type { ReactNode } from "react";
import { cn } from "@/lib/format";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "dark",
  action,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  tone?: "dark" | "light";
  action?: ReactNode;
  className?: string;
}) {
  const light = tone === "light";
  return (
    <div
      data-reveal
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow && (
          <p className={cn("eyebrow", light && "text-aqua-300")}>
            <span className={cn("h-px w-6", light ? "bg-aqua-300" : "bg-aqua-500")} />
            {eyebrow}
          </p>
        )}
        <h2
          className={cn(
            "mt-3 text-[1.85rem] leading-[1.12] font-bold text-balance sm:text-4xl lg:text-[2.6rem]",
            light && "text-white",
          )}
        >
          {title}
        </h2>
        {description && (
          <p className={cn("mt-4 text-[0.98rem] leading-relaxed sm:text-lg", light ? "text-navy-100/80" : "text-body")}>
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/** Italic serif accent used inside headings, e.g. "signed and sealed". */
export function Accent({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("font-accent text-[1.08em] text-aqua-600", className)}>{children}</span>;
}
