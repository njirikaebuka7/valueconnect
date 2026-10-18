import { BadgeCheck, FileText, LockKeyhole, Phone } from "lucide-react";
import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { Accent } from "@/components/ui/section-heading";
import { WhatsAppIcon } from "@/components/ui/social-icons";
import { ValuationWizard, type WizardInitial, type WizardProperty } from "@/components/valuation/valuation-wizard";
import { requiredDocuments, valuationSteps } from "@/lib/content";
import { getPropertyBySlug } from "@/lib/data/properties";
import { photos } from "@/lib/images";
import { nigerianStates, valuationAssetTypes, valuationPurposes } from "@/lib/options";
import { getContact } from "@/lib/settings";
import { site, whatsappLink } from "@/lib/site";
import type { PropertyType } from "@/lib/types";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Request a Property Valuation in Lagos & Nigeria",
  description:
    "Request an independent, signed and sealed valuation for mortgage, financial reporting, insurance or sale from ESVARBON-registered valuers. Written fee quote.",
  path: "/valuation",
});

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

const assetTypeFor: Record<PropertyType, (typeof valuationAssetTypes)[number]> = {
  detached: "Residential house",
  "semi-detached": "Residential house",
  terrace: "Residential house",
  duplex: "Residential house",
  bungalow: "Residential house",
  apartment: "Apartment / flat",
  penthouse: "Apartment / flat",
  land: "Bare land",
  office: "Commercial / office",
  commercial: "Commercial / office",
  warehouse: "Industrial / warehouse",
};

function matchState(input: string) {
  const needle = input.trim().toLowerCase();
  if (!needle) return "";
  return nigerianStates.find((s) => s.toLowerCase() === needle || s.toLowerCase().includes(needle)) ?? "";
}

function matchAssetType(input: string) {
  if (!input) return "";
  const direct = valuationAssetTypes.find((t) => t.toLowerCase() === input.toLowerCase());
  if (direct) return direct;
  return assetTypeFor[input as PropertyType] ?? "";
}

function tomorrow() {
  const d = new Date(Date.now() + 86_400_000);
  // Lagos is UTC+1 with no DST; good enough for a date picker minimum.
  d.setUTCHours(d.getUTCHours() + 1);
  return d.toISOString().slice(0, 10);
}

export default async function ValuationPage({ searchParams }: Props) {
  const [sp, contact] = await Promise.all([searchParams, getContact()]);
  const get = (k: string) => (typeof sp[k] === "string" ? (sp[k] as string) : "");

  const slug = get("property");
  const listing = slug ? await getPropertyBySlug(slug) : null;

  const purpose = valuationPurposes.some((p) => p.value === get("purpose")) ? get("purpose") : "";
  const initial: WizardInitial = {
    purpose: purpose || (listing ? "sale_purchase" : ""),
    property_type: listing ? assetTypeFor[listing.propertyType] : matchAssetType(get("type")),
    state: listing ? matchState(listing.state) : matchState(get("state")),
    city: listing ? [listing.area, listing.city].filter(Boolean).join(", ") : get("city"),
    address: listing?.address ?? "",
    land_size: listing?.sizeSqm ? `${listing.sizeSqm.toLocaleString()} sqm` : "",
    title_document: listing?.titleDocument ?? "",
  };
  const property: WizardProperty | null = listing
    ? {
        id: listing.id,
        slug: listing.slug,
        title: listing.title,
        image: listing.images[0] ?? null,
        place: [listing.area, listing.city].filter(Boolean).join(", "),
      }
    : null;

  return (
    <>
      <PageHero
        eyebrow="Request a valuation"
        image={photos.heroValuation}
        title={
          <>
            Know what your assets are <Accent tone="dark">truly worth</Accent>
          </>
        }
        description="Independent, inspection-led valuations of land, buildings, plant & machinery and other assets, signed by ESVARBON-registered Estate Surveyors & Valuers."
      />

      <section className="relative z-10 -mt-10 pb-24 sm:-mt-14 lg:pb-32">
        <div className="container-x grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-8">
          <div className="rounded-[2rem] bg-white p-5 shadow-lift ring-1 ring-line/80 sm:p-8 lg:p-10">
            <ValuationWizard initial={initial} property={property} minDate={tomorrow()} />
          </div>

          <aside className="space-y-5">
            <div className="rounded-[1.75rem] bg-white p-6 shadow-card ring-1 ring-line/80">
              <h2 className="text-base font-extrabold">What happens next</h2>
              <ol className="relative mt-5 space-y-5 before:absolute before:top-2 before:bottom-2 before:left-[0.9rem] before:w-px before:bg-line">
                {valuationSteps.map((s, i) => (
                  <li key={s.title} className="relative flex gap-4">
                    <span className="relative z-10 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-navy-700 text-xs font-bold text-white ring-4 ring-white">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-ink">{s.title}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-body">{s.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-[1.75rem] bg-white p-6 shadow-card ring-1 ring-line/80">
              <h2 className="flex items-center gap-2 text-base font-extrabold">
                <FileText className="h-5 w-5 text-aqua-600" /> Documents to prepare
              </h2>
              <ul className="mt-4 space-y-2.5">
                {requiredDocuments.map((d) => (
                  <li key={d} className="flex gap-2.5 text-xs leading-relaxed text-body">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-aqua-500" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-navy-900 relative overflow-hidden rounded-[1.75rem] p-6 text-white shadow-lift">
              <div className="relative">
                <div className="flex flex-wrap gap-2">
                  {site.accreditations.map((a) => (
                    <span key={a.code} title={a.name} className="glass rounded-full px-3 py-1 text-[0.7rem] font-bold tracking-wider text-aqua-200">
                      {a.code}
                    </span>
                  ))}
                </div>
                <p className="mt-4 flex items-start gap-2.5 text-sm leading-relaxed text-navy-100/85">
                  <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-aqua-300" />
                  Every report is signed by an ESVARBON-registered valuer and carries their seal and stamp.
                </p>
                <p className="mt-3 flex items-start gap-2.5 text-sm leading-relaxed text-navy-100/85">
                  <LockKeyhole className="mt-0.5 h-5 w-5 shrink-0 text-aqua-300" />
                  Your details and report stay confidential to you and the parties you name.
                </p>
                <div className="mt-5 grid grid-cols-2 gap-2">
                  <a
                    href={`tel:${contact.phones[0].tel}`}
                    className="glass inline-flex h-11 items-center justify-center gap-2 rounded-xl text-sm font-semibold text-white hover:bg-white/20"
                  >
                    <Phone className="h-4 w-4" /> Call
                  </a>
                  <a
                    href={whatsappLink(contact.whatsapp, "Hello Valueconnect, I'd like to request a property valuation.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-aqua-500 text-sm font-semibold text-navy-950 hover:bg-aqua-400"
                  >
                    <WhatsAppIcon className="h-4 w-4" /> WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
