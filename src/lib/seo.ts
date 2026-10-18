import type { Metadata } from "next";
import { services } from "./content";
import { nigerianStates } from "./options";
import { site, type SiteContact } from "./site";

/**
 * Title, description, canonical URL and matching share-card tags for a page.
 * Next merges metadata shallowly, so every page sets its own openGraph block;
 * otherwise it would inherit the home page's title and URL.
 */
export function pageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
  images,
  noindex = false,
}: {
  title: string;
  description: string;
  path: string;
  absoluteTitle?: boolean;
  images?: { url: string; width?: number; height?: number; alt?: string }[];
  noindex?: boolean;
}): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} | ${site.shortName}`;
  // A page's own openGraph block replaces the inherited one, so name the default card explicitly.
  const cards = images ?? [{ url: "/opengraph-image", width: 1200, height: 630, alt: site.name }];
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: "en_NG",
      url: path,
      title: fullTitle,
      description,
      images: cards,
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: cards },
    ...(noindex && { robots: { index: false, follow: true } }),
  };
}

export const absoluteUrl = (path: string) => (/^https?:\/\//.test(path) ? path : `${site.url}${path}`);

export const organizationId = `${site.url}/#organization`;

/** The state named in an address, for schema.org's addressRegion. */
function stateIn(address: string) {
  const name = (s: string) => (s === "FCT - Abuja" ? "Abuja" : s);
  // Whole words, so "Nigeria" doesn't read as Niger State.
  const found = nigerianStates.find((s) => new RegExp(`\\b${name(s)}\\b`, "i").test(address));
  return found && name(found);
}

/** The firm as a local business, plus the website, for every public page. */
export function organizationJsonLd(contact: SiteContact) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["RealEstateAgent", "ProfessionalService"],
        "@id": organizationId,
        name: site.name,
        alternateName: site.shortName,
        description: site.description,
        url: site.url,
        logo: absoluteUrl("/brand/icon-512.png"),
        image: absoluteUrl("/images/hero-home.jpg"),
        telephone: contact.phones[0].tel,
        email: contact.email,
        address: contact.addresses.map((a) => ({
          "@type": "PostalAddress",
          streetAddress: a,
          addressRegion: stateIn(a),
          addressCountry: "NG",
        })),
        contactPoint: contact.phones.map((p) => ({
          "@type": "ContactPoint",
          telephone: p.tel,
          contactType: "customer service",
          areaServed: "NG",
          availableLanguage: "English",
        })),
        areaServed: { "@type": "Country", name: "Nigeria" },
        knowsAbout: [
          "Property valuation",
          "Plant and machinery valuation",
          "Mortgage valuation",
          "Estate agency",
          "Property and facility management",
          "Land administration",
          "Feasibility and viability appraisal",
          "Auctioneering",
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Services",
          itemListElement: services.map((s) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: s.title, url: absoluteUrl(`/services/${s.slug}`) },
          })),
        },
        ...(contact.socials.length > 0 && { sameAs: contact.socials.map((s) => s.href) }),
      },
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        url: site.url,
        name: site.name,
        inLanguage: "en-NG",
        publisher: { "@id": organizationId },
      },
    ],
  };
}

export function breadcrumbJsonLd(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...trail].map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };
}

export function faqJsonLd(items: readonly { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
