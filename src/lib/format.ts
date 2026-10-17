import type { Property } from "./types";

const naira = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

export function formatNaira(amount: number) {
  return naira.format(amount).replace("NGN", "₦").replace(/\s/g, "");
}

/** ₦1.25B / ₦450M / ₦3.5M style, for cards and stats. */
export function formatNairaCompact(amount: number) {
  if (amount >= 1_000_000_000) return `₦${trim(amount / 1_000_000_000)}B`;
  if (amount >= 1_000_000) return `₦${trim(amount / 1_000_000)}M`;
  if (amount >= 1_000) return `₦${trim(amount / 1_000)}K`;
  return `₦${amount}`;
}

function trim(n: number) {
  return n.toFixed(n >= 100 ? 0 : n >= 10 ? 1 : 2).replace(/\.?0+$/, "");
}

const periodSuffix = { year: "/year", month: "/month", night: "/night" } as const;

export function formatPrice(p: Pick<Property, "price" | "pricePeriod" | "priceOnRequest">) {
  if (p.priceOnRequest || !p.price) return "Price on request";
  return `${formatNaira(p.price)}${p.pricePeriod ? periodSuffix[p.pricePeriod] : ""}`;
}

export function formatDate(value: string | null | undefined, opts?: Intl.DateTimeFormatOptions) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-NG", opts ?? { day: "numeric", month: "short", year: "numeric" });
}

export function formatDateTime(value: string | null | undefined) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function timeAgo(value: string) {
  const diff = Date.now() - new Date(value).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(value);
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
