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
 * (the public.site_settings row). Empty strings mean "not set".
 */
export type ContactSettings = {
  address: string;
  phone_1: string;
  phone_2: string;
  whatsapp: string;
  email: string;
} & Record<SocialKey, string>;

export const defaultContactSettings: ContactSettings = {
  address: "17, Musa Yar'adua Street, Off Kofo Abayomi Street, Victoria Island, Lagos.",
  phone_1: "0814 483 3999",
  phone_2: "0811 090 0644",
  whatsapp: "0814 483 3999",
  email: "info@valueconnect.com.ng",
  facebook: "",
  instagram: "",
  x: "",
  linkedin: "",
  youtube: "",
  tiktok: "",
};

/** What the site renders: settings with links worked out. */
export interface SiteContact {
  address: string;
  mapLink: string;
  mapEmbed: string;
  phones: { display: string; tel: string }[];
  /** International digits for wa.me, e.g. 2348144833999. */
  whatsapp: string;
  email: string;
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

export function toContact(s: ContactSettings): SiteContact {
  const q = encodeURIComponent(s.address);
  return {
    address: s.address,
    mapLink: `https://maps.google.com/?q=${q}`,
    mapEmbed: `https://www.google.com/maps?q=${q}&output=embed`,
    phones: [s.phone_1, s.phone_2]
      .map((p) => p.trim())
      .filter(Boolean)
      .map((display) => ({ display, tel: `+${phoneDigits(display)}` })),
    whatsapp: phoneDigits(s.whatsapp || s.phone_1),
    email: s.email,
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
