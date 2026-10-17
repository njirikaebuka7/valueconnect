import {
  ArrowRight,
  Bath,
  BedDouble,
  Building2,
  Car,
  Check,
  ChevronRight,
  FileCheck2,
  MapPin,
  Phone,
  Ruler,
  ShieldCheck,
  Toilet,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LogoMark } from "@/components/brand/logo";
import { EnquiryForm } from "@/components/forms/enquiry-form";
import { PropertyActionBar } from "@/components/property/property-action-bar";
import { PropertyCard } from "@/components/property/property-card";
import { PropertyGallery } from "@/components/property/property-gallery";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/ui/social-icons";
import { getPropertyBySlug, getPublishedProperties, similarProperties } from "@/lib/data/properties";
import { cn, formatNaira, formatPrice } from "@/lib/format";
import { listingTypeLabels, propertyStatusLabels, propertyTypeLabels } from "@/lib/options";
import { site, whatsappLink } from "@/lib/site";
import type { Property } from "@/lib/types";

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const all = await getPublishedProperties();
  return all.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = await getPropertyBySlug(slug);
  if (!p) return { title: "Property not found" };
  const place = [p.area, p.city].filter(Boolean).join(", ");
  const title = `${p.title}, ${place}`;
  const description = `${listingTypeLabels[p.listingType]} · ${formatPrice(p)} · ${p.description.slice(0, 140)}`;
  return {
    title,
    description,
    alternates: { canonical: `/properties/${p.slug}` },
    openGraph: {
      title,
      description,
      type: "website",
      images: p.images[0] ? [{ url: p.images[0].startsWith("https://images.unsplash.com/") ? `${p.images[0]}?auto=format&fit=crop&w=1200&h=630&q=75` : p.images[0] }] : undefined,
    },
  };
}

