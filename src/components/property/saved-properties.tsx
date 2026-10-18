"use client";

import { Compass, Heart } from "lucide-react";
import { useSyncExternalStore } from "react";
import { ButtonLink } from "@/components/ui/button";
import { useSaved } from "@/hooks/use-saved";
import type { Property } from "@/lib/types";
import { PropertyCard } from "./property-card";

const noopSubscribe = () => () => {};

export function SavedProperties({ properties }: { properties: Property[] }) {
  const { saved } = useSaved();
  // The saved list lives in localStorage, so wait for the client before deciding it's empty.
  const ready = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

  if (!ready) {
    return (
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-80 animate-pulse rounded-3xl bg-white shadow-card" />
        ))}
      </div>
    );
  }

  const bySlug = new Map(properties.map((p) => [p.slug, p]));
  const list = saved.map((s) => bySlug.get(s)).filter((p): p is Property => Boolean(p));

  if (list.length === 0) {
    return (
      <div className="mt-8 rounded-[2rem] bg-white px-6 py-16 text-center shadow-card ring-1 ring-line/80">
        <div className="relative mx-auto h-24 w-24">
          <span className="absolute inset-0 animate-ping rounded-full bg-aqua-200/40 [animation-duration:2.5s]" />
          <span className="relative grid h-24 w-24 place-items-center rounded-full bg-navy-800 shadow-lift">
            <Heart className="h-10 w-10 text-aqua-300" strokeWidth={2} />
          </span>
        </div>
        <h2 className="mt-6 text-xl font-extrabold">No saved homes yet</h2>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-body">
          Browse our listings and tap the heart on the ones you like. They&apos;ll wait for you here.
        </p>
        <ButtonLink href="/properties" variant="primary" size="lg" className="mt-6">
          <Compass className="h-4 w-4" /> Start exploring
        </ButtonLink>
      </div>
    );
  }

  return (
    <>
      <p className="mt-8 text-sm font-semibold text-body">
        <span className="text-lg font-extrabold text-ink">{list.length}</span> saved{" "}
        {list.length === 1 ? "property" : "properties"}
      </p>
      <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => (
          <PropertyCard key={p.id} property={p} />
        ))}
      </div>
    </>
  );
}
