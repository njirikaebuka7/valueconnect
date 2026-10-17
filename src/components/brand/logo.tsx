import Link from "next/link";
import { cn } from "@/lib/format";

/**
 * Valueconnect logo. The mark is traced from the original artwork; on dark
 * backgrounds the royal-blue stroke turns white and the cyan orbit stays.
 */
export function LogoMark({ tone = "dark", className }: { tone?: "dark" | "light"; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={tone === "light" ? "/brand/logo-mark-white.svg" : "/brand/logo-mark.svg"}
      alt=""
      width={2094}
      height={1812}
      className={cn("h-auto w-11 shrink-0", className)}
    />
  );
}

export function Logo({
  tone = "dark",
  compact = false,
  className,
  href = "/",
}: {
  tone?: "dark" | "light";
  compact?: boolean;
  className?: string;
  href?: string | null;
}) {
  const light = tone === "light";
  const content = (
    <span className={cn("flex items-center gap-2.5", className)}>
      <LogoMark tone={tone} className={compact ? "w-9" : "w-11 lg:w-12"} />
      <span className="flex flex-col leading-none">
        <span className="font-brand text-[1.15rem] font-semibold tracking-[0.02em] uppercase sm:text-[1.3rem]">
          <span className={light ? "text-white" : "text-navy-950"}>Valueconnect</span>
          {!compact && <span className={light ? "text-aqua-400" : "text-navy-700"}> Consulting</span>}
        </span>
        <span
          className={cn(
            "mt-1 text-[0.62rem] font-bold tracking-[0.04em] sm:text-[0.7rem]",
            light ? "text-aqua-200" : "text-navy-700",
          )}
        >
          Estate Surveyors &amp; Valuers
        </span>
      </span>
    </span>
  );
  if (href === null) return content;
  return (
    <Link href={href} aria-label="Valueconnect Consulting, home" className="inline-flex">
      {content}
    </Link>
  );
}
