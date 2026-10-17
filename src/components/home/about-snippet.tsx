import { ArrowRight, Compass, Eye, FileCheck2, Gem } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Photo } from "@/components/ui/photo";
import { Accent } from "@/components/ui/section-heading";
import { coreValues, mission, vision } from "@/lib/content";
import { img } from "@/lib/images";

export function AboutSnippet() {
  const cards = [
    { title: "Our mission", body: mission, icon: Compass },
    { title: "Our vision", body: vision, icon: Eye },
    {
      title: "Our core values",
      body: coreValues.map((v) => v.title).join(" · "),
      icon: Gem,
    },
  ];

  return (
    <section className="py-20 sm:py-24">
      <div className="container-x">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div data-reveal className="relative">
            <div className="relative aspect-[5/4] overflow-hidden rounded-[2rem] bg-navy-950 shadow-lift">
              <Photo src={img.people[1]} alt="Valueconnect valuer reviewing a property file" fill sizes="(min-width: 1024px) 560px, 92vw" className="object-cover" />
            </div>
            <div className="absolute -right-2 -bottom-8 hidden w-44 overflow-hidden rounded-3xl border-[6px] border-white bg-navy-950 shadow-lift sm:block sm:w-56">
              <div className="relative aspect-square">
                <Photo src={img.interiors[0]} alt="" fill sizes="224px" className="object-cover" />
              </div>
            </div>
            <div className="glass-light absolute top-5 left-5 flex items-center gap-3 rounded-2xl px-4 py-3 shadow-card">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-navy-700 text-aqua-300">
                <FileCheck2 className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-bold text-ink">Signed &amp; sealed</p>
                <p className="text-xs text-muted">by a registered valuer</p>
              </div>
            </div>
            <div aria-hidden className="absolute -top-6 -left-6 -z-10 h-32 w-32 rounded-full bg-aqua-200/60 blur-2xl" />
          </div>

          <div data-reveal style={{ "--reveal-delay": "120ms" } as React.CSSProperties}>
            <p className="eyebrow">
              <span className="h-px w-6 bg-aqua-500" />
              About Valueconnect
            </p>
            <h2 className="mt-3 text-[1.85rem] leading-[1.12] font-bold sm:text-4xl lg:text-[2.6rem]">
              Estate surveyors who put their <Accent>name</Accent> to the number
            </h2>
            <p className="mt-5 text-[0.98rem] leading-relaxed sm:text-lg">
              Valueconnect Consulting is a registered firm of Estate Surveyors &amp; Valuers operating under the
              guidelines of the Nigerian Institution of Estate Surveyors and Valuers (NIESV) and the Estate Surveyors
              &amp; Valuers Registration Board of Nigeria (ESVARBON).
            </p>
            <p className="mt-4 leading-relaxed">
              From our Victoria Island office we deliver valuations, estate agency, facility management, land
              administration and auctioneering for individuals, companies, lenders and government, with local
              market insight and international standards.
            </p>
            <ButtonLink href="/about" variant="primary" className="mt-8">
              More about us <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          </div>
        </div>

        <div className="mt-20 grid gap-4 md:grid-cols-3 md:gap-6">
          {cards.map(({ title, body, icon: Icon }, i) => (
            <div
              key={title}
              data-reveal
              style={{ "--reveal-delay": `${i * 100}ms` } as React.CSSProperties}
              className="group rounded-3xl bg-white p-6 shadow-card ring-1 ring-line/80 transition hover:-translate-y-1 hover:shadow-lift sm:p-7"
            >
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-navy-50 text-navy-700 transition group-hover:bg-navy-700 group-hover:text-aqua-300">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-lg font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
