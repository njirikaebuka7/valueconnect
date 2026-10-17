import type { MetadataRoute } from "next";
import { services } from "@/lib/content";
import { getPublishedProperties } from "@/lib/data/properties";
import { site } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const pages = ["", "/about", "/services", "/properties", "/valuation", "/consultation", "/contact", "/track"].map(
    (path) => ({
      url: `${site.url}${path}`,
      lastModified: now,
      changeFrequency: path === "/properties" ? ("daily" as const) : ("monthly" as const),
      priority: path === "" ? 1 : path === "/valuation" ? 0.9 : 0.7,
    }),
  );
  const servicePages = services.map((s) => ({
    url: `${site.url}/services/${s.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));
  const properties = (await getPublishedProperties()).map((p) => ({
    url: `${site.url}/properties/${p.slug}`,
    lastModified: new Date(p.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));
  return [...pages, ...servicePages, ...properties];
}
