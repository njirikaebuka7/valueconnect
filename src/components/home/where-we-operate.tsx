"use client";

import { ArrowRight, MapPin } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { PropertyCard } from "@/components/property/property-card";
import { Accent, SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/format";
import { featuredCities } from "@/lib/options";
import type { Property } from "@/lib/types";

export function WhereWeOperate({ properties }: { properties: Property[] }) {
  const cities = useMemo(
    () =>
      featuredCities
        .map((c) => ({ ...c, items: properties.filter((p) => p.city === c.city) }))
        .filter((c) => c.items.length > 0),
    [properties],
  );
  const [active, setActive] = useState(cities[0]?.city ?? "");
  const current = cities.find((c) => c.city === active) ?? cities[0];
  if (!current) return null;

  return (
    <section className="bg-surface py-20 sm:py-24">
      <div className="container-x">
        <SectionHeading
          eyebrow="Where we operate"
          title={
            <>
              Nationwide reach, <Accent>local</Accent> knowledge
            </>
          }
          description="Headquartered in Victoria Island, Lagos, with valuers who know each market street by street."
        />

        <div role="tablist" aria-label="Cities" className="no-scrollbar -mx-4 mt-8 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          {cities.map((c) => (
            <button
              key={c.city}
              role="tab"
              aria-selected={c.city === current.city}
              onClick={() => setActive(c.city)}
              className={cn(
                "inline-flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition",
                c.city === current.city
                  ? "bg-navy-700 text-white shadow-[0_8px_20px_-10px_rgb(1_51_152/0.8)]"
                  : "bg-white text-body ring-1 ring-line hover:text-navy-800",
              )}
            >
              <MapPin className="h-4 w-4" />
              {c.city}
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[0.7rem]",
                  c.city === current.city ? "bg-white/15 text-aqua-200" : "bg-surface text-muted",
                )}
              >
                {c.items.length}
              </span>
            </button>
          ))}
        </div>

        <p className="mt-4 text-sm text-muted">
          Areas include {current.areas.slice(0, 5).join(", ")} and more.
        </p>

        <div
          key={current.city}
          className="animate-fade-in no-scrollbar -mx-4 mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pt-2 pb-6 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 lg:grid-cols-3"
        >
          {current.items.slice(0, 6).map((p) => (
            <div key={p.id} className="w-[82%] shrink-0 snap-start sm:w-auto">
              <PropertyCard property={p} className="h-full" />
            </div>
          ))}
        </div>

        <div className="mt-4 text-center">
          <Link
            href={`/properties?city=${encodeURIComponent(current.city)}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-navy-700 hover:gap-3 hover:text-navy-900"
          >
            All properties in {current.city} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
