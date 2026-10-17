"use client";

import {
  Building2,
  CalendarClock,
  ExternalLink,
  FileCheck2,
  Inbox,
  LayoutDashboard,
  LogOut,
  MoreHorizontal,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { signOut } from "@/app/actions/admin";
import { LogoMark } from "@/components/brand/logo";
import { cn } from "@/lib/format";

type NavItem = { href: string; label: string; short: string; icon: typeof LayoutDashboard; badge?: number };

function isActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === "/admin" : pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminShell({
  email,
  newRequests,
  newMessages,
  children,
}: {
  email: string;
  newRequests: number;
  newMessages: number;
  children: ReactNode;
}) {
  const pathname = usePathname();
  // The sheet belongs to the page it was opened on, so navigating closes it.
  const [moreOpenAt, setMoreOpenAt] = useState<string | null>(null);
  const more = moreOpenAt === pathname;
  const setMore = (open: boolean) => setMoreOpenAt(open ? pathname : null);

  const nav: NavItem[] = [
    { href: "/admin", label: "Dashboard", short: "Home", icon: LayoutDashboard },
    { href: "/admin/valuations", label: "Valuation requests", short: "Requests", icon: FileCheck2, badge: newRequests },
    { href: "/admin/properties", label: "Properties", short: "Listings", icon: Building2 },
    { href: "/admin/consultations", label: "Consultations", short: "Bookings", icon: CalendarClock },
    { href: "/admin/inbox", label: "Inbox", short: "Inbox", icon: Inbox, badge: newMessages },
    { href: "/admin/subscribers", label: "Subscribers", short: "Subscribers", icon: Users },
  ];
  const tabs = [nav[0], nav[1], nav[2], nav[4]];
  const overflow = [nav[3], nav[5]];

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[17rem_1fr]">
      {/* Desktop sidebar */}
      <aside className="bg-navy-mesh sticky top-0 hidden h-dvh flex-col text-white lg:flex">
        <Link href="/admin" className="flex items-center gap-3 px-6 pt-7 pb-8">
          <LogoMark tone="light" className="w-10" />
          <span className="leading-tight">
            <span className="font-brand block text-lg font-semibold tracking-wide uppercase">Valueconnect</span>
            <span className="text-xs font-semibold text-aqua-300">Admin</span>
          </span>
        </Link>
        <nav aria-label="Admin" className="flex-1 space-y-1 px-3">
          {nav.map((item) => {
            const active = isActive(pathname, item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition",
                  active ? "bg-white text-navy-900 shadow-sm" : "text-navy-100/75 hover:bg-white/10 hover:text-white",
                )}
              >
                <Icon className={cn("h-[1.1rem] w-[1.1rem]", active ? "text-navy-700" : "text-aqua-300/80")} />
                <span className="flex-1">{item.label}</span>
                {!!item.badge && (
                  <span className="rounded-full bg-aqua-500 px-2 py-0.5 text-[0.68rem] font-bold text-navy-950">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="space-y-3 border-t border-white/10 p-4">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-navy-100/80 hover:bg-white/10 hover:text-white"
          >
            <ExternalLink className="h-4 w-4 text-aqua-300" /> View site
          </Link>
          <div className="glass rounded-2xl p-3">
            <p className="truncate text-xs text-navy-100/70" title={email}>
              Signed in as
              <span className="block truncate text-sm font-semibold text-white">{email}</span>
            </p>
            <form action={signOut} className="mt-2">
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 py-2 text-xs font-semibold text-white hover:bg-white/20"
              >
                <LogOut className="h-3.5 w-3.5" /> Sign out
              </button>
            </form>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-col">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl flex h-14 items-center justify-between border-b border-line px-4 lg:hidden">
          <Link href="/admin" className="flex items-center gap-2">
            <LogoMark className="w-8" />
            <span className="font-brand text-base font-semibold tracking-wide text-navy-950 uppercase">Admin</span>
          </Link>
          <Link href="/" className="text-xs font-semibold text-navy-700">
            View site
          </Link>
        </header>

        <main className="flex-1 px-4 pt-5 pb-28 sm:px-6 lg:px-10 lg:pt-9 lg:pb-12">{children}</main>
      </div>

      {/* Mobile bottom tabs */}
      <nav
        aria-label="Admin tabs"
        className="fixed inset-x-0 bottom-0 z-30 bg-white/95 backdrop-blur-xl border-t border-line pb-safe lg:hidden"
      >
        <ul className="grid grid-cols-5">
          {tabs.map((item) => {
            const active = isActive(pathname, item.href);
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link href={item.href} className="relative flex flex-col items-center gap-1 py-2.5">
                  <span
                    className={cn(
                      "grid h-8 w-12 place-items-center rounded-full transition",
                      active ? "bg-navy-50 text-navy-700" : "text-muted",
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  {!!item.badge && (
                    <span className="absolute top-1.5 left-1/2 ml-2 rounded-full bg-aqua-500 px-1.5 text-[0.6rem] font-bold text-navy-950">
                      {item.badge}
                    </span>
                  )}
                  <span className={cn("text-[0.66rem] font-semibold", active ? "text-navy-700" : "text-muted")}>
                    {item.short}
                  </span>
                </Link>
              </li>
            );
          })}
          <li>
            <button
              type="button"
              onClick={() => setMore(true)}
              className="flex w-full flex-col items-center gap-1 py-2.5"
              aria-haspopup="dialog"
            >
              <span
                className={cn(
                  "grid h-8 w-12 place-items-center rounded-full",
                  overflow.some((o) => isActive(pathname, o.href)) ? "bg-navy-50 text-navy-700" : "text-muted",
                )}
              >
                <MoreHorizontal className="h-5 w-5" />
              </span>
              <span className="text-[0.66rem] font-semibold text-muted">More</span>
            </button>
          </li>
        </ul>
      </nav>

      {more && (
        <div role="dialog" aria-modal="true" aria-label="More" className="fixed inset-0 z-50 lg:hidden">
          <button aria-label="Close" onClick={() => setMore(false)} className="animate-fade-in absolute inset-0 bg-navy-950/50" />
          <div className="animate-sheet-up absolute inset-x-0 bottom-0 rounded-t-[1.75rem] bg-white px-5 pt-3 pb-safe">
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-line" />
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold">More</p>
              <button onClick={() => setMore(false)} aria-label="Close" className="grid h-9 w-9 place-items-center rounded-full bg-surface">
                <X className="h-4 w-4" />
              </button>
            </div>
            <ul className="mt-3 space-y-1">
              {overflow.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link href={item.href} className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold hover:bg-surface">
                      <Icon className="h-5 w-5 text-navy-600" /> {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="mt-3 border-t border-line pt-3 pb-5">
              <p className="truncate px-3 text-xs text-muted">{email}</p>
              <form action={signOut}>
                <button type="submit" className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-red-600 hover:bg-red-50">
                  <LogOut className="h-5 w-5" /> Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
