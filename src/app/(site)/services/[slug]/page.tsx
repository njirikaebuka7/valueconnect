import { ArrowRight, CalendarCheck, Check, FileText, Phone, UserRoundCheck } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/home/cta-band";
import { ServiceCard } from "@/components/home/services-showcase";
import { ServiceIcon } from "@/components/home/service-icon";
import { PageHero } from "@/components/layout/page-hero";
import { Accordion } from "@/components/ui/accordion";
import { ButtonLink } from "@/components/ui/button";
import { Accent, SectionHeading } from "@/components/ui/section-heading";
import { WhatsAppIcon } from "@/components/ui/social-icons";
import {
  faqs,
  getService,
  requiredDocuments,
  services,
  valuationPurposeDetails,
  valuationSteps,
} from "@/lib/content";
import { serviceImages } from "@/lib/images";
import { getContact } from "@/lib/settings";
import { whatsappLink } from "@/lib/site";
import { JsonLd } from "@/components/seo/json-ld";
import { absoluteUrl, breadcrumbJsonLd, organizationId, pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = getService((await params).slug);
  if (!service) return {};
  return pageMetadata({
    title: service.seo.title,
    description: service.seo.description,
    path: `/services/${service.slug}`,
    images: [{ url: serviceImages[service.slug], alt: service.title }],
  });
}

