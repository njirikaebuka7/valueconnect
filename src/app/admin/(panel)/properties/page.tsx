import { Building2, ExternalLink, MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { deleteProperty, togglePropertyFlag } from "@/app/actions/admin";
import { ConfirmForm, FlagToggle } from "@/components/admin/client-ui";
import { SearchBox } from "@/components/admin/search-box";
import { buildHref, Card, EmptyState, FilterTabs, PageHeader } from "@/components/admin/ui";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { FormAlert } from "@/components/ui/field";
import { Photo } from "@/components/ui/photo";
import { requireAdmin } from "@/lib/auth";
import { mapProperty } from "@/lib/data/mappers";
import { formatPrice, timeAgo } from "@/lib/format";
import { listingTypeLabels, propertyStatusLabels } from "@/lib/options";
import { createClient } from "@/lib/supabase/server";
import type { ListingType } from "@/lib/types";

export const metadata: Metadata = { title: "Properties" };

function one(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}

export default async function AdminPropertiesPage({ searchParams }: PageProps<"/admin/properties">) {
  await requireAdmin();
  const sp = await searchParams;
  const typeParam = one(sp.type);
  const type = typeParam && typeParam in listingTypeLabels ? (typeParam as ListingType) : undefined;
  const q = (one(sp.q) ?? "").replace(/[,()%*\\]/g, " ").trim().slice(0, 80);

  const supabase = await createClient();
  let query = supabase.from("properties").select("*").order("created_at", { ascending: false }).limit(500);
  if (type) query = query.eq("listing_type", type);
  if (q) {
    const like = `%${q}%`;
    query = query.or(`title.ilike.${like},area.ilike.${like},city.ilike.${like},address.ilike.${like}`);
  }
  const [{ data, error }, allTypes] = await Promise.all([query, supabase.from("properties").select("listing_type").limit(5000)]);
  const properties = (data ?? []).map(mapProperty);
  const counts = (allTypes.data ?? []).reduce<Record<string, number>>((acc, r) => {
    acc[r.listing_type as string] = (acc[r.listing_type as string] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <>
      <PageHeader
        title="Properties"
        description="Listings shown on the website. Unpublished listings stay hidden from visitors."
        actions={
          <>
            <Suspense>
              <SearchBox placeholder="Search title or area…" className="w-full sm:w-64" />
            </Suspense>
            <ButtonLink href="/admin/properties/new">
              <Plus className="h-4 w-4" /> Add property
            </ButtonLink>
          </>
        }
      />

      {one(sp.deleted) && (
        <div className="mb-4">
          <FormAlert tone="success">Listing deleted.</FormAlert>
        </div>
      )}

      <FilterTabs
        items={[
          { href: buildHref("/admin/properties", { q }), label: "All", count: allTypes.data?.length ?? 0, active: !type },
          ...(Object.keys(listingTypeLabels) as ListingType[]).map((t) => ({
            href: buildHref("/admin/properties", { type: t, q }),
            label: listingTypeLabels[t],
            count: counts[t] ?? 0,
            active: type === t,
          })),
        ]}
      />

      {error ? (
        <div className="mt-4">
          <FormAlert>Couldn&apos;t load properties: {error.message}</FormAlert>
        </div>
      ) : properties.length === 0 ? (
        <Card className="mt-4">
          <EmptyState
            icon={Building2}
            title={q || type ? "No matching listings" : "No listings yet"}
            body={q || type ? "Try a different filter or search." : "Add your first property to show it on the website."}
            action={
              <ButtonLink href="/admin/properties/new">
                <Plus className="h-4 w-4" /> Add property
              </ButtonLink>
            }
          />
        </Card>
      ) : (
        <ul className="mt-4 grid gap-3">
          {properties.map((p) => (
            <li key={p.id}>
              <Card className="flex flex-col gap-4 p-3 sm:flex-row sm:items-center sm:p-4">
                <Link href={`/admin/properties/${p.id}`} className="flex min-w-0 flex-1 items-center gap-4">
                  <div className="relative aspect-[4/3] w-28 shrink-0 overflow-hidden rounded-xl bg-navy-950 sm:w-36">
                    <Photo src={p.images[0]} alt={p.title} fill sizes="144px" className="object-cover" />
                    {!p.published && (
                      <span className="absolute inset-0 grid place-items-center bg-navy-950/60 text-[0.68rem] font-bold text-white">
                        Hidden
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Badge tone="navy">{listingTypeLabels[p.listingType]}</Badge>
                      {p.status !== "available" && <Badge tone="amber">{propertyStatusLabels[p.status]}</Badge>}
                      {p.featured && <Badge tone="aqua">Featured</Badge>}
                    </div>
                    <p className="mt-1.5 truncate font-semibold text-ink">{p.title}</p>
                    <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted">
                      <MapPin className="h-3 w-3 shrink-0" />
                      {p.area ? `${p.area}, ` : ""}
                      {p.city} · updated {timeAgo(p.updatedAt)}
                    </p>
                    <p className="mt-1 text-sm font-bold text-navy-700">{formatPrice(p)}</p>
                  </div>
                </Link>

                <div className="flex items-center justify-between gap-4 border-t border-line pt-3 sm:border-0 sm:pt-0">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-xs font-semibold text-body">
                      <FlagToggle
                        value={p.published}
                        onToggle={togglePropertyFlag.bind(null, p.id, "published")}
                        label="Published"
                        size="sm"
                      />
                      Live
                    </label>
                    <label className="flex items-center gap-2 text-xs font-semibold text-body">
                      <FlagToggle
                        value={p.featured}
                        onToggle={togglePropertyFlag.bind(null, p.id, "featured")}
                        label="Featured"
                        size="sm"
                      />
                      Featured
                    </label>
                  </div>
                  <div className="flex items-center gap-1">
                    <Link
                      href={`/properties/${p.slug}`}
                      target="_blank"
                      aria-label="View on site"
                      title="View on site"
                      className="grid h-9 w-9 place-items-center rounded-xl text-body hover:bg-surface"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                    <Link
                      href={`/admin/properties/${p.id}`}
                      aria-label="Edit"
                      title="Edit"
                      className="grid h-9 w-9 place-items-center rounded-xl text-navy-700 hover:bg-navy-50"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <ConfirmForm
                      action={deleteProperty.bind(null, p.id)}
                      message={`Delete “${p.title}”? Its photos will be removed too. This can't be undone.`}
                      buttonClassName="grid h-9 w-9 place-items-center rounded-xl text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" aria-label="Delete" />
                    </ConfirmForm>
                  </div>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
