"use client";

import { Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { cn } from "@/lib/format";

/** Debounce-free search: submits on Enter, keeps other query params. */
export function SearchBox({ placeholder, className }: { placeholder: string; className?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [value, setValue] = useState(params.get("q") ?? "");
  const [pending, startTransition] = useTransition();

  function go(q: string) {
    const sp = new URLSearchParams(params.toString());
    if (q) sp.set("q", q);
    else sp.delete("q");
    sp.delete("page");
    startTransition(() => router.push(sp.size ? `${pathname}?${sp}` : pathname));
  }

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        go(value.trim());
      }}
      className={cn("relative", className)}
    >
      <Search className={cn("pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2", pending ? "animate-pulse text-aqua-600" : "text-muted")} />
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="h-11 w-full rounded-xl border border-line bg-white pr-10 pl-10 text-sm text-ink placeholder:text-muted focus:border-aqua-500 focus:ring-4 focus:ring-aqua-500/15 focus:outline-none"
      />
      {value && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => {
            setValue("");
            go("");
          }}
          className="absolute top-1/2 right-2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-lg text-muted hover:bg-surface"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </form>
  );
}
