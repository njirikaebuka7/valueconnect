"use client";

import {
  ArrowRight,
  LayoutGrid,
  List,
  RotateCcw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { ButtonLink, buttonClass } from "@/components/ui/button";
import { cn, formatNairaCompact } from "@/lib/format";
import { featuredCities, listingTypeLabels, propertyTypeLabels } from "@/lib/options";
import type { ListingType, Property, PropertyType } from "@/lib/types";
import { PropertyCard } from "./property-card";

type Sort = "newest" | "price-asc" | "price-desc";
type ListingFilter = "all" | ListingType;

interface Filters {
  listing: ListingFilter;
  type: PropertyType | "";
  city: string;
  beds: number;
  min: number;
  max: number;
  q: string;
  sort: Sort;
  verified: boolean;
}

const defaults: Filters = {
  listing: "all",
  type: "",
  city: "",
  beds: 0,
  min: 0,
  max: 0,
  q: "",
  sort: "newest",
  verified: false,
};

const listingTabs: { value: ListingFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "sale", label: "For sale" },
  { value: "rent", label: "For rent" },
  { value: "shortlet", label: "Shortlet" },
  { value: "lease", label: "For lease" },
];

const pricePresets = [
  1_000_000, 5_000_000, 10_000_000, 20_000_000, 50_000_000, 100_000_000, 250_000_000, 500_000_000, 1_000_000_000,
];

const sortLabels: Record<Sort, string> = {
  newest: "Newest first",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
};

