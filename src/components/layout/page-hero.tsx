import type { ReactNode } from "react";
import { Photo } from "@/components/ui/photo";
import { cn } from "@/lib/format";

/**
 * Dark photo banner that opens inner pages. The header floats over it, so
 * any route using this must be listed in hasDarkHero().
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
    <section className={cn("relative isolate overflow-hidden bg-navy-950 text-white", className)}>
      <Photo src={image} alt="" fill preload sizes="100vw" className="-z-20 object-cover opacity-55" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-navy-950/80 via-navy-950/55 to-navy-950/95" />
      <div
        className="absolute inset-0 -z-10 opacity-80"
        style={{
          background:
            "radial-gradient(55% 70% at 85% 0%, rgb(3 203 250 / 0.22), transparent 60%), radial-gradient(45% 60% at 0% 100%, rgb(18 63 179 / 0.5), transparent 60%)",
        }}
      />
      <div
        className={cn(
          "container-x relative flex flex-col items-center text-center",
          size === "lg" ? "pt-32 pb-20 sm:pt-40 sm:pb-28" : "pt-28 pb-14 sm:pt-36 sm:pb-20",
        )}
      >
        {eyebrow && (
          <p className="glass animate-fade-up rounded-full px-4 py-1.5 text-[0.7rem] font-bold tracking-[0.16em] text-aqua-200 uppercase">
            {eyebrow}
          </p>
        )}
        <h1 className="animate-fade-up mt-5 max-w-4xl text-[2.2rem] leading-[1.08] font-extrabold text-white [animation-delay:80ms] sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {description && (
          <p className="animate-fade-up mt-5 max-w-2xl text-[0.98rem] leading-relaxed text-navy-100/85 [animation-delay:160ms] sm:text-lg">
            {description}
          </p>
        )}
        {children && <div className="animate-fade-up mt-8 w-full [animation-delay:240ms]">{children}</div>}
      </div>
    </section>
  );
}