export default async function ServicePage({ params }: Props) {
  const service = getService((await params).slug);
  if (!service) notFound();
  const contact = await getContact();
  const isValuation = service.slug === "valuations";
  const others = services.filter((s) => s.slug !== service.slug);

  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: service.title,
            serviceType: service.title,
            description: service.seo.description,
            url: absoluteUrl(`/services/${service.slug}`),
            image: absoluteUrl(serviceImages[service.slug]),
            provider: { "@id": organizationId },
            areaServed: { "@type": "Country", name: "Nigeria" },
          },
          breadcrumbJsonLd([
            { name: "Services", path: "/services" },
            { name: service.title, path: `/services/${service.slug}` },
          ]),
        ]}
      />
      <PageHero
        eyebrow={service.title}
        title={service.headline}
        description={service.card}
        image={serviceImages[service.slug]}
      >
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href={isValuation ? "/valuation" : "/consultation"} variant="accent" size="lg">
            {isValuation ? "Request a valuation" : "Book a consultation"} <ArrowRight className="h-4 w-4" />
          </ButtonLink>
          <a
            href={whatsappLink(contact.whatsapp, `Hello Valueconnect, I'd like to ask about ${service.title}.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="glass inline-flex h-13 items-center justify-center gap-2 rounded-2xl px-6 text-[0.95rem] font-semibold text-white hover:bg-white/20"
          >
            <WhatsAppIcon className="h-4 w-4 text-aqua-300" /> Ask on WhatsApp
          </a>
        </div>
      </PageHero>

      <section className="py-16 sm:py-24">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="space-y-14 lg:col-span-8">
            <div data-reveal>
              <div className="flex items-center gap-4">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-navy-800 text-aqua-300 shadow-card">
                  <ServiceIcon icon={service.icon} className="h-6 w-6" />
                </span>
                <p className="eyebrow">Overview</p>
              </div>
              <div className="mt-6 space-y-4 text-[1.02rem] leading-relaxed">
                {service.intro.map((p) => (
                  <p key={p.slice(0, 24)}>{p}</p>
                ))}
              </div>
            </div>

            <div data-reveal>
              <h2 className="text-2xl font-bold sm:text-3xl">
                What&apos;s <Accent>included</Accent>
              </h2>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {service.included.map((item) => (
                  <li key={item} className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-card ring-1 ring-line/80">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-aqua-500 text-navy-950">
                      <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    </span>
                    <span className="text-sm font-medium text-ink">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div data-reveal>
              <h2 className="text-2xl font-bold sm:text-3xl">
                Who it&apos;s <Accent>for</Accent>
              </h2>
              <ul className="mt-6 flex flex-wrap gap-2.5">
                {service.audience.map((a) => (
                  <li
                    key={a}
                    className="inline-flex items-center gap-2 rounded-full bg-navy-50 px-4 py-2 text-sm font-semibold text-navy-800 ring-1 ring-navy-100"
                  >
                    <UserRoundCheck className="h-4 w-4 text-aqua-600" />
                    {a}
                  </li>
                ))}
              </ul>
            </div>

            {isValuation && (
              <>
                <div data-reveal>
                  <h2 className="text-2xl font-bold sm:text-3xl">
                    Valuations for every <Accent>purpose</Accent>
                  </h2>
                  <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                    {valuationPurposeDetails.map((p) => (
                      <li key={p.title} className="rounded-2xl bg-surface p-4 ring-1 ring-line/70">
                        <p className="text-sm font-bold text-ink">{p.title}</p>
                        <p className="mt-1 text-sm text-body">{p.body}</p>
                      </li>
                    ))}
                  </ul>
                </div>

                <div data-reveal className="bg-navy-900 relative overflow-hidden rounded-[2rem] p-6 text-white sm:p-9">
                  <div className="relative flex items-center gap-3">
                    <span className="glass grid h-11 w-11 place-items-center rounded-xl text-aqua-300">
                      <FileText className="h-5 w-5" />
                    </span>
                    <h2 className="text-xl font-bold text-white sm:text-2xl">Documents to have ready</h2>
                  </div>
                  <p className="relative mt-3 text-sm text-navy-100/75">
                    Clear copies are fine to start. We may ask to see originals or run a registry search.
                  </p>
                  <ul className="relative mt-6 grid gap-3 sm:grid-cols-2">
                    {requiredDocuments.map((d) => (
                      <li key={d} className="glass flex items-start gap-3 rounded-2xl p-3.5 text-sm text-white/90">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-aqua-300" strokeWidth={3} />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>

                <div data-reveal>
                  <h2 className="text-2xl font-bold sm:text-3xl">
                    How a valuation <Accent>works</Accent>
                  </h2>
                  <ol className="mt-6 space-y-3">
                    {valuationSteps.map((s, i) => (
                      <li key={s.title} className="flex gap-4 rounded-2xl bg-white p-4 shadow-card ring-1 ring-line/80 sm:p-5">
                        <span className="font-brand grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-navy-50 text-lg font-semibold text-navy-700">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <div>
                          <p className="font-bold text-ink">{s.title}</p>
                          <p className="mt-1 text-sm leading-relaxed">{s.body}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>

                <div data-reveal>
                  <h2 className="text-2xl font-bold sm:text-3xl">
                    Common <Accent>questions</Accent>
                  </h2>
                  <Accordion className="mt-6" items={faqs} />
                </div>
              </>
            )}
          </div>

          <aside className="lg:col-span-4">
            <div className="sticky top-28 space-y-4">
              <div className="bg-navy-900 relative overflow-hidden rounded-[2rem] p-6 text-white shadow-lift sm:p-7">
                <p className="relative text-[0.7rem] font-bold tracking-[0.16em] text-aqua-200 uppercase">Get started</p>
                <h2 className="relative mt-2 text-xl font-bold text-white">
                  {isValuation ? "Request a written fee quote" : `Talk to us about ${service.short.toLowerCase()}`}
                </h2>
                <p className="relative mt-2 text-sm text-navy-100/75">
                  A registered professional will review your needs and reply with scope, fee and timeline.
                </p>
                <div className="relative mt-6 grid gap-2.5">
                  <ButtonLink href="/valuation" variant={isValuation ? "accent" : "white"} size="lg" className="w-full">
                    Request a valuation
                  </ButtonLink>
                  <ButtonLink href="/consultation" variant={isValuation ? "white" : "accent"} size="lg" className="w-full">
                    <CalendarCheck className="h-4 w-4" /> Book a consultation
                  </ButtonLink>
                  <a
                    href={whatsappLink(contact.whatsapp, `Hello Valueconnect, I'd like to ask about ${service.title}.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass inline-flex h-13 w-full items-center justify-center gap-2 rounded-2xl text-[0.95rem] font-semibold text-white hover:bg-white/20"
                  >
                    <WhatsAppIcon className="h-4 w-4 text-aqua-300" /> WhatsApp us
                  </a>
                </div>
              </div>
              <div className="rounded-3xl bg-white p-5 shadow-card ring-1 ring-line/80">
                <p className="text-sm font-bold text-ink">Prefer to call?</p>
                {contact.phones.map((p) => (
                  <a
                    key={p.tel}
                    href={`tel:${p.tel}`}
                    className="mt-3 flex items-center gap-3 rounded-2xl bg-surface px-4 py-3 text-sm font-semibold text-navy-800 hover:bg-navy-50"
                  >
                    <Phone className="h-4 w-4 text-aqua-600" /> {p.display}
                  </a>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-surface py-20 sm:py-24">
        <div className="container-x">
          <SectionHeading
            eyebrow="More from Valueconnect"
            title={
              <>
                Explore our other <Accent>services</Accent>
              </>
            }
          />
          <div className="no-scrollbar -mx-4 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pt-2 pb-6 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 lg:grid-cols-3">
            {others.slice(0, 3).map((s) => (
              <div key={s.slug} className="w-[80%] shrink-0 snap-start sm:w-auto">
                <ServiceCard slug={s.slug} className="h-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