export default async function PropertyPage({ params }: Props) {
  const { slug } = await params;
  const [property, all] = await Promise.all([getPropertyBySlug(slug), getPublishedProperties()]);
  if (!property) notFound();

  const p = property;
  const similar = similarProperties(all, p);
  const url = `${site.url}/properties/${p.slug}`;
  const price = formatPrice(p);
  const place = [p.area, p.city, p.state !== p.city ? p.state.replace("FCT - ", "") : ""].filter(Boolean).join(", ");
  const perSqm =
    p.listingType === "sale" && !p.priceOnRequest && p.price && p.sizeSqm ? Math.round(p.price / p.sizeSqm) : null;

  return (
    <div className="bg-white pt-16 pb-44 lg:pt-28 lg:pb-28">
      <div className="container-x">
        <nav aria-label="Breadcrumb" className="mb-5 hidden items-center gap-1.5 text-sm text-muted lg:flex">
          <Link href="/properties" className="font-semibold hover:text-navy-700">
            Properties
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href={`/properties?city=${encodeURIComponent(p.city)}`} className="font-semibold hover:text-navy-700">
            {p.city}
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="truncate text-ink">{p.title}</span>
        </nav>

        <PropertyGallery images={p.images} title={p.title} slug={p.slug} />

        <div className="mt-6 grid gap-10 lg:mt-10 lg:grid-cols-[minmax(0,1fr)_380px] xl:gap-14">
          <div className="min-w-0">
            {/* Heading */}
            <div className="flex flex-wrap gap-2">
              <Badge tone="navy">{listingTypeLabels[p.listingType]}</Badge>
              <Badge tone="slate">{propertyTypeLabels[p.propertyType]}</Badge>
              {p.status !== "available" && <Badge tone="amber">{propertyStatusLabels[p.status]}</Badge>}
              {p.featured && <Badge tone="aqua">Featured</Badge>}
            </div>
            <h1 className="mt-3 text-[1.7rem] leading-tight font-extrabold sm:text-4xl">{p.title}</h1>
            <p className="mt-2 flex items-start gap-1.5 text-[0.95rem] text-body">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-aqua-600" />
              {p.address || place}
            </p>
            <div className="mt-4 flex flex-wrap items-end gap-x-4 gap-y-1">
              <p className="text-3xl font-extrabold tracking-tight text-navy-700 sm:text-[2.1rem]">{price}</p>
              {perSqm && <p className="pb-1 text-sm font-semibold text-muted">≈ {formatNaira(perSqm)} per sqm</p>}
            </div>

            <KeyFacts p={p} />

            {p.titleDocument && (
              <div className="mt-6 flex gap-4 rounded-3xl bg-gradient-to-br from-aqua-50 to-navy-50 p-5 ring-1 ring-aqua-100">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white text-aqua-600 shadow-card">
                  <ShieldCheck className="h-6 w-6" />
                </span>
                <div>
                  <p className="text-xs font-bold tracking-[0.12em] text-aqua-700 uppercase">Title document</p>
                  <p className="mt-1 font-bold text-ink">{p.titleDocument}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-body">
                    {p.verified
                      ? "Our land administration team has reviewed the title documents for this listing. We still recommend an independent search by your solicitor before you pay."
                      : "Title documents are available for inspection on request. We recommend an independent search by your solicitor before you pay."}
                  </p>
                </div>
              </div>
            )}

            <section className="mt-10">
              <h2 className="text-xl font-extrabold">About this property</h2>
              <div className="mt-3 space-y-4 text-[0.98rem] leading-relaxed whitespace-pre-line text-body">{p.description}</div>
            </section>

            {p.features.length > 0 && (
              <section className="mt-10">
                <h2 className="text-xl font-extrabold">Features &amp; amenities</h2>
                <ul className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 rounded-2xl bg-surface px-3.5 py-3 text-sm font-medium text-ink">
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-aqua-500 text-navy-950">
                        <Check className="h-3.5 w-3.5" strokeWidth={3} />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="mt-10">
              <h2 className="text-xl font-extrabold">Location</h2>
              <p className="mt-1 text-sm text-body">{place}</p>
              <div className="mt-4 overflow-hidden rounded-3xl ring-1 ring-line">
                <iframe
                  title={`Map showing ${place}`}
                  src={`https://www.google.com/maps?q=${encodeURIComponent(p.address || place)}&output=embed`}
                  className="h-72 w-full sm:h-80"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <p className="mt-2 text-xs text-muted">Map location is approximate. Exact address shared on viewing.</p>
            </section>

            <section className="bg-navy-mesh relative mt-10 overflow-hidden rounded-[2rem] p-6 text-white sm:p-8">
              <div className="bg-grid-faint absolute inset-0 opacity-50" aria-hidden />
              <div className="relative sm:flex sm:items-center sm:justify-between sm:gap-8">
                <div>
                  <p className="flex items-center gap-2 text-xs font-bold tracking-[0.14em] text-aqua-300 uppercase">
                    <FileCheck2 className="h-4 w-4" /> Buying or lending against it?
                  </p>
                  <h2 className="mt-2 text-2xl font-extrabold text-white">
                    Need this property <span className="font-accent text-aqua-300">valued?</span>
                  </h2>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-navy-100/80">
                    Get an independent, signed and sealed valuation report from ESVARBON-registered valuers before you
                    commit.
                  </p>
                </div>
                <ButtonLink
                  href={`/valuation?property=${encodeURIComponent(p.slug)}`}
                  variant="accent"
                  size="lg"
                  className="mt-5 sm:mt-0"
                >
                  Request a valuation <ArrowRight className="h-4 w-4" />
                </ButtonLink>
              </div>
            </section>
          </div>

          {/* Desktop sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 space-y-5">
              <div className="rounded-[1.75rem] bg-white p-6 shadow-lift ring-1 ring-line/80">
                <p className="text-xs font-bold tracking-[0.12em] text-muted uppercase">{listingTypeLabels[p.listingType]}</p>
                <p className="mt-1 text-2xl font-extrabold tracking-tight text-navy-700">{price}</p>
                <div className="mt-5 flex items-center gap-3 rounded-2xl bg-surface p-3.5">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white shadow-card">
                    <LogoMark className="w-8" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-ink">Valueconnect Agency Desk</p>
                    <p className="text-xs text-muted">Registered Estate Surveyors &amp; Valuers</p>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <a
                    href={`tel:${site.phones[0].tel}`}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-surface text-sm font-semibold text-navy-800 ring-1 ring-line transition hover:bg-navy-50"
                  >
                    <Phone className="h-4 w-4" /> Call
                  </a>
                  <a
                    href={whatsappLink(`Hello Valueconnect, I'm interested in "${p.title}" ${url}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-surface text-sm font-semibold text-navy-800 ring-1 ring-line transition hover:bg-navy-50"
                  >
                    <WhatsAppIcon className="h-4 w-4" /> WhatsApp
                  </a>
                </div>
                <div className="my-5 h-px bg-line" />
                <p className="text-sm font-bold text-ink">Send an enquiry</p>
                <EnquiryForm propertyId={p.id} propertyTitle={p.title} idPrefix="sidebar" className="mt-3" />
              </div>
            </div>
          </aside>
        </div>

        {similar.length > 0 && (
          <section className="mt-16 lg:mt-24">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="eyebrow">
                  <span className="h-px w-6 bg-aqua-500" />
                  You may also like
                </p>
                <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl">Similar properties</h2>
              </div>
              <Link href="/properties" className="hidden items-center gap-1 text-sm font-semibold text-navy-700 hover:underline sm:inline-flex">
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="no-scrollbar -mx-4 mt-6 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 lg:grid-cols-3">
              {similar.map((s) => (
                <PropertyCard key={s.id} property={s} className="w-[82%] shrink-0 snap-start sm:w-auto" />
              ))}
            </div>
          </section>
        )}
      </div>

      <PropertyActionBar propertyId={p.id} propertyTitle={p.title} price={price} url={url} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(p, url)).replace(/</g, "\\u003c") }}
      />
    </div>
  );
}

function KeyFacts({ p }: { p: Property }) {
  const facts = [
    { icon: BedDouble, label: "Bedrooms", value: p.bedrooms },
    { icon: Bath, label: "Bathrooms", value: p.bathrooms },
    { icon: Toilet, label: "Toilets", value: p.toilets },
    { icon: Car, label: "Parking", value: p.parking },
    { icon: Ruler, label: "Size", value: p.sizeSqm != null ? `${p.sizeSqm.toLocaleString()} sqm` : null },
    { icon: Building2, label: "Type", value: propertyTypeLabels[p.propertyType] },
  ].filter((f) => f.value != null);

  return (
    <dl
      className={cn(
        "mt-6 grid grid-cols-3 gap-2.5",
        facts.length > 3 && "sm:grid-cols-6",
        facts.length <= 3 && "sm:grid-cols-3",
      )}
    >
      {facts.map(({ icon: Icon, label, value }) => (
        <div key={label} className="rounded-2xl bg-surface px-3 py-3.5 text-center ring-1 ring-line/60">
          <Icon className="mx-auto h-5 w-5 text-navy-500" />
          <dd className="mt-2 truncate text-sm font-extrabold text-ink">{value}</dd>
          <dt className="text-[0.7rem] font-medium text-muted">{label}</dt>
        </div>
      ))}
    </dl>
  );
}

function jsonLd(p: Property, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: p.title,
    description: p.description,
    url,
    datePosted: p.createdAt,
    image: p.images,
    offers: p.priceOnRequest
      ? undefined
      : {
          "@type": "Offer",
          price: p.price,
          priceCurrency: "NGN",
          availability: p.status === "available" ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
          businessFunction: p.listingType === "sale" ? "http://purl.org/goodrelations/v1#Sell" : "http://purl.org/goodrelations/v1#LeaseOut",
        },
    about: {
      "@type": p.propertyType === "land" ? "Landform" : p.propertyType === "apartment" ? "Apartment" : "SingleFamilyResidence",
      numberOfRooms: p.bedrooms ?? undefined,
      floorSize: p.sizeSqm ? { "@type": "QuantitativeValue", value: p.sizeSqm, unitCode: "MTK" } : undefined,
      address: {
        "@type": "PostalAddress",
        streetAddress: p.address,
        addressLocality: p.city,
        addressRegion: p.state,
        addressCountry: "NG",
      },
    },
    provider: { "@type": "RealEstateAgent", name: site.name, telephone: site.phones[0].tel, email: site.email },
  };
}
