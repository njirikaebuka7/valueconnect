import { ChevronLeft, ChevronRight, type LucideIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/format";
import { consultationStatusMeta, messageStatusMeta, valuationStatusMeta } from "@/lib/options";
import type { ConsultationStatus, MessageStatus, ValuationStatus } from "@/lib/types";

export function PageHeader({
  title,
  description,
  actions,
  back,
}: {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  back?: { href: string; label: string };
}) {
  return (
    <div className="mb-6 lg:mb-8">
      {back && (
        <Link href={back.href} className="mb-3 inline-flex items-center gap-1 text-sm font-semibold text-navy-700 hover:text-navy-900">
          <ChevronLeft className="h-4 w-4" />
          {back.label}
        </Link>
      )}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight sm:text-[1.75rem]">{title}</h1>
          {description && <p className="mt-1 text-sm text-body">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
    </div>
  );
}

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("rounded-2xl bg-white shadow-card ring-1 ring-line", className)}>{children}</div>;
}

export function CardHeader({ title, action, icon: Icon }: { title: ReactNode; action?: ReactNode; icon?: LucideIcon }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
      <h2 className="flex items-center gap-2 text-[0.95rem] font-bold">
        {Icon && <Icon className="h-4 w-4 text-aqua-600" />}
        {title}
      </h2>
      {action}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  href,
  tone = "navy",
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  icon: LucideIcon;
  href?: string;
  tone?: "navy" | "aqua" | "dark";
}) {
  const body = (
    <div
      className={cn(
        "group relative h-full overflow-hidden rounded-2xl p-4 ring-1 transition sm:p-5",
        tone === "dark" ? "bg-navy-mesh text-white ring-navy-900" : "bg-white shadow-card ring-line hover:shadow-lift",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className={cn("text-xs font-semibold sm:text-sm", tone === "dark" ? "text-navy-100/80" : "text-body")}>{label}</p>
        <span
          className={cn(
            "grid h-9 w-9 shrink-0 place-items-center rounded-xl",
            tone === "dark" ? "glass text-aqua-300" : tone === "aqua" ? "bg-aqua-50 text-aqua-700" : "bg-navy-50 text-navy-700",
          )}
        >
          <Icon className="h-[1.1rem] w-[1.1rem]" />
        </span>
      </div>
      <p className={cn("mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl", tone === "dark" ? "text-white" : "text-ink")}>
        {value}
      </p>
      {hint && <p className={cn("mt-1 text-xs", tone === "dark" ? "text-aqua-200/80" : "text-muted")}>{hint}</p>}
    </div>
  );
  return href ? (
    <Link href={href} className="block h-full">
      {body}
    </Link>
  ) : (
    body
  );
}

export function EmptyState({ icon: Icon, title, body, action }: { icon: LucideIcon; title: string; body?: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-navy-50 text-navy-600">
        <Icon className="h-6 w-6" />
      </span>
      <p className="mt-4 font-bold text-ink">{title}</p>
      {body && <p className="mt-1 max-w-sm text-sm text-body">{body}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function ValuationStatusBadge({ status }: { status: ValuationStatus }) {
  const meta = valuationStatusMeta[status];
  return <Badge tone={meta.tone}>{meta.label}</Badge>;
}

export function ConsultationStatusBadge({ status }: { status: ConsultationStatus }) {
  const meta = consultationStatusMeta[status];
  return <Badge tone={meta.tone}>{meta.label}</Badge>;
}

export function MessageStatusBadge({ status }: { status: MessageStatus }) {
  const meta = messageStatusMeta[status];
  return <Badge tone={meta.tone}>{meta.label}</Badge>;
}

export function FilterTabs({
  items,
}: {
  items: { href: string; label: string; count?: number; active: boolean }[];
}) {
  return (
    <div className="no-scrollbar -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <div className="inline-flex gap-1 rounded-2xl bg-white p-1 shadow-card ring-1 ring-line">
        {items.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            scroll={false}
            className={cn(
              "flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold whitespace-nowrap transition sm:text-sm",
              t.active ? "bg-navy-700 text-white" : "text-body hover:bg-surface hover:text-ink",
            )}
          >
            {t.label}
            {t.count != null && (
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[0.65rem] leading-none font-bold",
                  t.active ? "bg-white/20 text-white" : "bg-surface text-muted",
                )}
              >
                {t.count}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}

export function Pagination({ page, pages, hrefFor }: { page: number; pages: number; hrefFor: (p: number) => string }) {
  if (pages <= 1) return null;
  return (
    <div className="mt-5 flex items-center justify-between text-sm">
      <p className="text-muted">
        Page {page} of {pages}
      </p>
      <div className="flex gap-2">
        {page > 1 ? (
          <Link href={hrefFor(page - 1)} className="inline-flex items-center gap-1 rounded-xl bg-white px-3 py-2 font-semibold ring-1 ring-line hover:bg-surface">
            <ChevronLeft className="h-4 w-4" /> Previous
          </Link>
        ) : null}
        {page < pages ? (
          <Link href={hrefFor(page + 1)} className="inline-flex items-center gap-1 rounded-xl bg-white px-3 py-2 font-semibold ring-1 ring-line hover:bg-surface">
            Next <ChevronRight className="h-4 w-4" />
          </Link>
        ) : null}
      </div>
    </div>
  );
}

export function DetailList({ rows }: { rows: Array<[string, ReactNode]> }) {
  return (
    <dl className="divide-y divide-line">
      {rows
        .filter(([, v]) => v != null && v !== "" && v !== false)
        .map(([k, v]) => (
          <div key={k} className="grid gap-1 px-5 py-3 sm:grid-cols-[11rem_1fr] sm:gap-4">
            <dt className="text-xs font-semibold text-muted sm:text-sm">{k}</dt>
            <dd className="text-sm break-words text-ink">{v}</dd>
          </div>
        ))}
    </dl>
  );
}

/** Builds a URL for list pages, preserving the current filters. */
export function buildHref(base: string, params: Record<string, string | number | undefined | null>) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== null && v !== "") sp.set(k, String(v));
  const qs = sp.toString();
  return qs ? `${base}?${qs}` : base;
}
