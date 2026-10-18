import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  CalendarClock,
  CheckCircle2,
  FileCheck2,
  Hourglass,
  Inbox,
  Plus,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardHeader, EmptyState, PageHeader, StatCard, ValuationStatusBadge } from "@/components/admin/ui";
import { ButtonLink } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth";
import { mapValuationRequest } from "@/lib/data/mappers";
import { cn, timeAgo } from "@/lib/format";
import { valuationPurposeLabel, valuationStatusMeta } from "@/lib/options";
import { createClient } from "@/lib/supabase/server";
import type { ValuationStatus } from "@/lib/types";

export const metadata: Metadata = { title: "Dashboard" };

const toneBar: Record<string, string> = {
  aqua: "bg-aqua-500",
  sky: "bg-sky-400",
  violet: "bg-violet-500",
  amber: "bg-amber-400",
  navy: "bg-navy-600",
  green: "bg-emerald-500",
  slate: "bg-slate-300",
};

function lagosNow() {
  return new Date(Date.now() + 60 * 60 * 1000);
}

export default async function AdminDashboard() {
  const admin = await requireAdmin();
  const supabase = await createClient();
  const now = lagosNow();
  const today = now.toISOString().slice(0, 10);
  const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString();
  const sixMonthsAgo = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 5, 1)).toISOString();

  const [all, recent, published, messages, consultations] = await Promise.all([
    supabase.from("valuation_requests").select("status, created_at, updated_at").limit(10000),
    supabase.from("valuation_requests").select("*").order("created_at", { ascending: false }).limit(6),
    supabase.from("properties").select("id", { count: "exact", head: true }).eq("published", true),
    supabase.from("messages").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase
      .from("consultations")
      .select("id", { count: "exact", head: true })
      .in("status", ["new", "confirmed"])
      .gte("preferred_date", today),
  ]);

  const rows = (all.data ?? []) as { status: ValuationStatus; created_at: string; updated_at: string }[];
  const byStatus = Object.fromEntries(
    (Object.keys(valuationStatusMeta) as ValuationStatus[]).map((s) => [s, rows.filter((r) => r.status === s).length]),
  ) as Record<ValuationStatus, number>;
  const inProgress = byStatus.reviewing + byStatus.quoted + byStatus.scheduled + byStatus.in_progress;
  const completedThisMonth = rows.filter((r) => r.status === "completed" && r.updated_at >= monthStart).length;

  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 5 + i, 1));
    const key = d.toISOString().slice(0, 7);
    return {
      key,
      label: d.toLocaleDateString("en-NG", { month: "short", timeZone: "UTC" }),
      count: rows.filter((r) => r.created_at >= sixMonthsAgo && r.created_at.slice(0, 7) === key).length,
    };
  });
  const maxMonth = Math.max(1, ...months.map((m) => m.count));
  const recentRequests = (recent.data ?? []).map(mapValuationRequest);

  const hour = now.getUTCHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const name = admin.email.split("@")[0].split(/[._-]/)[0];

  return (
    <>
      <PageHeader
        title={
          <>
            {greeting}, <span className="capitalize">{name}</span>
          </>
        }
        description="Here's what's happening across valuations, listings and enquiries."
        actions={
          <>
            <ButtonLink href="/admin/properties/new" variant="outline" size="sm">
              <Plus className="h-4 w-4" /> Add property
            </ButtonLink>
            <ButtonLink href="/admin/valuations?status=new" size="sm">
              New requests <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3 2xl:grid-cols-6">
        <StatCard tone="dark" label="New requests" value={byStatus.new} hint="Awaiting first review" icon={FileCheck2} href="/admin/valuations?status=new" />
        <StatCard label="In progress" value={inProgress} hint="Reviewing → report" icon={Hourglass} href="/admin/valuations" />
        <StatCard tone="aqua" label="Completed this month" value={completedThisMonth} hint="Reports delivered" icon={CheckCircle2} href="/admin/valuations?status=completed" />
        <StatCard label="Live listings" value={published.count ?? 0} hint="Published properties" icon={Building2} href="/admin/properties" />
        <StatCard label="New messages" value={messages.count ?? 0} hint="Contact & enquiries" icon={Inbox} href="/admin/inbox" />
        <StatCard tone="aqua" label="Upcoming consultations" value={consultations.count ?? 0} hint="From today" icon={CalendarClock} href="/admin/consultations" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader
            title="Recent valuation requests"
            icon={FileCheck2}
            action={
              <Link href="/admin/valuations" className="text-xs font-semibold text-navy-700 hover:text-navy-900">
                View all
              </Link>
            }
          />
          {recentRequests.length === 0 ? (
            <EmptyState
              icon={FileCheck2}
              title="No requests yet"
              body="Requests submitted on the website's valuation form will appear here."
            />
          ) : (
            <ul className="divide-y divide-line">
              {recentRequests.map((r) => (
                <li key={r.id}>
                  <Link href={`/admin/valuations/${r.id}`} className="flex items-center gap-4 px-5 py-3.5 transition hover:bg-surface">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-navy-50 text-sm font-bold text-navy-700">
                      {r.fullName
                        .split(" ")
                        .map((w) => w[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ink">{r.fullName}</p>
                      <p className="truncate text-xs text-muted">
                        {valuationPurposeLabel(r.purpose)} · {r.city ? `${r.city}, ` : ""}
                        {r.state}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <ValuationStatusBadge status={r.status} />
                      <span className="text-[0.7rem] text-muted">{timeAgo(r.createdAt)}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <div className="grid gap-6">
          <Card>
            <CardHeader title="Requests, last 6 months" />
            <div className="flex h-48 items-end gap-3 px-5 pt-6 pb-4">
              {months.map((m) => (
                <div key={m.key} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                  <span className="text-xs font-bold text-ink">{m.count}</span>
                  <div
                    className="w-full max-w-10 rounded-t-lg bg-navy-600"
                    style={{ height: `${Math.max(4, (m.count / maxMonth) * 100)}%` }}
                    aria-hidden
                  />
                  <span className="text-[0.7rem] font-semibold text-muted">{m.label}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader title="Pipeline" />
            <div className="px-5 py-5">
              <div className="flex h-3 overflow-hidden rounded-full bg-surface" aria-hidden>
                {(Object.keys(valuationStatusMeta) as ValuationStatus[]).map((s) =>
                  byStatus[s] ? (
                    <div
                      key={s}
                      className={toneBar[valuationStatusMeta[s].tone]}
                      style={{ width: `${(byStatus[s] / Math.max(1, rows.length)) * 100}%` }}
                    />
                  ) : null,
                )}
              </div>
              <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5">
                {(Object.keys(valuationStatusMeta) as ValuationStatus[]).map((s) => (
                  <li key={s}>
                    <Link href={`/admin/valuations?status=${s}`} className="flex items-center gap-2 text-sm hover:text-navy-700">
                      <span className={cn("h-2.5 w-2.5 rounded-full", toneBar[valuationStatusMeta[s].tone])} />
                      <span className="flex-1 text-body">{valuationStatusMeta[s].label}</span>
                      <span className="font-bold text-ink">{byStatus[s]}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {[
          { href: "/admin/properties/new", label: "Add a property", body: "Upload photos and publish a listing", icon: Plus },
          { href: "/admin/valuations", label: "Work on requests", body: "Quote, schedule and respond", icon: FileCheck2 },
          { href: "/", label: "Open the website", body: "See what clients see", icon: ArrowUpRight },
        ].map((a) => (
          <Link
            key={a.href}
            href={a.href}
            target={a.href === "/" ? "_blank" : undefined}
            className="group flex items-center gap-4 rounded-2xl bg-white p-4 shadow-card ring-1 ring-line transition hover:shadow-lift"
          >
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-aqua-50 text-aqua-700 transition group-hover:bg-aqua-500 group-hover:text-navy-950">
              <a.icon className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-sm font-bold text-ink">{a.label}</span>
              <span className="block text-xs text-muted">{a.body}</span>
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}
