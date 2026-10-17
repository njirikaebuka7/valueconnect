"use client";

import { ArrowRight, Building2, FileCheck2, KeyRound, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, type ReactNode, useState } from "react";
import { cn } from "@/lib/format";
import {
  featuredCities,
  nigerianStates,
  propertyTypeLabels,
  valuationAssetTypes,
  valuationPurposes,
} from "@/lib/options";

type Tab = "valuation" | "sale" | "rent";

const tabs: { id: Tab; label: string; icon: typeof Search }[] = [
  { id: "valuation", label: "Valuation", icon: FileCheck2 },
  { id: "sale", label: "Buy", icon: Building2 },
  { id: "rent", label: "Rent", icon: KeyRound },
];

const bedOptions = ["", "1", "2", "3", "4", "5"];

/** Glass search card in the home hero: valuation quote or property search. */
export function HeroSearch() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("valuation");

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const params = new URLSearchParams();
    data.forEach((value, key) => {
      if (typeof value === "string" && value) params.set(key, value);
    });
    if (tab === "valuation") {
      router.push(`/valuation${params.size ? `?${params}` : ""}`);
    } else {
      params.set("listing", tab);
      router.push(`/properties?${params}`);
    }
  }

  return (
    <div className="glass mx-auto w-full max-w-5xl rounded-[1.75rem] p-2.5 text-left shadow-[0_30px_80px_-30px_rgb(0_0_0/0.6)] sm:p-3">
      <div role="tablist" aria-label="Search type" className="flex gap-1 p-1">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={cn(
              "inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition sm:flex-none",
              tab === id ? "bg-white text-navy-900 shadow-sm" : "text-white/80 hover:bg-white/10 hover:text-white",
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      <form
        key={tab}
        onSubmit={onSubmit}
        className="animate-fade-in mt-1.5 grid gap-2 rounded-[1.35rem] bg-white p-2 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto]"
      >
        {tab === "valuation" ? (
          <>
            <SelectPill label="Purpose" name="purpose">
              <option value="">Any purpose</option>
              {valuationPurposes.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </SelectPill>
            <SelectPill label="Property" name="type">
              <option value="">Any property</option>
              {valuationAssetTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </SelectPill>
            <SelectPill label="State" name="state" className="sm:col-span-2 lg:col-span-1">
              <option value="">Anywhere in Nigeria</option>
              {nigerianStates.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </SelectPill>
          </>
        ) : (
          <>
            <SelectPill label="Location" name="city">
              <option value="">All locations</option>
              {featuredCities.map((c) => (
                <option key={c.city} value={c.city}>
                  {c.city}
                </option>
              ))}
            </SelectPill>
            <SelectPill label="Property type" name="type">
              <option value="">All types</option>
              {Object.entries(propertyTypeLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </SelectPill>
            <SelectPill label="Bedrooms" name="beds" className="sm:col-span-2 lg:col-span-1">
              {bedOptions.map((b) => (
                <option key={b} value={b}>
                  {b ? `${b}+ beds` : "Any"}
                </option>
              ))}
            </SelectPill>
          </>
        )}
        <button
          type="submit"
          className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-aqua-500 px-7 text-[0.95rem] font-bold text-navy-950 shadow-[0_10px_30px_-10px_rgb(3_203_250/0.9)] transition hover:bg-aqua-400 active:scale-[0.98] sm:col-span-2 lg:col-span-1 lg:h-auto"
        >
          {tab === "valuation" ? (
            <>
              Get a fee quote <ArrowRight className="h-4 w-4" />
            </>
          ) : (
            <>
              <Search className="h-4 w-4" /> Search
            </>
          )}
        </button>
      </form>
    </div>
  );
}

function SelectPill({
  label,
  name,
  children,
  className,
}: {
  label: string;
  name: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label
      className={cn(
        "group relative block rounded-2xl bg-surface px-4 pt-2.5 pb-2 ring-1 ring-transparent transition focus-within:bg-white focus-within:ring-aqua-500/60 hover:bg-navy-50/70",
        className,
      )}
    >
      <span className="block text-[0.65rem] font-bold tracking-[0.12em] text-muted uppercase">{label}</span>
      <select
        name={name}
        className="mt-0.5 w-full cursor-pointer appearance-none truncate bg-transparent pr-6 text-[0.95rem] font-semibold text-ink focus:outline-none"
      >
        {children}
      </select>
      <svg
        aria-hidden
        viewBox="0 0 20 20"
        className="pointer-events-none absolute right-3.5 bottom-3 h-4 w-4 text-navy-400"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="m5 7.5 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </label>
  );
}
