"use client";

import { ChevronLeft, ChevronRight, Grid2x2, Share2, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Photo } from "@/components/ui/photo";
import { cn } from "@/lib/format";
import { FavoriteButton } from "./favorite-button";

export function PropertyGallery({ images, title, slug }: { images: string[]; title: string; slug: string }) {
  const photos = images.length ? images : [""];
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const onScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setIndex(Math.round(el.scrollLeft / el.clientWidth));
  }, []);

  return (
    <>
      {/* Mobile: full-bleed swipe carousel */}
      <div className="relative -mx-4 sm:-mx-6 lg:hidden">
        <div
          ref={trackRef}
          onScroll={onScroll}
          className="no-scrollbar flex aspect-[4/3] snap-x snap-mandatory overflow-x-auto bg-navy-950"
        >
          {photos.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setLightbox(i)}
              className="relative h-full w-full shrink-0 snap-center"
              aria-label={`Open photo ${i + 1} of ${photos.length}`}
            >
              <Photo src={src} alt={`${title}, photo ${i + 1}`} fill preload={i === 0} sizes="(min-width: 1024px) 1px, 100vw" className="object-cover" />
            </button>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-navy-950/50 to-transparent" />
        <div className="absolute inset-x-4 top-3 flex items-center justify-between">
          <Link
            href="/properties"
            aria-label="Back to properties"
            className="glass-chip grid h-10 w-10 place-items-center rounded-full text-navy-900 shadow-sm"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div className="flex gap-2">
            <ShareButton title={title} />
            <FavoriteButton slug={slug} size="lg" className="h-10 w-10" />
          </div>
        </div>
        {photos.length > 1 && (
          <>
            <span className="absolute right-4 bottom-4 rounded-full bg-navy-950/70 px-3 py-1 text-xs font-bold text-white backdrop-blur">
              {index + 1} / {photos.length}
            </span>
            <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-1.5">
              {photos.map((_, i) => (
                <span
                  key={i}
                  className={cn("h-1.5 rounded-full bg-white/60 transition-all", i === index ? "w-5 bg-white" : "w-1.5")}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Desktop: mosaic */}
      <div className="relative hidden lg:block">
        <div
          className={cn(
            "grid h-[30rem] gap-3 overflow-hidden rounded-[2rem]",
            photos.length >= 3 ? "grid-cols-4 grid-rows-2" : photos.length === 2 ? "grid-cols-2" : "grid-cols-1",
          )}
        >
          {photos.slice(0, 5).map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setLightbox(i)}
              className={cn(
                "group relative overflow-hidden bg-navy-950",
                photos.length >= 3 && i === 0 && "col-span-2 row-span-2",
                photos.length === 3 && i > 0 && "col-span-2",
                photos.length === 4 && i === 3 && "col-span-2",
              )}
              aria-label={`Open photo ${i + 1} of ${photos.length}`}
            >
              <Photo
                src={src}
                alt={`${title}, photo ${i + 1}`}
                fill
                preload={i === 0}
                sizes={i === 0 ? "(max-width: 1023px) 1px, 50vw" : "(max-width: 1023px) 1px, 25vw"}
                className="object-cover transition duration-700 group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-navy-950/0 transition group-hover:bg-navy-950/10" />
            </button>
          ))}
        </div>
        <div className="absolute top-4 right-4 flex gap-2">
          <ShareButton title={title} />
          <FavoriteButton slug={slug} size="lg" />
        </div>
        {photos.length > 1 && (
          <button
            type="button"
            onClick={() => setLightbox(0)}
            className="glass-chip absolute right-4 bottom-4 inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold text-navy-900 shadow-sm transition hover:bg-white"
          >
            <Grid2x2 className="h-4 w-4" /> View all {photos.length} photos
          </button>
        )}
      </div>

      {lightbox !== null && (
        <Lightbox photos={photos} title={title} start={lightbox} onClose={() => setLightbox(null)} />
      )}
    </>
  );
}

function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      aria-label="Share property"
      onClick={async () => {
        const url = window.location.href;
        try {
          if (navigator.share) {
            await navigator.share({ title, url });
            return;
          }
          await navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        } catch {
          // Share sheet dismissed.
        }
      }}
      className="glass-chip relative grid h-10 w-10 place-items-center rounded-full text-navy-900 shadow-sm transition hover:scale-105 lg:h-11 lg:w-11"
    >
      <Share2 className="h-4 w-4 lg:h-5 lg:w-5" />
      {copied && (
        <span className="absolute top-full right-0 mt-2 rounded-lg bg-navy-950 px-2.5 py-1 text-[0.7rem] font-semibold whitespace-nowrap text-white">
          Link copied
        </span>
      )}
    </button>
  );
}

function Lightbox({ photos, title, start, onClose }: { photos: string[]; title: string; start: number; onClose: () => void }) {
  const [i, setI] = useState(start);
  const prev = useCallback(() => setI((n) => (n - 1 + photos.length) % photos.length), [photos.length]);
  const next = useCallback(() => setI((n) => (n + 1) % photos.length), [photos.length]);
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, prev, next]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${title} photos`}
      className="animate-fade-in fixed inset-0 z-[80] flex flex-col bg-navy-950/95 backdrop-blur-xl"
    >
      <div className="flex items-center justify-between px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-3 text-white sm:px-6">
        <p className="text-sm font-semibold">
          {i + 1} / {photos.length}
          <span className="ml-3 hidden text-white/60 sm:inline">{title}</span>
        </p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close photos"
          className="glass grid h-10 w-10 place-items-center rounded-full text-white"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <div
        className="relative flex-1"
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current == null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 40) (dx > 0 ? prev : next)();
          touchX.current = null;
        }}
      >
        <Photo
          key={i}
          src={photos[i]}
          alt={`${title}, photo ${i + 1}`}
          fill
          sizes="100vw"
          className="animate-fade-in object-contain"
        />
        {photos.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous photo"
              className="glass absolute top-1/2 left-3 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full text-white sm:left-6"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next photo"
              className="glass absolute top-1/2 right-3 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full text-white sm:right-6"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>
      <div className="no-scrollbar flex justify-center gap-2 overflow-x-auto px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
        {photos.map((src, n) => (
          <button
            key={n}
            type="button"
            onClick={() => setI(n)}
            aria-label={`Show photo ${n + 1}`}
            className={cn(
              "relative h-14 w-20 shrink-0 overflow-hidden rounded-xl ring-2 transition",
              n === i ? "ring-aqua-400" : "opacity-60 ring-transparent hover:opacity-100",
            )}
          >
            <Photo src={src} alt="" fill sizes="80px" className="object-cover" />
          </button>
        ))}
      </div>
      <span className="sr-only">Use the arrow keys to move between photos.</span>
    </div>
  );
}
