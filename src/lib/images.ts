/**
 * Every photo on the site, by slot. docs/images.md describes what each slot
 * should show and its size.
 *
 * A slot uses public/images/<name>.jpg once its name is listed in LOCAL;
 * until then it falls back to a free stock photo. Property photos uploaded
 * through the admin live in Supabase Storage instead.
 */
const LOCAL = new Set<string>([]);

const u = (id: string) => `https://images.unsplash.com/${id}`;
const slot = (name: string, fallback: string) => (LOCAL.has(name) ? `/images/${name}.jpg` : fallback);

export const photos = {
  // Page heroes: wide shots, shown under a navy tint.
  heroHome: slot("hero-home", u("photo-1613490493576-7fde63acd811")),
  heroAbout: slot("hero-about", u("photo-1486406146926-c627a92ad1ab")),
  heroServices: slot("hero-services", u("photo-1541888946425-d81bb19240f5")),
  heroValuation: slot("hero-valuation", u("photo-1600596542815-ffad4c1539a9")),
  heroTrack: slot("hero-track", u("photo-1600585154340-be6161a56a0c")),
  heroContact: slot("hero-contact", u("photo-1497366216548-37526070297c")),
  heroConsultation: slot("hero-consultation", u("photo-1556761175-5973dc0f32e7")),
  ctaBand: slot("cta-band", u("photo-1600596542815-ffad4c1539a9")),

  // Section photos.
  aboutValuer: slot("about-valuer", u("photo-1573497019940-1c28c88b4f3e")),
  aboutInterior: slot("about-interior", u("photo-1600210492486-724fe5c67fb0")),
  whyChooseUs: slot("why-choose-us", u("photo-1521791136064-7986c2920216")),
  aboutTeam: slot("about-team", u("photo-1600880292203-757bb62b4baf")),
  aboutOffice: slot("about-office", u("photo-1497366811353-6870744d04b2")),

  // "Browse by property type" tiles: portrait.
  typeApartment: slot("type-apartment", u("photo-1545324418-cc1a3fa10c00")),
  typeDuplex: slot("type-duplex", u("photo-1564013799919-ab600027ffc6")),
  typeDetached: slot("type-detached", u("photo-1600585154340-be6161a56a0c")),
  typeTerrace: slot("type-terrace", u("photo-1580587771525-78b9dba3b914")),
  typeBungalow: slot("type-bungalow", u("photo-1570129477492-45c003edd2be")),
  typeLand: slot("type-land", u("photo-1500382017468-9049fed747ef")),
  typeOffice: slot("type-office", u("photo-1486406146926-c627a92ad1ab")),
  typeWarehouse: slot("type-warehouse", u("photo-1497366811353-6870744d04b2")),
} as const;

export const serviceImages = {
  valuations: slot("service-valuations", u("photo-1573497019940-1c28c88b4f3e")),
  "property-facility-management": slot("service-facility-management", u("photo-1497366216548-37526070297c")),
  "estate-agency": slot("service-estate-agency", u("photo-1521791136064-7986c2920216")),
  "feasibility-viability-appraisal": slot("service-feasibility", u("photo-1600880292203-757bb62b4baf")),
  "land-administration": slot("service-land-administration", u("photo-1500382017468-9049fed747ef")),
  auctioneering: slot("service-auctioneering", u("photo-1556761175-5973dc0f32e7")),
} as const;

/** Photo pools for the sample listings in src/lib/seed. */
export const img = {
  houses: [
    u("photo-1600585154340-be6161a56a0c"),
    u("photo-1600596542815-ffad4c1539a9"),
    u("photo-1613490493576-7fde63acd811"),
    u("photo-1564013799919-ab600027ffc6"),
    u("photo-1568605114967-8130f3a36994"),
    u("photo-1580587771525-78b9dba3b914"),
    u("photo-1512917774080-9991f1c4c750"),
    u("photo-1570129477492-45c003edd2be"),
    u("photo-1600607687939-ce8a6c25118c"),
    u("photo-1605276374104-dee2a0ed3cd6"),
    u("photo-1583608205776-bfd35f0d9f83"),
    u("photo-1545324418-cc1a3fa10c00"),
  ],
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
  land: [u("photo-1500382017468-9049fed747ef"), u("photo-1541888946425-d81bb19240f5")],
} as const;
