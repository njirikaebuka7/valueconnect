import { ChevronRight, FileCheck2, MapPin } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { SearchBox } from "@/components/admin/search-box";
import {
  buildHref,
  Card,
  EmptyState,
  FilterTabs,
  PageHeader,
  Pagination,
  ValuationStatusBadge,
} from "@/components/admin/ui";
import { FormAlert } from "@/components/ui/field";
import { requireAdmin } from "@/lib/auth";
import { mapValuationRequest } from "@/lib/data/mappers";
import { formatDate, timeAgo } from "@/lib/format";
import { valuationPurposeLabel, valuationStatusMeta } from "@/lib/options";
import { createClient } from "@/lib/supabase/server";
import type { ValuationStatus } from "@/lib/types";

export const metadata: Metadata = { title: "Valuation requests" };

const PER_PAGE = 20;

function one(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}

export default async function ValuationsPage({ searchParams }: PageProps<"/admin/valuations">) {
  await requireAdmin();
  const sp = await searchParams;
  const statusParam = one(sp.status);
  const status = statusParam && statusParam in valuationStatusMeta ? (statusParam as ValuationStatus) : undefined;
  const q = (one(sp.q) ?? "").replace(/[,()%*\\]/g, " ").trim().slice(0, 80);
  const page = Math.max(1, Number(one(sp.page)) || 1);

  const supabase = await createClient();
  let query = supabase
    .from("valuation_requests")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((page - 1) * PER_PAGE, page * PER_PAGE - 1);
  if (status) query = query.eq("status", status);
  if (q) {
    const like = `%${q}%`;
    query = query.or(
      `reference.ilike.${like},full_name.ilike.${like},email.ilike.${like},address.ilike.${like},phone.ilike.${like}`,
    );
  }

  const [{ data, count, error }, statuses] = await Promise.all([
    query,
    supabase.from("valuation_requests").select("status").limit(10000),
  ]);
  const requests = (data ?? []).map(mapValuationRequest);
  const counts = (statuses.data ?? []).reduce<Record<string, number>>((acc, r) => {
    acc[r.status as string] = (acc[r.status as string] ?? 0) + 1;
    return acc;
  }, {});
  const total = statuses.data?.length ?? 0;
  const pages = Math.max(1, Math.ceil((count ?? 0) / PER_PAGE));

  return (
    <>
      <PageHeader
        title="Valuation requests"
        description="Every request submitted on the website, newest first."
        actions={
          <Suspense>
            <SearchBox placeholder="Search name, email, reference…" className="w-full sm:w-80" />
          </Suspense>
        }
      />

      {one(sp.deleted) && (
        <div className="mb-4">
          <FormAlert tone="success">Request deleted.</FormAlert>
        </div>
      )}

      <FilterTabs
        items={[
          { href: buildHref("/admin/valuations", { q }), label: "All", count: total, active: !status },
          ...(Object.keys(valuationStatusMeta) as ValuationStatus[]).map((s) => ({
            href: buildHref("/admin/valuations", { status: s, q }),
            label: valuationStatusMeta[s].label,
            count: counts[s] ?? 0,
            active: status === s,
          })),
        ]}
      />

      <Card className="mt-4 overflow-hidden">
        {error ? (
          <div className="p-5">
            <FormAlert>Couldn&apos;t load requests: {error.message}</FormAlert>
          </div>
        ) : requests.length === 0 ? (
          <EmptyState
            icon={FileCheck2}
            title={q || status ? "No matching requests" : "No requests yet"}
            body={q || status ? "Try a different filter or search." : "New requests from the website's valuation form land here."}
          />
        ) : (
          <>
            {/* Desktop table */}
            <table className="hidden w-full text-left text-sm md:table">
              <thead className="bg-surface text-xs font-semibold text-muted">
                <tr>
                  <th className="px-5 py-3">Reference</th>
                  <th className="px-5 py-3">Client</th>
                  <th className="px-5 py-3">Purpose</th>
                  <th className="px-5 py-3">Location</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Received</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {requests.map((r) => (
                  <tr key={r.id} className="group relative transition hover:bg-surface/70">
                    <td className="px-5 py-3.5 font-mono text-xs font-semibold text-navy-700">
                      <Link href={`/admin/valuations/${r.id}`} className="after:absolute after:inset-0">
                        {r.reference}
                      </Link>
                      {r.urgency === "express" && (
                        <span className="ml-2 rounded-full bg-amber-50 px-1.5 py-0.5 font-sans text-[0.65rem] font-bold text-amber-700">
                          Express
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-ink">{r.fullName}</p>
                      <p className="text-xs text-muted">{r.email}</p>
                    </td>
                    <td className="px-5 py-3.5 text-body">{valuationPurposeLabel(r.purpose)}</td>
                    <td className="max-w-56 truncate px-5 py-3.5 text-body">
                      {r.city ? `${r.city}, ` : ""}
                      {r.state}
                    </td>
                    <td className="px-5 py-3.5">
                      <ValuationStatusBadge status={r.status} />
                    </td>
                    <td className="px-5 py-3.5 text-right text-xs text-muted" title={formatDate(r.createdAt)}>
                      {timeAgo(r.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile cards */}
            <ul className="divide-y divide-line md:hidden">
              {requests.map((r) => (
                <li key={r.id}>
                  <Link href={`/admin/valuations/${r.id}`} className="flex items-center gap-3 px-4 py-4 active:bg-surface">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[0.7rem] font-semibold text-navy-700">{r.reference}</span>
                        <ValuationStatusBadge status={r.status} />
                      </div>
                      <p className="mt-1 truncate font-semibold text-ink">{r.fullName}</p>
                      <p className="mt-0.5 truncate text-xs text-body">{valuationPurposeLabel(r.purpose)}</p>
                      <p className="mt-1 flex items-center gap-1 truncate text-xs text-muted">
                        <MapPin className="h-3 w-3 shrink-0" />
                        {r.city ? `${r.city}, ` : ""}
                        {r.state} · {timeAgo(r.createdAt)}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted" />
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </Card>

      <Pagination
        page={page}
        pages={pages}
        hrefFor={(p) => buildHref("/admin/valuations", { status, q, page: p })}
      />
    </>
  );
}
