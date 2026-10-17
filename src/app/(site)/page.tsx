import type { Metadata } from "next";
import { AboutSnippet } from "@/components/home/about-snippet";
import { CtaBand } from "@/components/home/cta-band";
import { FaqSection } from "@/components/home/faq-section";
import { FeaturedProperties } from "@/components/home/featured-properties";
import { Intro } from "@/components/home/intro";
import { Hero } from "@/components/home/hero";
import { PropertyTypes } from "@/components/home/property-types";
import { Purposes } from "@/components/home/purposes";
import { ServicesShowcase } from "@/components/home/services-showcase";
import { TrustBand } from "@/components/home/trust-band";
import { ValuationSteps } from "@/components/home/valuation-steps";
import { WhereWeOperate } from "@/components/home/where-we-operate";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { getPublishedProperties } from "@/lib/data/properties";

export const revalidate = 300;

export const metadata: Metadata = {
  title: { absolute: "Valueconnect Consulting | Estate Surveyors & Valuers, Lagos" },
  description:
    "ESVARBON-registered Estate Surveyors & Valuers in Victoria Island, Lagos: independent valuations, land titles, agency, property management and auctions.",
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const properties = await getPublishedProperties();
  const featured = properties.filter((p) => p.featured);
  // Nine cards (three rows on desktop): featured first, topped up with the newest.
  const showcase = [...featured, ...properties.filter((p) => !p.featured)].slice(0, 9);

  // The city tabs are interactive, so their listings travel to the browser:
  // send only what a card shows.
  const cityCards = properties.map((p) => ({ ...p, description: "", features: [], images: p.images.slice(0, 1) }));

  return (
    <>
      <Intro />
      <Hero />
      <TrustBand />
      <ValuationSteps />
      {/* Below the fold: the browser skips layout and paint until each section nears the screen. */}
      <div className="cv-auto">
        <ServicesShowcase />
      </div>
      <div className="cv-auto">
        <FeaturedProperties properties={showcase} />
      </div>
      <div className="cv-auto">
        <PropertyTypes properties={properties} />
      </div>
      <div className="cv-auto">
        <AboutSnippet />
      </div>
      <div className="cv-auto">
        <WhyChooseUs />
      </div>
      <div className="cv-auto">
        <Purposes />
      </div>
      <div className="cv-auto">
        <WhereWeOperate properties={cityCards} />
      </div>
      <div className="cv-auto">
        <FaqSection limit={6} />
      </div>
      <div className="cv-auto">
        <CtaBand />
      </div>
    </>
  );
}
