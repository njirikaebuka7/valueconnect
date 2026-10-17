"use client";

import { Heart } from "lucide-react";
import { useSaved } from "@/hooks/use-saved";
import { cn } from "@/lib/format";

export function FavoriteButton({ slug, className, size = "md" }: { slug: string; className?: string; size?: "md" | "lg" }) {
  const { isSaved, toggle } = useSaved();
  const saved = isSaved(slug);
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(slug);
      }}
      aria-pressed={saved}
      aria-label={saved ? "Remove from saved" : "Save property"}
      className={cn(
        "glass-chip grid place-items-center rounded-full text-navy-900 shadow-sm transition hover:scale-105 active:scale-95",
        size === "lg" ? "h-11 w-11" : "h-9 w-9",
        className,
      )}
    >
      <Heart
        className={cn(size === "lg" ? "h-5 w-5" : "h-4 w-4", "transition", saved && "fill-red-500 text-red-500")}
        strokeWidth={2.2}
      />
    </button>
  );
}
