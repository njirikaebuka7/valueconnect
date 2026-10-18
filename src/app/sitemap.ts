import type { MetadataRoute } from "next";
import { services } from "@/lib/content";
import { getPublishedProperties } from "@/lib/data/properties";
import { serviceImages } from "@/lib/images";
import { absoluteUrl } from "@/lib/seo";

export const revalidate = 3600;

type Entry = MetadataRoute.Sitemap[number];

// /track and /saved are left out: they're personal tools and marked noindex.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const properties = await getPublishedProperties();
  const newest = properties.reduce((max, p) => (p.updatedAt > max ? p.updatedAt : max), "");
  const listingsUpdated = newest ? new Date(newest) : undefined;

  const page = (path: string, priority: number, changeFrequency: Entry["changeFrequency"], lastModified?: Date): Entry => ({
    url: absoluteUrl(path || "/"),
    priority,
    changeFrequency,
    ...(lastModified && { lastModified }),
  });

  return [
    page("", 1, "weekly", listingsUpdated),
    page("/valuation", 0.9, "monthly"),
    page("/services", 0.8, "monthly"),
    ...services.map((s) => ({
      ...page(`/services/${s.slug}`, 0.8, "monthly"),
      images: [absoluteUrl(serviceImages[s.slug])],
    })),
    page("/properties", 0.8, "daily", listingsUpdated),
    ...properties.map((p) => ({
      ...page(`/properties/${p.slug}`, 0.6, "weekly", new Date(p.updatedAt)),
      images: p.images.slice(0, 5).map(absoluteUrl),
    })),
    page("/about", 0.6, "yearly"),
    page("/consultation", 0.6, "yearly"),
    page("/contact", 0.6, "yearly"),
    page("/privacy", 0.2, "yearly"),
    page("/terms", 0.2, "yearly"),
  ];
}
