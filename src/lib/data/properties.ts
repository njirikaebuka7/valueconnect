import "server-only";
import { seedProperties } from "../seed/properties";
import { isSupabaseConfigured } from "../supabase/config";
import { createPublicClient } from "../supabase/public";
import type { Property } from "../types";
import { mapProperty } from "./mappers";

/**
 * Public property reads. Without Supabase configured the site runs on the
 * sample listings so the frontend can be previewed on its own.
 */
export async function getPublishedProperties(): Promise<Property[]> {
  if (!isSupabaseConfigured) return seedProperties;
  const { data, error } = await createPublicClient()
    .from("properties")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });
  if (error) {
    console.error("getPublishedProperties", error.message);
    return [];
  }
  return data.map(mapProperty);
}

export async function getFeaturedProperties(limit = 6): Promise<Property[]> {
  const all = await getPublishedProperties();
  const featured = all.filter((p) => p.featured);
  return (featured.length >= 3 ? featured : all).slice(0, limit);
}

export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  if (!isSupabaseConfigured) return seedProperties.find((p) => p.slug === slug) ?? null;
  const { data, error } = await createPublicClient()
    .from("properties")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  if (error) {
    console.error("getPropertyBySlug", error.message);
    return null;
  }
  return data ? mapProperty(data) : null;
}

export function similarProperties(all: Property[], current: Property, limit = 3) {
  return all
    .filter((p) => p.id !== current.id)
    .map((p) => ({
      p,
      score:
        (p.city === current.city ? 2 : 0) +
        (p.listingType === current.listingType ? 2 : 0) +
        (p.propertyType === current.propertyType ? 1 : 0),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.p);
}
