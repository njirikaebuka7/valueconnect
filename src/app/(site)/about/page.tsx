import { CheckCircle2, Compass, Eye } from "lucide-react";
import type { Metadata } from "next";
import { CtaBand } from "@/components/home/cta-band";
import { ServicesShowcase } from "@/components/home/services-showcase";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { PageHero } from "@/components/layout/page-hero";
import { Photo } from "@/components/ui/photo";
import { Accent } from "@/components/ui/section-heading";
import { coreValues, mission, vision } from "@/lib/content";
import { photos } from "@/lib/images";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About us",
  description:
    "Valueconnect Consulting is a registered firm of Estate Surveyors & Valuers in Victoria Island, Lagos, operating under NIESV and ESVARBON guidelines.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        title={
          <>
            Independent value, <span className="font-accent text-gradient">signed and sealed</span>
          </>
        }
        description="A registered firm of Estate Surveyors & Valuers helping owners, investors, lenders and institutions make property decisions on the facts."
        image={photos.heroAbout}
      />

      <section className="py-20 sm:py-24">
        <div className="container-x grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
          <div data-reveal className="lg:col-span-6">
            <p className="eyebrow">
              <span className="h-px w-6 bg-aqua-500" />
              Who we are
            </p>
            <h2 className="mt-3 text-[1.85rem] leading-[1.12] font-bold sm:text-4xl">
              Professional, registered and <Accent>accountable</Accent>
            </h2>
            <div className="mt-6 space-y-4 text-[0.98rem] leading-relaxed">
              <p>
                Valueconnect Consulting is a professional and fully registered firm of Estate Surveyors &amp; Valuers,
                operating under the guidelines of the Nigerian Institution of Estate Surveyors and Valuers (NIESV) and
                the Estate Surveyors &amp; Valuers Registration Board of Nigeria (ESVARBON).
              </p>
              <p>
                Our foundation is built on professionalism, integrity and innovation, so the solutions we deliver meet
                both local requirements and international standards. That is why individuals, investors, developers and
                corporate institutions rely on us for property and valuation services.
              </p>
              <p>
                Our team of qualified estate surveyors, valuers and property managers combines technical expertise with
                in-depth market knowledge to deliver accurate valuations, efficient property management, seamless estate
                agency and strategic real estate advice. We go beyond transactions: we help clients make informed
                decisions, safeguard their investments and unlock opportunities across Nigeria&apos;s property market.
              </p>
            </div>
          </div>

          <div data-reveal style={{ "--reveal-delay": "120ms" } as React.CSSProperties} className="lg:col-span-6">
            <div className="grid grid-cols-5 gap-4">
              <div className="relative col-span-3 aspect-[3/4] overflow-hidden rounded-[2rem] bg-navy-950 shadow-lift">
                <Photo src={photos.aboutTeam} alt="The Valueconnect team" fill sizes="(min-width: 1024px) 340px, 55vw" className="object-cover" />
              </div>
              <div className="col-span-2 flex flex-col gap-4 pt-10">
                <div className="relative aspect-square overflow-hidden rounded-3xl bg-navy-950 shadow-card">
                  <Photo src={photos.aboutOffice} alt="" fill sizes="220px" className="object-cover" />
                </div>
                <div className="bg-navy-mesh rounded-3xl p-4 text-white shadow-card">
                  <p className="font-brand text-2xl font-semibold">ESVARBON</p>
                  <p className="mt-1 text-xs text-navy-100/75">Registered firm. Every report signed and sealed.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface py-20 sm:py-24">
        <div className="container-x">
          <div className="grid gap-5 md:grid-cols-2">
            {[
              { title: "Our mission", body: mission, icon: Compass },
              { title: "Our vision", body: vision, icon: Eye },
            ].map(({ title, body, icon: Icon }, i) => (
              <div
                key={title}
                data-reveal
                style={{ "--reveal-delay": `${i * 100}ms` } as React.CSSProperties}
                className="relative overflow-hidden rounded-[2rem] bg-white p-7 shadow-card ring-1 ring-line/80 sm:p-9"
              >
                <div aria-hidden className="absolute -top-10 -right-10 h-36 w-36 rounded-full bg-aqua-100 blur-2xl" />
                <span className="relative grid h-12 w-12 place-items-center rounded-2xl bg-navy-700 text-aqua-300">
                  <Icon className="h-5 w-5" />
                </span>
                <h2 className="relative mt-5 text-2xl font-bold">{title}</h2>
                <p className="relative mt-3 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>

          <div data-reveal className="mt-14">
            <h2 className="text-center text-2xl font-bold sm:text-3xl">
              Our core <Accent>values</Accent>
            </h2>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {coreValues.map((v, i) => (
                <li
                  key={v.title}
                  data-reveal
                  style={{ "--reveal-delay": `${i * 80}ms` } as React.CSSProperties}
                  className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-line/80"
                >
                  <CheckCircle2 className="h-6 w-6 text-aqua-600" />
                  <h3 className="mt-4 font-bold">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed">{v.body}</p>
                </li>
              ))}
            </ul>
          </div>

          <div data-reveal className="mt-14 rounded-[2rem] bg-white p-6 ring-1 ring-line sm:p-8">
            <p className="text-center text-xs font-bold tracking-[0.16em] text-muted uppercase">
              Registrations &amp; standards
            </p>
            <ul className="mt-5 grid gap-3 sm:grid-cols-3">
              {site.accreditations.map((a) => (
                <li key={a.code} className="flex items-center gap-4 rounded-2xl bg-surface p-4">
                  <span className="font-brand grid h-14 min-w-14 place-items-center rounded-xl bg-navy-950 px-2 text-sm font-semibold tracking-wide text-aqua-300">
                    {a.code}
                  </span>
                  <span className="text-sm font-medium text-ink">{a.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <WhyChooseUs />
      <ServicesShowcase />
      <CtaBand />
    </>
  );
}
