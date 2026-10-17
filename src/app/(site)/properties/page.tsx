import type { Metadata } from "next";
import { Suspense } from "react";
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
            Find a property with <span className="font-accent text-[1.08em] text-aqua-600">paperwork you can trust</span>
          </h1>
          <p className="mt-3 max-w-2xl text-[0.98rem] leading-relaxed text-body sm:text-lg">
            Homes, offices, warehouses and land across Nigeria, listed by registered Estate Surveyors &amp; Valuers who
            review the documents before a property goes live.
          </p>
        </div>
      </div>

      <Suspense fallback={<ExplorerSkeleton />}>
        <PropertyExplorer properties={properties} />
      </Suspense>
    </div>
  );
}

function ExplorerSkeleton() {
  return (
    <div className="container-x mt-8">
      <div className="h-14 animate-pulse rounded-2xl bg-white shadow-card" />
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-80 animate-pulse rounded-3xl bg-white shadow-card" />
        ))}
      </div>
    </div>
  );
}
