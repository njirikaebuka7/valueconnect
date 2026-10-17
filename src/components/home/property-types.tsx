import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Photo } from "@/components/ui/photo";
import { Accent, SectionHeading } from "@/components/ui/section-heading";
import { photos } from "@/lib/images";
import { propertyTypeLabels } from "@/lib/options";
import type { Property, PropertyType } from "@/lib/types";

const tiles: { type: PropertyType; image: string; label?: string }[] = [
  { type: "apartment", image: photos.typeApartment },
  { type: "duplex", image: photos.typeDuplex },
  { type: "detached", image: photos.typeDetached },
  { type: "terrace", image: photos.typeTerrace },
  { type: "bungalow", image: photos.typeBungalow },
  { type: "land", image: photos.typeLand, label: "Land & plots" },
  { type: "office", image: photos.typeOffice, label: "Offices" },
  { type: "warehouse", image: photos.typeWarehouse, label: "Warehouses" },
];

export function PropertyTypes({ properties }: { properties: Property[] }) {
  const counts = properties.reduce<Record<string, number>>((acc, p) => {
    acc[p.propertyType] = (acc[p.propertyType] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <section className="bg-surface py-20 sm:py-24">
      <div className="container-x">
        <SectionHeading
          eyebrow="Find your fit"
          title={
            <>
              Browse by <Accent>property type</Accent>
            </>
          }
          description="From city apartments to family duplexes, commercial floors and land ready to build on."
        />
      </div>
      <div className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-4 sm:scroll-px-6 sm:px-6 lg:scroll-px-[max(2rem,calc((100vw-80rem)/2+2rem))] lg:px-[max(2rem,calc((100vw-80rem)/2+2rem))]">
        {tiles.map((t, i) => {
          const count = counts[t.type] ?? 0;
          return (
            <Link
              key={t.type}
              href={`/properties?type=${t.type}`}
              data-reveal
              style={{ "--reveal-delay": `${Math.min(i, 4) * 80}ms` } as React.CSSProperties}
              className="group relative aspect-[3/4] w-44 shrink-0 snap-start overflow-hidden rounded-3xl bg-navy-950 shadow-card sm:w-56"
            >
              <Photo
                src={t.image}
                alt={t.label ?? propertyTypeLabels[t.type]}
                fill
                sizes="224px"
                className="object-cover transition duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/20 to-transparent" />
              <span className="glass absolute top-3 right-3 grid h-8 w-8 place-items-center rounded-full text-white transition group-hover:bg-aqua-500 group-hover:text-navy-950">
                <ArrowUpRight className="h-4 w-4" />
              </span>
              <div className="absolute inset-x-3 bottom-3 rounded-2xl glass px-3.5 py-3">
                <p className="text-sm font-bold text-white">{t.label ?? propertyTypeLabels[t.type]}</p>
                <p className="text-xs text-navy-100/80">
                  {count > 0 ? `${count} listing${count === 1 ? "" : "s"}` : "Browse listings"}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