function num(v: string | null) {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function readFilters(sp: URLSearchParams): Filters {
  const listing = sp.get("listing") as ListingFilter | null;
  const type = sp.get("type") as PropertyType | null;
  const sort = sp.get("sort") as Sort | null;
  return {
    listing: listing && listing in listingTypeLabels ? listing : "all",
    type: type && type in propertyTypeLabels ? type : "",
    city: sp.get("city") ?? "",
    beds: num(sp.get("beds")),
    min: num(sp.get("min")),
    max: num(sp.get("max")),
    q: sp.get("q") ?? "",
    sort: sort && sort in sortLabels ? sort : "newest",
    verified: sp.get("verified") === "1",
  };
}

function toQuery(f: Filters) {
  const sp = new URLSearchParams();
  if (f.listing !== "all") sp.set("listing", f.listing);
  if (f.type) sp.set("type", f.type);
  if (f.city) sp.set("city", f.city);
  if (f.beds) sp.set("beds", String(f.beds));
  if (f.min) sp.set("min", String(f.min));
  if (f.max) sp.set("max", String(f.max));
  if (f.q.trim()) sp.set("q", f.q.trim());
  if (f.sort !== "newest") sp.set("sort", f.sort);
  if (f.verified) sp.set("verified", "1");
  return sp.toString();
}

function matchesPlace(p: Property, place: string) {
  const needle = place.trim().toLowerCase();
  if (!needle) return true;
  return [p.city, p.state, p.area].some((v) => v.toLowerCase() === needle || v.toLowerCase().includes(needle));
}

function applyFilters(all: Property[], f: Filters) {
  const q = f.q.trim().toLowerCase();
  const list = all.filter((p) => {
    if (f.listing !== "all" && p.listingType !== f.listing) return false;
    if (f.type && p.propertyType !== f.type) return false;
    if (f.city && !matchesPlace(p, f.city)) return false;
    if (f.beds && (p.bedrooms ?? 0) < f.beds) return false;
    if (f.min && (p.priceOnRequest || p.price < f.min)) return false;
    if (f.max && (p.priceOnRequest || p.price > f.max)) return false;
    if (f.verified && !(p.verified && p.titleDocument)) return false;
    if (q) {
      const hay = [p.title, p.area, p.city, p.state, p.address, propertyTypeLabels[p.propertyType]]
        .join(" ")
        .toLowerCase();
      if (!q.split(/\s+/).every((word) => hay.includes(word))) return false;
    }
    return true;
  });
  const price = (p: Property) => (p.priceOnRequest ? Number.POSITIVE_INFINITY : p.price);
  if (f.sort === "price-asc") list.sort((a, b) => price(a) - price(b));
  else if (f.sort === "price-desc")
    list.sort((a, b) => (b.priceOnRequest ? -1 : a.priceOnRequest ? 1 : b.price - a.price));
  else list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return list;
}

const noopSubscribe = () => () => {};

export function PropertyExplorer({ properties }: { properties: Property[] }) {
  // The page is static, so the server renders the unfiltered list (cards and
  // photos are in the first HTML). Filters from the link are applied as soon as
  // the browser takes over: null on the server and during hydration.
  const urlSearch = useSyncExternalStore(noopSubscribe, () => window.location.search, () => null);
  const [filters, setFilters] = useState<Filters>(() => readFilters(new URLSearchParams()));
  const [synced, setSynced] = useState(false);
  if (!synced && urlSearch !== null) {
    setSynced(true);
    if (urlSearch) setFilters(readFilters(new URLSearchParams(urlSearch)));
  }
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sheetOpen, setSheetOpen] = useState(false);

  // Keep the URL shareable without a server round trip.
  useEffect(() => {
    if (!synced) return;
    const qs = toQuery(filters);
    const url = qs ? `/properties?${qs}` : "/properties";
    if (url !== `${window.location.pathname}${window.location.search}`) {
      window.history.replaceState(null, "", url);
    }
  }, [filters, synced]);

  useEffect(() => {
    document.body.style.overflow = sheetOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sheetOpen]);

  const results = useMemo(() => applyFilters(properties, filters), [properties, filters]);

  const cities = useMemo(() => {
    const set = new Set<string>(featuredCities.map((c) => c.city));
    properties.forEach((p) => p.city && set.add(p.city));
    return Array.from(set).sort();
  }, [properties]);

  const types = useMemo(() => {
    const present = new Set(properties.map((p) => p.propertyType));
    return (Object.keys(propertyTypeLabels) as PropertyType[]).filter((t) => present.has(t));
  }, [properties]);

  const update = (patch: Partial<Filters>) => setFilters((f) => ({ ...f, ...patch }));
  const reset = () => setFilters((f) => ({ ...defaults, sort: f.sort }));

  const chips: { key: string; label: string; clear: Partial<Filters> }[] = [];
  if (filters.type) chips.push({ key: "type", label: propertyTypeLabels[filters.type], clear: { type: "" } });
  if (filters.city) chips.push({ key: "city", label: filters.city, clear: { city: "" } });
  if (filters.beds) chips.push({ key: "beds", label: `${filters.beds}+ beds`, clear: { beds: 0 } });
  if (filters.min) chips.push({ key: "min", label: `From ${formatNairaCompact(filters.min)}`, clear: { min: 0 } });
  if (filters.max) chips.push({ key: "max", label: `Up to ${formatNairaCompact(filters.max)}`, clear: { max: 0 } });
  if (filters.verified) chips.push({ key: "verified", label: "Title reviewed", clear: { verified: false } });
  if (filters.q.trim()) chips.push({ key: "q", label: `“${filters.q.trim()}”`, clear: { q: "" } });

  const advancedCount = chips.filter((c) => c.key !== "q").length;

  return (
    <>
      {/* Sticky toolbar */}
      <div className="sticky top-16 z-30 mt-6 border-y border-line/70 bg-surface/85 py-3 backdrop-blur-xl lg:top-20 lg:mt-8">
        <div className="container-x space-y-3">
          <div className="flex gap-2">
            <label className="relative flex-1">
              <span className="sr-only">Search by area, city or keyword</span>
              <Search className="pointer-events-none absolute top-1/2 left-4 h-[1.1rem] w-[1.1rem] -translate-y-1/2 text-muted" />
              <input
                type="search"
                value={filters.q}
                onChange={(e) => update({ q: e.target.value })}
                placeholder="Search Ikoyi, Maitama, duplex…"
                className="h-12 w-full rounded-2xl border border-line bg-white pr-4 pl-11 text-[0.95rem] text-ink shadow-card placeholder:text-muted/80 focus:border-aqua-500 focus:ring-4 focus:ring-aqua-500/15 focus:outline-none"
              />
            </label>
            <button
              type="button"
              onClick={() => setSheetOpen(true)}
              className={cn(
                "relative inline-flex h-12 items-center gap-2 rounded-2xl bg-navy-700 px-4 text-sm font-semibold text-white shadow-card transition active:scale-95 lg:hidden",
              )}
            >
              <SlidersHorizontal className="h-[1.1rem] w-[1.1rem]" />
              <span className="max-[380px]:sr-only">Filters</span>
              {advancedCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-aqua-500 px-1 text-[0.68rem] font-bold text-navy-950 ring-2 ring-surface">
                  {advancedCount}
                </span>
              )}
            </button>
          </div>

          <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            {listingTabs.map((tab) => {
              const active = filters.listing === tab.value;
              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => update({ listing: tab.value })}
                  aria-pressed={active}
                  className={cn(
                    "h-10 shrink-0 rounded-full px-4 text-sm font-semibold transition",
                    active
                      ? "bg-navy-950 text-white shadow-[0_8px_20px_-10px_rgb(4_18_58/0.8)]"
                      : "bg-white text-body ring-1 ring-line hover:text-navy-800 hover:ring-navy-200",
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Desktop inline filters */}
          <div className="hidden flex-wrap items-center gap-2 lg:flex">
            <FilterSelect
              label="Property type"
              value={filters.type}
              onChange={(v) => update({ type: v as PropertyType | "" })}
              options={[{ value: "", label: "Any type" }, ...types.map((t) => ({ value: t, label: propertyTypeLabels[t] }))]}
            />
            <FilterSelect
              label="City"
              value={filters.city}
              onChange={(v) => update({ city: v })}
              options={[
                { value: "", label: "Any city" },
                ...cities.map((c) => ({ value: c, label: c })),
                ...(filters.city && !cities.includes(filters.city) ? [{ value: filters.city, label: filters.city }] : []),
              ]}
            />
            <FilterSelect
              label="Bedrooms"
              value={String(filters.beds)}
              onChange={(v) => update({ beds: Number(v) })}
              options={[{ value: "0", label: "Any beds" }, ...[1, 2, 3, 4, 5].map((n) => ({ value: String(n), label: `${n}+ beds` }))]}
            />
            <FilterSelect
              label="Minimum price"
              value={String(filters.min)}
              onChange={(v) => update({ min: Number(v) })}
              options={[{ value: "0", label: "No min" }, ...pricePresets.map((p) => ({ value: String(p), label: `Min ${formatNairaCompact(p)}` }))]}
            />
            <FilterSelect
              label="Maximum price"
              value={String(filters.max)}
              onChange={(v) => update({ max: Number(v) })}
              options={[{ value: "0", label: "No max" }, ...pricePresets.map((p) => ({ value: String(p), label: `Max ${formatNairaCompact(p)}` }))]}
            />
            <VerifiedToggle checked={filters.verified} onChange={(v) => update({ verified: v })} />
          </div>
        </div>
      </div>

      <div className="container-x mt-6">
        {/* Results header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-semibold text-body" aria-live="polite">
            <span className="text-lg font-extrabold text-ink">{results.length}</span>{" "}
            {results.length === 1 ? "property" : "properties"}
          </p>
          <div className="flex items-center gap-2">
            <FilterSelect
              label="Sort"
              value={filters.sort}
              onChange={(v) => update({ sort: v as Sort })}
              options={(Object.keys(sortLabels) as Sort[]).map((s) => ({ value: s, label: sortLabels[s] }))}
              compact
            />
            <div className="flex rounded-xl bg-white p-1 ring-1 ring-line" role="group" aria-label="Layout">
              {(
                [
                  ["grid", LayoutGrid, "Grid view"],
                  ["list", List, "List view"],
                ] as const
              ).map(([v, Icon, label]) => (
                <button
                  key={v}
                  type="button"
                  aria-label={label}
                  aria-pressed={view === v}
                  onClick={() => setView(v)}
                  className={cn(
                    "grid h-8 w-9 place-items-center rounded-lg transition",
                    view === v ? "bg-navy-700 text-white" : "text-muted hover:text-navy-700",
                  )}
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {chips.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {chips.map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={() => update(c.clear)}
                className="inline-flex h-8 items-center gap-1.5 rounded-full bg-navy-50 pr-2 pl-3 text-xs font-semibold text-navy-800 ring-1 ring-navy-100 transition hover:bg-navy-100"
              >
                {c.label}
                <X className="h-3.5 w-3.5" aria-label="Remove filter" />
              </button>
            ))}
            <button type="button" onClick={reset} className="text-xs font-semibold text-aqua-700 hover:underline">
              Clear all
            </button>
          </div>
        )}

        {/* Keeps the heading outline in order: cards use h3. */}
        <h2 className="sr-only">Listings</h2>
        {results.length > 0 ? (
          <div
            className={cn(
              "mt-6 grid gap-5",
              view === "grid" ? "sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 lg:grid-cols-2",
            )}
          >
            {results.map((p, i) => (
              <PropertyCard key={p.id} property={p} layout={view === "list" ? "row" : "grid"} priority={i < 3} />
            ))}
          </div>
        ) : (
          <EmptyState onReset={reset} />
        )}
      </div>

      {sheetOpen && (
        <FilterSheet
          filters={filters}
          update={update}
          reset={reset}
          types={types}
          cities={cities}
          count={results.length}
          onClose={() => setSheetOpen(false)}
        />
      )}
    </>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
  compact,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  compact?: boolean;
}) {
  const active = value !== "" && value !== "0" && !compact;
  return (
    <label className="relative">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "h-10 cursor-pointer appearance-none rounded-xl border bg-white pr-9 pl-3.5 text-sm font-semibold transition focus:ring-4 focus:ring-aqua-500/15 focus:outline-none",
          active ? "border-navy-300 text-navy-800" : "border-line text-body hover:border-navy-200",
        )}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <svg
        aria-hidden
        viewBox="0 0 20 20"
        className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-muted"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="m5 7.5 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </label>
  );
}

