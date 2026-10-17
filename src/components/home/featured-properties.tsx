import { ArrowRight } from "lucide-react";
import { PropertyCard } from "@/components/property/property-card";
import { ButtonLink } from "@/components/ui/button";
import { Accent, SectionHeading } from "@/components/ui/section-heading";
import type { Property } from "@/lib/types";

export function FeaturedProperties({ properties }: { properties: Property[] }) {
  if (!properties.length) return null;
  return (
    <section className="py-20 sm:py-24">
      <div className="container-x">
        <SectionHeading
          eyebrow="Featured listings"
          title={
            <>
              Homes and spaces, <Accent>verified first</Accent>
            </>
          }
          description="Every listing is reviewed by our valuers before it goes live: documents checked, price grounded in market evidence."
          action={
            <ButtonLink href="/properties" variant="outline">
              View all properties <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          }
        />
        <div className="no-scrollbar -mx-4 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pt-2 pb-6 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 lg:grid-cols-3">
          {properties.map((p, i) => (
            <div
              key={p.id}
              data-reveal
              style={{ "--reveal-delay": `${(i % 3) * 100}ms` } as React.CSSProperties}
              className="w-[82%] shrink-0 snap-start sm:w-auto"
            >
              <PropertyCard property={p} className="h-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
