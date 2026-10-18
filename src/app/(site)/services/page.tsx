import { ArrowRight, Check } from "lucide-react";
import type { Metadata } from "next";
import { CtaBand } from "@/components/home/cta-band";
import { ServiceIcon } from "@/components/home/service-icon";
import { ValuationSteps } from "@/components/home/valuation-steps";
import { PageHero } from "@/components/layout/page-hero";
import { ButtonLink } from "@/components/ui/button";
import { Photo } from "@/components/ui/photo";
import { services } from "@/lib/content";
import { cn } from "@/lib/format";
import { photos, serviceImages } from "@/lib/images";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Valuation, Agency & Property Services in Nigeria",
  description:
    "Valuations, property and facility management, estate agency, feasibility and viability appraisal, land administration and auctioneering across Nigeria.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Our services"
        title={
          <>
            Real estate expertise, <span className="font-accent text-aqua-400">end to end</span>
          </>
        }
        description="Six services delivered by registered Estate Surveyors & Valuers, from a single valuation to managing an entire portfolio."
        image={photos.heroServices}
      >
        <nav aria-label="Services" className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-auto sm:flex-wrap sm:justify-center">
          {services.map((s) => (
            <a
              key={s.slug}
              href={`#${s.slug}`}
              className="glass shrink-0 rounded-full px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              {s.short}
            </a>
          ))}
        </nav>
      </PageHero>

      {services.map((s, i) => {
        const flip = i % 2 === 1;
        return (
          <section key={s.slug} id={s.slug} className={cn("scroll-mt-24 py-16 sm:py-24", flip ? "bg-surface" : "bg-white")}>
            <div className="container-x grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <div data-reveal className={cn("relative", flip && "lg:order-2")}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-[2.25rem] bg-navy-950 shadow-lift">
                  <Photo src={serviceImages[s.slug]} alt={s.title} fill sizes="(min-width: 1024px) 560px, 92vw" className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/40 to-transparent" />
                </div>
                <span
                  className={cn(
                    "absolute -bottom-6 grid h-16 w-16 place-items-center rounded-2xl bg-navy-800 text-aqua-300 shadow-lift ring-[6px]",
                    flip ? "right-6 ring-surface" : "left-6 ring-white",
                  )}
                >
                  <ServiceIcon icon={s.icon} className="h-7 w-7" />
                </span>
                <span aria-hidden className={cn("absolute -top-4 h-8 w-8 rounded-full bg-aqua-400/70", flip ? "-left-3" : "-right-3")} />
                <span aria-hidden className={cn("absolute top-10 h-4 w-4 rounded-full bg-navy-700", flip ? "-left-6" : "-right-6")} />
              </div>

              <div data-reveal style={{ "--reveal-delay": "100ms" } as React.CSSProperties}>
                <p className="eyebrow">
                  <span className="h-px w-6 bg-aqua-500" />
                  {s.title}
                </p>
                <h2 className="mt-3 text-[1.85rem] leading-[1.12] font-bold sm:text-4xl">{s.headline}</h2>
                <p className="mt-5 leading-relaxed">{s.intro[0]}</p>
                <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                  {s.included.slice(0, 4).map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-ink">
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-aqua-100 text-aqua-700">
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-wrap gap-3">
                  <ButtonLink href={`/services/${s.slug}`} variant="primary">
                    Explore {s.short.toLowerCase()} <ArrowRight className="h-4 w-4" />
                  </ButtonLink>
                  <ButtonLink href={s.slug === "valuations" ? "/valuation" : "/consultation"} variant="outline">
                    {s.slug === "valuations" ? "Request a valuation" : "Book a consultation"}
                  </ButtonLink>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      <ValuationSteps />
      <CtaBand />
    </>
  );
}
