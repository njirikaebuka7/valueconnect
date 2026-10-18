import type { Metadata } from "next";
import { SavedProperties } from "@/components/property/saved-properties";
import { getPublishedProperties } from "@/lib/data/properties";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 300;

export const metadata: Metadata = pageMetadata({
  title: "Saved homes",
  description:
    "Properties you've saved on this device.",
  path: "/saved",
  noindex: true,
});

export default async function SavedPage() {
  const properties = await getPublishedProperties();
  return (
    <div className="min-h-[70vh] bg-surface pt-20 pb-28 lg:pt-28 lg:pb-32">
      <div className="container-x">
        <div className="animate-fade-up pt-4 lg:pt-6">
          <p className="eyebrow">
            <span className="h-px w-6 bg-aqua-500" />
            Your shortlist
          </p>
          <h1 className="mt-3 text-[1.9rem] leading-tight font-extrabold sm:text-4xl">Saved homes</h1>
          <p className="mt-2 max-w-xl text-[0.98rem] text-body">
            Tap the heart on any listing to keep it here. Your shortlist is stored on this device only.
          </p>
        </div>
        <SavedProperties properties={properties.map((p) => ({ ...p, description: "", features: [], images: p.images.slice(0, 1) }))} />
      </div>
    </div>
  );
}
