export const site = {
  name: "Valueconnect Consulting",
  shortName: "Valueconnect",
  tagline: "Estate Surveyors & Valuers",
  description:
    "ESVARBON-registered Estate Surveyors & Valuers in Lagos: valuations of land, buildings, plant & machinery and other assets, plus estate agency, facility management, land administration and auctioneering across Nigeria.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://valueconnect.com.ng").replace(/\/$/, ""),
  accreditations: [
    { code: "NIESV", name: "Nigerian Institution of Estate Surveyors and Valuers" },
    { code: "ESVARBON", name: "Estate Surveyors & Valuers Registration Board of Nigeria" },
    { code: "IVS", name: "International Valuation Standards" },
  ],
} as const;

export const socialNetworks = [
  { key: "facebook", label: "Facebook", base: "https://facebook.com/" },
  { key: "instagram", label: "Instagram", base: "https://instagram.com/" },
  { key: "x", label: "X (Twitter)", base: "https://x.com/" },
  { key: "linkedin", label: "LinkedIn", base: "https://linkedin.com/company/" },
  { key: "youtube", label: "YouTube", base: "https://youtube.com/@" },
  { key: "tiktok", label: "TikTok", base: "https://tiktok.com/@" },
] as const;

export type SocialKey = (typeof socialNetworks)[number]["key"];

/**
 * Contact details and social links as the admin edits them under Settings
 * (the public.site_settings row). The first address, phone and email in each
 * list is the main one. Empty strings mean "not set".
 */
export type ContactSettings = {
  addresses: string[];
  phones: string[];
  emails: string[];
  whatsapp: string;
} & Record<SocialKey, string>;

export const defaultContactSettings: ContactSettings = {
  addresses: ["17, Musa Yar'adua Street, Off Kofo Abayomi Street, Victoria Island, Lagos."],
  phones: ["0814 483 3999", "0811 090 0644"],
  emails: ["info@valueconnect.com.ng"],
  whatsapp: "0814 483 3999",
  facebook: "",
  instagram: "",
  x: "",
  linkedin: "",
  youtube: "",
  tiktok: "",
};

/** What the site renders: settings with links worked out. */
export interface SiteContact {
  /** Main office, used for the map and directions. */
  address: string;
  addresses: string[];
  mapLink: string;
  mapEmbed: string;
  /** Main line first; it backs every "Call" button. */
  phones: { display: string; tel: string }[];
  /** International digits for wa.me, e.g. 2348144833999. */
  whatsapp: string;
  /** Main inbox. */
  email: string;
  emails: string[];
  /** Only the networks that have a link, in display order. */
  socials: { key: SocialKey; label: string; href: string }[];
}

/** "0814 483 3999" → "2348144833999"; numbers with a country code pass through. */
export function phoneDigits(raw: string) {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("0")) return `234${digits.slice(1)}`;
  if (digits.length === 10 && /^[789]/.test(digits)) return `234${digits}`;
  return digits;
}

const clean = (list: string[] | undefined) => (list ?? []).map((v) => v.trim()).filter(Boolean);

export const mapsLink = (address: string) => `https://maps.google.com/?q=${encodeURIComponent(address)}`;

export function toContact(s: ContactSettings): SiteContact {
  // A list can only be empty if the row is unreadable; fall back rather than render no phone.
  const addresses = clean(s.addresses).length ? clean(s.addresses) : defaultContactSettings.addresses;
  const phones = clean(s.phones).length ? clean(s.phones) : defaultContactSettings.phones;
  const emails = clean(s.emails).length ? clean(s.emails) : defaultContactSettings.emails;
  const q = encodeURIComponent(addresses[0]);
  return {
    address: addresses[0],
    addresses,
    mapLink: mapsLink(addresses[0]),
    mapEmbed: `https://www.google.com/maps?q=${q}&output=embed`,
    phones: phones.map((display) => ({ display, tel: `+${phoneDigits(display)}` })),
    whatsapp: phoneDigits(s.whatsapp || phones[0]),
    email: emails[0],
    emails,
    socials: socialNetworks.filter((n) => s[n.key]).map((n) => ({ key: n.key, label: n.label, href: s[n.key] })),
  };
}

export const defaultContact = toContact(defaultContactSettings);

export const mainNav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/properties", label: "Properties" },
  { href: "/contact", label: "Contact" },
] as const;

export function whatsappLink(number: string, message?: string) {
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${number}${text}`;
}
