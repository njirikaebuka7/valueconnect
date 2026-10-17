"use client";

import { Check, ExternalLink, Loader2, Plus, Save, X } from "lucide-react";
import Link from "next/link";
import { useActionState, useState, useTransition, type ReactNode } from "react";
import { saveProperty } from "@/app/actions/admin";
import { ImageUploader } from "@/components/admin/image-uploader";
import { buttonClass } from "@/components/ui/button";
import { Field, FormAlert, Input, Select, Textarea } from "@/components/ui/field";
import { cn, slugify } from "@/lib/format";
import {
  listingTypeLabels,
  nigerianStates,
  propertyFeatures,
  propertyStatusLabels,
  propertyTypeLabels,
  titleDocuments,
} from "@/lib/options";
import type { ListingType, Property } from "@/lib/types";

function Section({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-line sm:p-6">
      <h2 className="text-[0.95rem] font-bold">{title}</h2>
      {description && <p className="mt-0.5 text-xs text-muted">{description}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Switch({ name, label, hint, defaultChecked }: { name: string; label: string; hint: string; defaultChecked: boolean }) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 rounded-xl p-3 transition hover:bg-surface">
      <span>
        <span className="block text-sm font-semibold text-ink">{label}</span>
        <span className="block text-xs text-muted">{hint}</span>
      </span>
      <span className="relative mt-0.5 inline-flex shrink-0">
        <input type="checkbox" name={name} defaultChecked={defaultChecked} className="peer sr-only" />
        <span className="h-6 w-11 rounded-full bg-slate-300 transition peer-checked:bg-aqua-500 peer-focus-visible:ring-4 peer-focus-visible:ring-aqua-500/25" />
        <span className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
      </span>
    </label>
  );
}

const num = (v: number | null | undefined) => (v == null ? "" : String(v));

export function PropertyForm({ property }: { property?: Property }) {
  const [state, action, pending] = useActionState(saveProperty, null);
  const [, startTransition] = useTransition();
  const errors = state && !state.ok ? state.fieldErrors : undefined;

  const [title, setTitle] = useState(property?.title ?? "");
  const [slug, setSlug] = useState(property?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(property));
  const [listingType, setListingType] = useState<ListingType>(property?.listingType ?? "sale");
  const [onRequest, setOnRequest] = useState(property?.priceOnRequest ?? false);
  const [price, setPrice] = useState(property?.price ? property.price.toLocaleString("en-NG") : "");
  const [features, setFeatures] = useState<string[]>(property?.features ?? []);
  const [customFeature, setCustomFeature] = useState("");
  const [images, setImages] = useState<string[]>(property?.images ?? []);

  const allFeatures = Array.from(new Set([...propertyFeatures, ...features]));
  const toggleFeature = (f: string) =>
    setFeatures((cur) => (cur.includes(f) ? cur.filter((x) => x !== f) : [...cur, f]));

  return (
    <form
      // Submitting manually (instead of action=) stops React from resetting
      // the fields when validation fails.
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        startTransition(() => action(fd));
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
      className="pb-24 lg:pb-20"
    >
      <input type="hidden" name="id" value={property?.id ?? ""} />
      <input type="hidden" name="features" value={JSON.stringify(features)} />
      <input type="hidden" name="images" value={JSON.stringify(images)} />

      {state && (
        <div className="mb-5">
          {state.ok ? (
            <FormAlert tone="success">
              <span className="flex flex-wrap items-center gap-2">
                <Check className="h-4 w-4" /> {state.message}
                {state.data?.slug && (
                  <Link href={`/properties/${state.data.slug}`} target="_blank" className="font-semibold underline">
                    View on site
                  </Link>
                )}
              </span>
            </FormAlert>
          ) : (
            <FormAlert>{state.error}</FormAlert>
          )}
        </div>
      )}

      <div className="grid items-start gap-6 xl:grid-cols-[1fr_22rem]">
        <div className="grid gap-6">
          <Section title="Basics">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Title" name="title" required error={errors?.title} className="sm:col-span-2">
                <Input
                  name="title"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (!slugTouched) setSlug(slugify(e.target.value));
                  }}
                  placeholder="e.g. 4-Bedroom Terrace Duplex with BQ"
                  invalid={Boolean(errors?.title)}
                />
              </Field>
              <Field
                label="Web address"
                name="slug"
                hint={`/properties/${slug || "…"}`}
                error={errors?.slug}
                className="sm:col-span-2"
              >
                <Input
                  name="slug"
                  value={slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setSlug(slugify(e.target.value));
                  }}
                />
              </Field>
              <Field label="Listing type" name="listing_type" required>
                <Select
                  name="listing_type"
                  value={listingType}
                  onChange={(e) => setListingType(e.target.value as ListingType)}
                >
                  {Object.entries(listingTypeLabels).map(([v, l]) => (
                    <option key={v} value={v}>
                      {l}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Property type" name="property_type" required>
                <Select name="property_type" defaultValue={property?.propertyType ?? "detached"}>
                  {Object.entries(propertyTypeLabels).map(([v, l]) => (
                    <option key={v} value={v}>
                      {l}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Availability" name="status">
                <Select name="status" defaultValue={property?.status ?? "available"}>
                  {Object.entries(propertyStatusLabels).map(([v, l]) => (
                    <option key={v} value={v}>
                      {l}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>
          </Section>

          <Section title="Price">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Price (₦)" name="price" error={errors?.price} required={!onRequest}>
                <Input
                  name="price"
                  inputMode="numeric"
                  value={price}
                  disabled={onRequest}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/[^\d]/g, "");
                    setPrice(digits ? Number(digits).toLocaleString("en-NG") : "");
                  }}
                  placeholder="e.g. 285,000,000"
                  invalid={Boolean(errors?.price)}
                />
              </Field>
              {listingType !== "sale" && (
                <Field label="Per" name="price_period">
                  <Select name="price_period" defaultValue={property?.pricePeriod ?? (listingType === "shortlet" ? "night" : "year")}>
                    <option value="year">Year</option>
                    <option value="month">Month</option>
                    <option value="night">Night</option>
                  </Select>
                </Field>
              )}
              <label className="flex items-center gap-3 text-sm font-semibold text-ink sm:col-span-2">
                <input
                  type="checkbox"
                  name="price_on_request"
                  checked={onRequest}
                  onChange={(e) => setOnRequest(e.target.checked)}
                  className="h-4 w-4 rounded accent-navy-700"
                />
                Price on request (hide the price on the website)
              </label>
            </div>
          </Section>

          <Section title="Location">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="State" name="state" required error={errors?.state}>
                <Select name="state" defaultValue={property?.state ?? "Lagos"}>
                  {nigerianStates.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="City" name="city" required error={errors?.city}>
                <Input name="city" defaultValue={property?.city ?? "Lagos"} placeholder="e.g. Lagos" invalid={Boolean(errors?.city)} />
              </Field>
              <Field label="Area / neighbourhood" name="area" error={errors?.area}>
                <Input name="area" defaultValue={property?.area ?? ""} placeholder="e.g. Lekki Phase 1" />
              </Field>
              <Field label="Address" name="address" hint="Shown on the listing; keep it general if needed." error={errors?.address}>
                <Input name="address" defaultValue={property?.address ?? ""} placeholder="e.g. Admiralty Road axis" />
              </Field>
            </div>
          </Section>

          <Section title="Details">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {(
                [
                  ["bedrooms", "Bedrooms", property?.bedrooms],
                  ["bathrooms", "Bathrooms", property?.bathrooms],
                  ["toilets", "Toilets", property?.toilets],
                  ["parking", "Parking", property?.parking],
                  ["size_sqm", "Size (sqm)", property?.sizeSqm],
                ] as const
              ).map(([name, label, value]) => (
                <Field key={name} label={label} name={name} error={errors?.[name]}>
                  <Input name={name} inputMode="decimal" defaultValue={num(value)} invalid={Boolean(errors?.[name])} />
                </Field>
              ))}
            </div>
            <div className="mt-4 grid gap-4">
              <Field label="Title document" name="title_document">
                <Select name="title_document" defaultValue={property?.titleDocument ?? ""}>
                  <option value="">Not specified</option>
                  {titleDocuments.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Description" name="description" error={errors?.description}>
                <Textarea
                  name="description"
                  rows={7}
                  defaultValue={property?.description ?? ""}
                  placeholder="Describe the property, neighbourhood, finishes and anything a buyer or tenant should know."
                />
              </Field>
            </div>
          </Section>

          <Section title="Features" description="Tap to add or remove.">
            <div className="flex flex-wrap gap-2">
              {allFeatures.map((f) => {
                const on = features.includes(f);
                return (
                  <button
                    key={f}
                    type="button"
                    onClick={() => toggleFeature(f)}
                    aria-pressed={on}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 transition",
                      on ? "bg-navy-700 text-white ring-navy-700" : "bg-white text-body ring-line hover:bg-surface",
                    )}
                  >
                    {on && <Check className="h-3 w-3" />}
                    {f}
                  </button>
                );
              })}
            </div>
            <div className="mt-4 flex gap-2">
              <Input
                name="_custom_feature"
                value={customFeature}
                onChange={(e) => setCustomFeature(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const f = customFeature.trim();
                    if (f && !features.includes(f)) setFeatures((cur) => [...cur, f]);
                    setCustomFeature("");
                  }
                }}
                placeholder="Add another feature…"
                className="h-10"
                aria-label="Custom feature"
              />
              <button
                type="button"
                onClick={() => {
                  const f = customFeature.trim();
                  if (f && !features.includes(f)) setFeatures((cur) => [...cur, f]);
                  setCustomFeature("");
                }}
                className="inline-flex h-10 items-center gap-1 rounded-xl bg-surface px-3 text-sm font-semibold text-navy-700 ring-1 ring-line hover:bg-navy-50"
              >
                <Plus className="h-4 w-4" /> Add
              </button>
            </div>
          </Section>

          <Section title="Photos" description="The first photo is the cover. Large photos are resized automatically.">
            <ImageUploader images={images} onChange={setImages} />
            {errors?.images && <p className="mt-2 text-xs font-medium text-red-600">{errors.images}</p>}
          </Section>
        </div>

        <div className="grid gap-6 xl:sticky xl:top-6">
          <Section title="Visibility">
            <div className="-mx-3 -my-2 space-y-1">
              <Switch name="published" label="Published" hint="Visible on the website" defaultChecked={property?.published ?? true} />
              <Switch name="featured" label="Featured" hint="Highlighted on the home page" defaultChecked={property?.featured ?? false} />
              <Switch
                name="verified"
                label="Title reviewed"
                hint="Shows the “Title reviewed” badge"
                defaultChecked={property?.verified ?? true}
              />
            </div>
          </Section>
          {property && (
            <Link
              href={`/properties/${property.slug}`}
              target="_blank"
              className="flex items-center justify-center gap-2 rounded-2xl bg-white p-4 text-sm font-semibold text-navy-700 shadow-card ring-1 ring-line hover:bg-surface"
            >
              <ExternalLink className="h-4 w-4" /> View on website
            </Link>
          )}
        </div>
      </div>

      <div className="glass-light fixed inset-x-0 bottom-[calc(4.25rem+env(safe-area-inset-bottom))] z-20 border-t border-line px-4 py-3 lg:bottom-0 lg:left-[17rem]">
        <div className="mx-auto flex max-w-6xl items-center justify-end gap-2">
          <Link href="/admin/properties" className="inline-flex h-11 items-center gap-1.5 rounded-xl px-4 text-sm font-semibold text-body hover:bg-surface">
            <X className="h-4 w-4" /> Cancel
          </Link>
          <button type="submit" disabled={pending} className={buttonClass("primary", "md")}>
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {pending ? "Saving…" : property ? "Save changes" : "Create listing"}
          </button>
        </div>
      </div>
    </form>
  );
}
