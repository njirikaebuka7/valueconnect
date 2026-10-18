import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { Accent } from "@/components/ui/section-heading";
import { TrackForm } from "@/components/valuation/track-form";
import { photos } from "@/lib/images";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Track your valuation",
  description:
    "Follow the progress of your Valueconnect valuation request with your reference number and email.",
  path: "/track",
  noindex: true,
});

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function TrackPage({ searchParams }: Props) {
  const sp = await searchParams;
  const ref = typeof sp.ref === "string" ? sp.ref.slice(0, 40) : "";

  return (
    <>
      <PageHero
        eyebrow="Request tracker"
        image={photos.heroTrack}
        title={
          <>
            Track your <Accent tone="dark">valuation</Accent>
          </>
        }
        description="Enter the reference from your confirmation and the email you used. You'll see your quote, inspection date and every update from our valuers."
      />
      <section className="relative z-10 -mt-10 pb-24 sm:-mt-14 lg:pb-32">
        <div className="container-x">
          <TrackForm initialReference={ref} />
        </div>
      </section>
    </>
  );
}
