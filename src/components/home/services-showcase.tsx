import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { Photo } from "@/components/ui/photo";
import { Accent, SectionHeading } from "@/components/ui/section-heading";
import { services } from "@/lib/content";
import { cn } from "@/lib/format";
import { serviceImages } from "@/lib/images";
import { ServiceIcon } from "./service-icon";

export function ServiceCard({ slug, className }: { slug: (typeof services)[number]["slug"]; className?: string }) {
  const s = services.find((x) => x.slug === slug)!;
  return (
    <Link
      href={`/services/${s.slug}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-line/80 transition duration-300 hover:-translate-y-1 hover:shadow-lift",
        className,
      )}
    >
      <div className="relative aspect-[16/11] overflow-hidden bg-navy-950">
        <Photo
          src={serviceImages[s.slug]}
          alt={s.title}
          fill
          sizes="(min-width: 1024px) 400px, 80vw"
          className="object-cover transition duration-700 group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/55 via-transparent to-transparent" />
        <span className="glass-chip absolute top-3 right-3 grid h-9 w-9 place-items-center rounded-full text-navy-800 opacity-0 transition group-hover:opacity-100">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
      <div className="relative flex flex-1 flex-col px-5 pt-9 pb-5">
        <span className="absolute -top-7 left-5 grid h-14 w-14 place-items-center rounded-2xl bg-navy-800 text-aqua-300 shadow-[0_12px_24px_-10px_rgb(1_51_152/0.8)] ring-4 ring-white">
          <ServiceIcon icon={s.icon} className="h-6 w-6" />
        </span>
        <h3 className="text-lg font-bold">{s.title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-body">{s.card}</p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-700 transition group-hover:gap-2.5">
          Learn more <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}

export function ServicesShowcase({ className }: { className?: string }) {
  return (
    <section className={cn("py-20 sm:py-24", className)}>
      <div className="container-x">
        <SectionHeading
          eyebrow="What we do"
          title={
            <>
              Six services, one standard: <Accent>evidence</Accent>
            </>
          }
          description="Every instruction is handled by registered professionals, so the advice you act on is independent, documented and accountable."
          action={
            <ButtonLink href="/services" variant="outline">
              All services <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          }
        />
        <div className="no-scrollbar -mx-4 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pt-2 pb-6 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 lg:grid-cols-3">
          {services.map((s, i) => (
            <div
              key={s.slug}
              data-reveal
              style={{ "--reveal-delay": `${(i % 3) * 100}ms` } as React.CSSProperties}
              className="w-[80%] shrink-0 snap-start sm:w-auto"
            >
              <ServiceCard slug={s.slug} className="h-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
