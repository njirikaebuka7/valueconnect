import { Bath, BedDouble, MapPin, Ruler, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Photo } from "@/components/ui/photo";
import { cn, formatPrice } from "@/lib/format";
import { listingTypeLabels, propertyStatusLabels, propertyTypeLabels } from "@/lib/options";
import type { Property } from "@/lib/types";
import { FavoriteButton } from "./favorite-button";

export function PropertyCard({
  property: p,
  className,
  layout = "grid",
  priority = false,
}: {
  property: Property;
  className?: string;
  layout?: "grid" | "row";
  priority?: boolean;
}) {
  const row = layout === "row";
  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-line/80 transition duration-300 hover:-translate-y-1 hover:shadow-lift",
        className,
      )}
    >
      <Link href={`/properties/${p.slug}`} className={cn("block", row && "flex")}>
        <div
          className={cn(
            "relative overflow-hidden bg-navy-950",
            row ? "aspect-square w-32 shrink-0 sm:w-56 sm:aspect-[4/3]" : "aspect-[4/3]",
          )}
        >
          <Photo
            src={p.images[0]}
            alt={p.title}
            fill
            preload={priority}
            sizes={row ? "(min-width: 640px) 224px, 128px" : "(min-width: 1024px) 400px, (min-width: 640px) 50vw, 90vw"}
            className="object-cover transition duration-700 group-hover:scale-[1.06]"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-navy-950/60 to-transparent" />
          <div className={cn("absolute top-3 left-3 flex flex-wrap gap-1.5", row && "max-sm:hidden")}>
            {p.featured && (
              <span className="rounded-full bg-aqua-500 px-2.5 py-1 text-[0.68rem] font-bold text-navy-950 shadow-sm">
                Featured
              </span>
            )}
            {p.status !== "available" ? (
              <span className="rounded-full bg-navy-950/80 px-2.5 py-1 text-[0.68rem] font-bold text-white backdrop-blur">
                {propertyStatusLabels[p.status]}
              </span>
            ) : null}
          </div>
          <span
            className={cn(
              "glass-chip absolute bottom-3 left-3 rounded-full px-2.5 py-1 text-[0.68rem] font-bold text-navy-900",
              row && "max-sm:hidden",
            )}
          >
            {listingTypeLabels[p.listingType]}
          </span>
        </div>

        <div className={cn("min-w-0 p-4 sm:p-5", row && "flex flex-1 flex-col justify-center py-3 sm:py-5")}>
          <p className="flex items-center gap-1 truncate text-xs font-medium text-muted">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-aqua-600" />
            {p.area ? `${p.area}, ` : ""}
            {p.city}
          </p>
          <h3 className="mt-1.5 line-clamp-1 text-[0.98rem] font-bold text-ink sm:text-base">{p.title}</h3>
          <p className="mt-1.5 text-lg font-extrabold tracking-tight text-navy-700">{formatPrice(p)}</p>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-line pt-3 text-xs font-medium text-body">
            {p.bedrooms != null && (
              <span className="flex items-center gap-1.5">
                <BedDouble className="h-4 w-4 text-navy-400" />
                {p.bedrooms} bed{p.bedrooms === 1 ? "" : "s"}
              </span>
            )}
            {p.bathrooms != null && (
              <span className="flex items-center gap-1.5">
                <Bath className="h-4 w-4 text-navy-400" />
                {p.bathrooms} bath{p.bathrooms === 1 ? "" : "s"}
              </span>
            )}
            {p.sizeSqm != null && (
              <span className="flex items-center gap-1.5">
                <Ruler className="h-4 w-4 text-navy-400" />
                {p.sizeSqm.toLocaleString()} sqm
              </span>
            )}
            {p.bedrooms == null && p.bathrooms == null && (
              <span className="text-muted">{propertyTypeLabels[p.propertyType]}</span>
            )}
          </div>
          {p.verified && p.titleDocument && !row && (
            <p className="mt-3 flex items-center gap-1.5 text-[0.7rem] font-semibold text-aqua-700">
              <ShieldCheck className="h-3.5 w-3.5" />
              Title reviewed · {p.titleDocument.replace(/\s*\(.*\)$/, "")}
            </p>
          )}
        </div>
      </Link>
      <FavoriteButton slug={p.slug} className="absolute top-3 right-3" />
    </article>
  );
}
