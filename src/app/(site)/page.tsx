import type { Metadata } from "next";
import { AboutSnippet } from "@/components/home/about-snippet";
import { CtaBand } from "@/components/home/cta-band";
import { FaqSection } from "@/components/home/faq-section";
import { FeaturedProperties } from "@/components/home/featured-properties";
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

  return (
    <>
      <Hero />
      <TrustBand />
      <ValuationSteps />
      <ServicesShowcase />
      <FeaturedProperties properties={showcase} />
      <PropertyTypes properties={properties} />
      <AboutSnippet />
      <WhyChooseUs />
      <Purposes />
      <WhereWeOperate properties={properties} />
      <FaqSection limit={6} />
      <CtaBand />
    </>
  );
}
