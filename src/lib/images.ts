/**
 * Every photo on the site, by slot. docs/images.md describes what each slot
 * should show and its size.
 *
 * A slot uses public/images/<name>.jpg once its name is listed in LOCAL;
 * until then it falls back to a free stock photo. Property photos uploaded
 * through the admin live in Supabase Storage instead.
 */
const LOCAL = new Set<string>([
  "about-interior",
  "about-office",
  "about-team",
  "about-valuer",
  "cta-band",
  "hero-about",
  "hero-consultation",
  "hero-contact",
  "hero-home",
  "hero-services",
  "hero-track",
  "hero-valuation",
  "service-auctioneering",
  "service-estate-agency",
  "service-facility-management",
  "service-feasibility",
  "service-land-administration",
  "service-valuations",
  "type-apartment",
  "type-bungalow",
  "type-detached",
  "type-duplex",
  "type-land",
  "type-office",
  "type-terrace",
  "type-warehouse",
  "why-choose-us",
]);

const u = (id: string) => `https://images.unsplash.com/${id}`;
const px = (id: number) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg`;
const slot = (name: string, fallback: string) => (LOCAL.has(name) ? `/images/${name}.jpg` : fallback);

export const photos = {
  // Page heroes: wide shots, shown under a navy tint.
  heroHome: slot("hero-home", u("photo-1613490493576-7fde63acd811")),
  heroAbout: slot("hero-about", u("photo-1486406146926-c627a92ad1ab")),
  heroServices: slot("hero-services", px(32656347)),
  heroValuation: slot("hero-valuation", px(106399)),
  heroTrack: slot("hero-track", u("photo-1600585154340-be6161a56a0c")),
  heroContact: slot("hero-contact", u("photo-1497366216548-37526070297c")),
  heroConsultation: slot("hero-consultation", px(30688592)),
  ctaBand: slot("cta-band", u("photo-1600596542815-ffad4c1539a9")),

  // Section photos.
  aboutValuer: slot("about-valuer", px(5668873)),
  aboutInterior: slot("about-interior", px(7061396)),
  whyChooseUs: slot("why-choose-us", px(30688591)),
  aboutTeam: slot("about-team", px(30689114)),
  aboutOffice: slot("about-office", px(7534181)),

  // "Browse by property type" tiles: portrait.
  typeApartment: slot("type-apartment", px(20430716)),
  typeDuplex: slot("type-duplex", px(1115804)),
  typeDetached: slot("type-detached", px(28122111)),
  typeTerrace: slot("type-terrace", px(9279740)),
  typeBungalow: slot("type-bungalow", px(34277704)),
  typeLand: slot("type-land", px(5668958)),
  typeOffice: slot("type-office", px(3855622)),
  typeWarehouse: slot("type-warehouse", px(20507715)),
} as const;

export const serviceImages = {
  valuations: slot("service-valuations", px(11174202)),
  "property-facility-management": slot("service-facility-management", px(8487402)),
  "estate-agency": slot("service-estate-agency", px(8470845)),
  "feasibility-viability-appraisal": slot("service-feasibility", px(11174197)),
  "land-administration": slot("service-land-administration", px(13279686)),
  auctioneering: slot("service-auctioneering", px(5668484)),
} as const;

/** Local photos reused as covers for the sample listings in src/lib/seed. */
export const local = (name: string) => `/images/${name}.jpg`;

/** Stock photo pools for the sample listings' extra gallery shots. */
export const img = {
  interiors: [
    u("photo-1600210492486-724fe5c67fb0"),
    u("photo-1600566753190-17f0baa2a6c3"),
    u("photo-1600607687644-c7171b42498b"),
    u("photo-1560448204-e02f11c3d0e2"),
    u("photo-1502672260266-1c1ef2d93688"),
    u("photo-1522708323590-d24dbb6b0267"),
  ],
  commercial: [
    u("photo-1486406146926-c627a92ad1ab"),
    u("photo-1497366216548-37526070297c"),
    u("photo-1497366811353-6870744d04b2"),
  ],
} as const;