function VerifiedToggle({ checked, onChange, block }: { checked: boolean; onChange: (v: boolean) => void; block?: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "inline-flex items-center gap-2.5 rounded-xl border px-3.5 text-sm font-semibold transition",
        block ? "h-14 w-full justify-between bg-white" : "h-10",
        checked ? "border-aqua-300 bg-aqua-50 text-navy-900" : "border-line bg-white text-body hover:border-navy-200",
      )}
    >
      <span className="flex items-center gap-2">
        <ShieldCheck className={cn("h-4 w-4", checked ? "text-aqua-600" : "text-muted")} />
        Title reviewed only
      </span>
      <span
        aria-hidden
        className={cn(
          "relative h-5 w-9 rounded-full transition",
          checked ? "bg-aqua-500" : "bg-line",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition",
            checked && "translate-x-4",
          )}
        />
      </span>
    </button>
  );
}

function ChipGroup<T extends string | number>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <fieldset>
      <legend className="text-sm font-bold text-ink">{label}</legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((o) => {
          const active = o.value === value;
          return (
            <button
              key={String(o.value)}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(o.value)}
              className={cn(
                "h-10 rounded-full px-4 text-sm font-semibold transition",
                active ? "bg-navy-700 text-white" : "bg-surface text-body ring-1 ring-line",
              )}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function FilterSheet({
  filters,
  update,
  reset,
  types,
  cities,
  count,
  onClose,
}: {
  filters: Filters;
  update: (patch: Partial<Filters>) => void;
  reset: () => void;
  types: PropertyType[];
  cities: string[];
  count: number;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div role="dialog" aria-modal="true" aria-label="Filters" className="fixed inset-0 z-[70] lg:hidden">
      <button
        type="button"
        aria-label="Close filters"
        onClick={onClose}
        className="animate-fade-in absolute inset-0 bg-navy-950/55 backdrop-blur-sm"
      />
      <div className="animate-sheet-up absolute inset-x-0 bottom-0 flex max-h-[90dvh] flex-col rounded-t-[2rem] bg-white shadow-lift">
        <div className="shrink-0 px-5 pt-3">
          <div className="mx-auto h-1.5 w-12 rounded-full bg-line" />
          <div className="mt-3 flex items-center justify-between">
            <h2 className="text-lg font-extrabold">Filters</h2>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={reset}
                className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-aqua-700"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Reset
              </button>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="grid h-9 w-9 place-items-center rounded-full bg-surface text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-7 overflow-y-auto px-5 pt-5 pb-6">
          <ChipGroup
            label="Listing"
            value={filters.listing}
            options={listingTabs}
            onChange={(v) => update({ listing: v })}
          />
          <ChipGroup
            label="Property type"
            value={filters.type}
            options={[{ value: "" as PropertyType | "", label: "Any" }, ...types.map((t) => ({ value: t, label: propertyTypeLabels[t] }))]}
            onChange={(v) => update({ type: v })}
          />
          <ChipGroup
            label="City"
            value={filters.city}
            options={[{ value: "", label: "Anywhere" }, ...cities.map((c) => ({ value: c, label: c }))]}
            onChange={(v) => update({ city: v })}
          />
          <ChipGroup
            label="Bedrooms"
            value={filters.beds}
            options={[{ value: 0, label: "Any" }, ...[1, 2, 3, 4, 5].map((n) => ({ value: n, label: `${n}+` }))]}
            onChange={(v) => update({ beds: v })}
          />
          <fieldset>
            <legend className="text-sm font-bold text-ink">Price range</legend>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <SheetSelect
                label="Minimum"
                value={String(filters.min)}
                onChange={(v) => update({ min: Number(v) })}
                options={[{ value: "0", label: "No min" }, ...pricePresets.map((p) => ({ value: String(p), label: formatNairaCompact(p) }))]}
              />
              <SheetSelect
                label="Maximum"
                value={String(filters.max)}
                onChange={(v) => update({ max: Number(v) })}
                options={[{ value: "0", label: "No max" }, ...pricePresets.map((p) => ({ value: String(p), label: formatNairaCompact(p) }))]}
              />
            </div>
          </fieldset>
          <VerifiedToggle checked={filters.verified} onChange={(v) => update({ verified: v })} block />
        </div>

        <div className="shrink-0 border-t border-line px-5 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <button type="button" onClick={onClose} className={buttonClass("primary", "lg", "w-full")}>
            Show {count} {count === 1 ? "property" : "properties"}
          </button>
        </div>
      </div>
    </div>
  );
}

function SheetSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-muted">{label}</span>
      <span className="relative block">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-12 w-full appearance-none rounded-xl border border-line bg-white pr-9 pl-3.5 text-sm font-semibold text-ink focus:border-aqua-500 focus:ring-4 focus:ring-aqua-500/15 focus:outline-none"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <svg
          aria-hidden
          viewBox="0 0 20 20"
          className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-muted"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="m5 7.5 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </label>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="mt-8 rounded-[2rem] bg-white px-6 py-14 text-center shadow-card ring-1 ring-line/80">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-navy-50 text-navy-700">
        <Search className="h-7 w-7" />
      </div>
      <h2 className="mt-5 text-xl font-extrabold">No properties match those filters</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-body">
        Try widening your search, or tell us what you&apos;re looking for. Many of our instructions are handled off-market.
      </p>
      <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
        <button type="button" onClick={onReset} className={buttonClass("outline", "md")}>
          <RotateCcw className="h-4 w-4" /> Clear filters
        </button>
        <ButtonLink href="/contact" variant="primary">
          Tell us what you need <ArrowRight className="h-4 w-4" />
        </ButtonLink>
        <ButtonLink href="/valuation" variant="accent">
          Request a valuation
        </ButtonLink>
      </div>
    </div>
  );
}
