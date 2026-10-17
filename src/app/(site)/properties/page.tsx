import type { Metadata } from "next";
import { PropertyExplorer } from "@/components/property/property-explorer";
import { getPublishedProperties } from "@/lib/data/properties";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Properties for Sale & to Let in Nigeria",
  description:
    "Homes, offices, warehouses and land for sale and to let in Lagos, Abuja and across Nigeria, marketed by registered Estate Surveyors & Valuers who review documents before listing.",
  alternates: { canonical: "/properties" },
};

export default async function PropertiesPage() {
  const properties = await getPublishedProperties();

  return (
    <div className="bg-surface pt-20 pb-24 lg:pt-28 lg:pb-32">
      <div className="container-x">
        <div className="animate-fade-up pt-4 lg:pt-6">
          <p className="eyebrow">
            <span className="h-px w-6 bg-aqua-500" />
            Explore properties
          </p>
          <h1 className="mt-3 text-[1.9rem] leading-tight font-extrabold sm:text-4xl lg:text-5xl">
            Find a property with <span className="font-accent text-gradient-brand">paperwork you can trust</span>
          </h1>
          <p className="mt-3 max-w-2xl text-[0.98rem] leading-relaxed text-body sm:text-lg">
            Homes, offices, warehouses and land across Nigeria, listed by registered Estate Surveyors &amp; Valuers who
            review the documents before a property goes live.
          </p>
        </div>
      </div>

      <PropertyExplorer
        // Only what a card shows travels to the browser.
        properties={properties.map((p) => ({ ...p, description: "", features: [], images: p.images.slice(0, 1) }))}
      />
    </div>
  );
}

