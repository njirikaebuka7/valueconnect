import type { ReactNode } from "react";
import { Photo } from "@/components/ui/photo";
import { cn } from "@/lib/format";

/**
 * Raised photo panel that opens inner pages, set just below the white header.
 */
export function PageHero({
  eyebrow,
  title,
  description,
  image,
  children,
  className,
  size = "md",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  image: string;
  children?: ReactNode;
  className?: string;
  size?: "md" | "lg";
}) {
  return (
    <section className={cn("px-2 pt-[4.5rem] sm:px-3 lg:px-4 lg:pt-[5.5rem]", className)}>
      <div className="relative isolate overflow-hidden rounded-[1.75rem] bg-navy-950 text-white shadow-[0_40px_90px_-40px_rgb(1_51_152/0.7)] sm:rounded-[2.25rem]">
        <Photo src={image} alt="" fill preload plainFallback sizes="100vw" quality={70} className="-z-20 object-cover opacity-90" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-navy-950/75 via-navy-950/45 to-navy-950/85" />
        <div
          className={cn(
            "container-x relative flex flex-col items-center text-center",
            size === "lg" ? "pt-16 pb-20 sm:pt-24 sm:pb-28" : "pt-14 pb-14 sm:pt-20 sm:pb-20",
          )}
        >
          {eyebrow && (
            <p className="glass animate-fade-up rounded-full px-4 py-1.5 text-[0.7rem] font-bold tracking-[0.16em] text-aqua-200 uppercase">
              {eyebrow}
            </p>
          )}
          <h1 className="hero-rise mt-5 max-w-4xl text-[2.2rem] leading-[1.08] font-extrabold text-balance text-white [text-shadow:0_2px_24px_rgb(4_18_58/0.45)] sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          {description && (
            <p className="animate-fade-up mt-5 max-w-2xl text-[0.98rem] leading-relaxed text-navy-100/85 [animation-delay:160ms] sm:text-lg">
              {description}
            </p>
          )}
          {children && <div className="animate-fade-up mt-8 w-full [animation-delay:240ms]">{children}</div>}
        </div>
      </div>
    </section>
  );
}
