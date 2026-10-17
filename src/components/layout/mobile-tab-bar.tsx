"use client";

import { Compass, Heart, House, ScanSearch } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoMark } from "@/components/brand/logo";
import { cn } from "@/lib/format";
import { isActive } from "./routes";

const tabs = [
  { href: "/", label: "Home", icon: House },
  { href: "/properties", label: "Explore", icon: Compass },
  { href: "/valuation", label: "Valuation", icon: null },
  { href: "/saved", label: "Saved", icon: Heart },
  { href: "/track", label: "Track", icon: ScanSearch },
] as const;

/** App-style bottom navigation for phones. */
export function MobileTabBar() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="App"
      className="glass-light fixed inset-x-0 bottom-0 z-40 border-t border-line/80 pb-safe shadow-[0_-10px_30px_-20px_rgb(4_18_58/0.45)] lg:hidden"
    >
      <ul className="mx-auto grid max-w-md grid-cols-5 px-2">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = isActive(pathname, href);
          if (!Icon) {
            return (
              <li key={href} className="flex justify-center">
                <Link href={href} className="-mt-5 flex flex-col items-center gap-1" aria-current={active ? "page" : undefined}>
                  <span
                    className={cn(
                      "grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-navy-700 to-navy-950 shadow-[0_10px_24px_-8px_rgb(1_51_152/0.8)] ring-4 ring-white transition active:scale-95",
                      active && "from-aqua-500 to-navy-700",
                    )}
                  >
                    <LogoMark tone="light" className="w-8" />
                  </span>
                  <span className={cn("text-[0.68rem] font-bold", active ? "text-navy-700" : "text-muted")}>{label}</span>
                </Link>
              </li>
            );
          }
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className="flex flex-col items-center gap-1 py-2.5"
              >
                <span
                  className={cn(
                    "grid h-8 w-12 place-items-center rounded-full transition",
                    active ? "bg-navy-50 text-navy-700" : "text-muted",
                  )}
                >
                  <Icon className="h-[1.3rem] w-[1.3rem]" strokeWidth={active ? 2.4 : 2} />
                </span>
                <span className={cn("text-[0.68rem] font-semibold", active ? "text-navy-700" : "text-muted")}>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
