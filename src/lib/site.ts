export const site = {
  name: "Valueconnect Consulting",
  shortName: "Valueconnect",
  tagline: "Estate Surveyors & Valuers",
  description:
    "ESVARBON-registered Estate Surveyors & Valuers in Lagos: valuations of land, buildings, plant & machinery and other assets, plus estate agency, facility management, land administration and auctioneering across Nigeria.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://valueconnect.com.ng").replace(/\/$/, ""),
  address: {
    street: "17, Musa Yar'adua Street",
    area: "Off Kofo Abayomi Street, Victoria Island",
    city: "Lagos",
    full: "17, Musa Yar'adua Street, Off Kofo Abayomi Street, Victoria Island, Lagos.",
  },
  phones: [
    { display: "0814 483 3999", tel: "+2348144833999" },
    { display: "0811 090 0644", tel: "+2348110900644" },
  ],
  // TODO(owner): confirm which line is on WhatsApp.
  whatsapp: "2348144833999",
  email: "info@valueconnect.com.ng",
  mapEmbed:
    "https://www.google.com/maps?q=17+Musa+Yar%27adua+Street,+Victoria+Island,+Lagos&output=embed",
  mapLink: "https://maps.google.com/?q=17+Musa+Yar%27adua+Street,+Victoria+Island,+Lagos",
  // Leave a link empty to hide its icon.
  socials: {
    facebook: "",
    x: "",
    instagram: "",
    linkedin: "",
  },
  accreditations: [
    { code: "NIESV", name: "Nigerian Institution of Estate Surveyors and Valuers" },
    { code: "ESVARBON", name: "Estate Surveyors & Valuers Registration Board of Nigeria" },
    { code: "IVS", name: "International Valuation Standards" },
  ],
} as const;

export const mainNav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/properties", label: "Properties" },
  { href: "/contact", label: "Contact" },
] as const;

export function whatsappLink(message?: string) {
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${site.whatsapp}${text}`;
}
