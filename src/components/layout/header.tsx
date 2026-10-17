"use client";

import { ArrowUpRight, Menu, Phone, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/logo";
import { ButtonLink, buttonClass } from "@/components/ui/button";
import { services } from "@/lib/content";
import { cn } from "@/lib/format";
import { mainNav, site, whatsappLink } from "@/lib/site";
import { hasDarkHero, isActive } from "./routes";
import { WhatsAppIcon } from "@/components/ui/social-icons";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  // The menu belongs to the page it was opened on, so navigating closes it.
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const open = openedOn === pathname;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const overlay = hasDarkHero(pathname) && !scrolled;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          overlay
            ? "bg-gradient-to-b from-navy-950/60 to-transparent"
            : "glass-light border-b border-line/70 shadow-[0_8px_30px_-18px_rgb(4_18_58/0.35)]",
        )}
      >
        <div className="container-x flex h-16 items-center justify-between gap-3 lg:h-20">
          <Logo tone={overlay ? "light" : "dark"} compact className="sm:hidden" />
          <Logo tone={overlay ? "light" : "dark"} className="max-sm:hidden" />

          <nav
            aria-label="Main"
            className={cn(
              "hidden items-center gap-1 rounded-full p-1 lg:flex",
              overlay ? "glass" : "bg-surface ring-1 ring-line",
            )}
          >
            {mainNav.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-semibold transition",
                    overlay
                      ? active
                        ? "bg-white text-navy-900"
                        : "text-white/85 hover:bg-white/15 hover:text-white"
                      : active
                        ? "bg-navy-700 text-white shadow-sm"
                        : "text-body hover:bg-white hover:text-navy-800",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${site.phones[0].tel}`}
              className={cn(
                "hidden items-center gap-2 rounded-full px-3.5 py-2 text-sm font-semibold transition xl:inline-flex",
                overlay ? "glass text-white hover:bg-white/20" : "bg-surface text-navy-800 ring-1 ring-line hover:bg-navy-50",
              )}
            >
              <span className="grid h-6 w-6 place-items-center rounded-full bg-aqua-500 text-navy-950">
                <Phone className="h-3.5 w-3.5" />
              </span>
              {site.phones[0].display}
            </a>
            <ButtonLink href="/valuation" variant="accent" className="max-sm:hidden">
              Request a valuation
            </ButtonLink>
            <a
              href={`tel:${site.phones[0].tel}`}
              aria-label="Call us"
              className={cn(
                buttonClass(overlay ? "glass" : "outline", "icon"),
                "rounded-full sm:hidden",
              )}
            >
              <Phone className="h-[1.1rem] w-[1.1rem]" />
            </a>
            <button
              type="button"
              onClick={() => setOpenedOn(pathname)}
              aria-label="Open menu"
              aria-expanded={open}
              className={cn(buttonClass(overlay ? "glass" : "outline", "icon"), "rounded-full lg:hidden")}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {open && <MobileMenu pathname={pathname} onClose={() => setOpenedOn(null)} />}
    </>
  );
}

function MobileMenu({ pathname, onClose }: { pathname: string; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-0 z-[60] lg:hidden">
      <button aria-label="Close menu" onClick={onClose} className="animate-fade-in absolute inset-0 bg-navy-950/60 backdrop-blur-sm" />
      <div className="animate-sheet-up bg-navy-mesh absolute inset-x-0 bottom-0 max-h-[92dvh] overflow-y-auto rounded-t-[2rem] px-5 pt-3 pb-safe text-white">
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-white/25" />
        <div className="flex items-center justify-between">
          <Logo tone="light" compact href={null} />
          <button onClick={onClose} aria-label="Close menu" className={cn(buttonClass("glass", "icon"), "rounded-full")}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav aria-label="Mobile" className="mt-6 grid grid-cols-2 gap-2">
          {[...mainNav, { href: "/consultation", label: "Book consultation" }, { href: "/track", label: "Track request" }].map(
            (item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-2xl px-4 py-3.5 text-[0.95rem] font-semibold transition",
                  isActive(pathname, item.href) ? "bg-white text-navy-900" : "glass text-white",
                )}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <p className="mt-7 text-xs font-bold tracking-[0.14em] text-aqua-300 uppercase">Our services</p>
        <ul className="mt-3 divide-y divide-white/10">
          {services.map((s) => (
            <li key={s.slug}>
              <Link href={`/services/${s.slug}`} className="flex items-center justify-between py-3 text-sm text-white/85">
                {s.title}
                <ArrowUpRight className="h-4 w-4 text-aqua-400" />
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-6 grid grid-cols-2 gap-2 pb-6">
          <a href={`tel:${site.phones[0].tel}`} className={buttonClass("white", "lg")}>
            <Phone className="h-4 w-4" /> Call us
          </a>
          <a href={whatsappLink("Hello Valueconnect, I'd like to make an enquiry.")} target="_blank" rel="noopener noreferrer" className={buttonClass("accent", "lg")}>
            <WhatsAppIcon className="h-4 w-4" /> WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
