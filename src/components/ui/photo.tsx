"use client";

import Image, { type ImageLoaderProps, type ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/lib/format";

// Unsplash and Pexels resize on their own CDNs, so those images skip Vercel's optimiser.
function unsplashLoader({ src, width, quality }: ImageLoaderProps) {
  return `${src}?auto=format&fit=crop&w=${width}&q=${quality ?? 75}`;
}
function pexelsLoader({ src, width }: ImageLoaderProps) {
  return `${src}?auto=compress&cs=tinysrgb&w=${width}`;
}

type PhotoProps = Omit<ImageProps, "src" | "alt"> & {
  src?: string | null;
  alt: string;
  /** Hide the house glyph on the fallback, e.g. behind hero text. */
  plainFallback?: boolean;
};

export function Photo({ src, alt, className, plainFallback, ...props }: PhotoProps) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return <PhotoFallback className={className} fill={Boolean(props.fill)} plain={plainFallback} />;

  const unsplash = src.startsWith("https://images.unsplash.com/");
  const pexels = src.startsWith("https://images.pexels.com/");
  const cdn = unsplash || pexels;
  const optimisable = cdn || src.startsWith("/") || /\.supabase\.co\/storage\/v1\/object\/public\//.test(src);

  return (
    <Image
      src={src}
      alt={alt}
      loader={unsplash ? unsplashLoader : pexels ? pexelsLoader : undefined}
      unoptimized={!optimisable || src.startsWith("data:") || src.startsWith("blob:")}
      onError={() => setFailed(true)}
      className={className}
      {...props}
    />
  );
}

export function PhotoFallback({ className, fill, plain }: { className?: string; fill?: boolean; plain?: boolean }) {
  return (
    <div
      aria-hidden
      className={cn(
        "flex items-center justify-center bg-gradient-to-br from-navy-800 via-navy-900 to-navy-950",
        fill && "absolute inset-0",
        className,
      )}
    >
      {!plain && (
        <svg viewBox="0 0 64 64" className="h-12 w-12 text-aqua-400/60" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M8 30 32 10l24 20" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14 26v26h36V26" strokeLinejoin="round" />
          <path d="M27 52V38h10v14" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  );
}
