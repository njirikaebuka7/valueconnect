import "server-only";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import { defaultContactSettings, socialNetworks, toContact, type ContactSettings, type SocialKey } from "./site";
import { isSupabaseConfigured } from "./supabase/config";
import { createPublicClient } from "./supabase/public";

/** Cache tag for the settings row; saving in the admin expires it. */
export const SETTINGS_TAG = "site-settings";

// Cached across requests, so pages rendered on demand (valuation, track…)
// don't query the database on every visit.
const readSettings = unstable_cache(
  async (): Promise<ContactSettings> => {
    const { data, error } = await createPublicClient().from("site_settings").select("*").eq("id", 1).maybeSingle();
    if (error || !data) {
      if (error) console.error("getContactSettings", error.message);
      return defaultContactSettings;
    }
    const list = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : []);
    const text = (v: unknown) => (typeof v === "string" ? v : "");
    return {
      addresses: list(data.addresses),
      phones: list(data.phones),
      emails: list(data.emails),
      whatsapp: text(data.whatsapp),
      ...(Object.fromEntries(socialNetworks.map((n) => [n.key, text(data[n.key])])) as Record<SocialKey, string>),
    };
  },
  // v2: addresses, phones and emails became lists.
  ["site-settings", "v2"],
  { tags: [SETTINGS_TAG], revalidate: 3600 },
);

/**
 * The editable contact details (Admin → Settings). Falls back to the defaults
 * in site.ts in preview mode or if the row can't be read, so the site never
 * renders without a phone number.
 */
export const getContactSettings = cache(async (): Promise<ContactSettings> =>
  isSupabaseConfigured ? readSettings() : defaultContactSettings,
);

export const getContact = cache(async () => toContact(await getContactSettings()));
