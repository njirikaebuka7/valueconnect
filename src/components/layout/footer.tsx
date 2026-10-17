import { Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { FacebookIcon, InstagramIcon, LinkedinIcon, XIcon } from "@/components/ui/social-icons";
import { services } from "@/lib/content";
import { site } from "@/lib/site";

const socials = [
  { href: site.socials.facebook, label: "Facebook", Icon: FacebookIcon },
  { href: site.socials.x, label: "X (Twitter)", Icon: XIcon },
  { href: site.socials.instagram, label: "Instagram", Icon: InstagramIcon },
  { href: site.socials.linkedin, label: "LinkedIn", Icon: LinkedinIcon },
].filter((s) => s.href);

const company = [
  { href: "/about", label: "About us" },
  { href: "/properties", label: "Properties" },
  { href: "/valuation", label: "Request a valuation" },
  { href: "/track", label: "Track a request" },
  { href: "/consultation", label: "Book a consultation" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="relative mt-auto">
      {/* Newsletter strip */}
      <div className="container-x relative z-10 -mb-16">
        <div
          data-reveal
          className="bg-navy-mesh relative overflow-hidden rounded-[1.75rem] px-6 py-8 shadow-lift sm:px-10 lg:flex lg:items-center lg:justify-between lg:gap-10"
        >
          <div className="bg-grid-faint absolute inset-0 opacity-60" aria-hidden />
          <div className="relative flex items-start gap-4">
            <span className="glass hidden h-12 w-12 shrink-0 place-items-center rounded-2xl text-aqua-300 sm:grid">
              <Mail className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-white sm:text-2xl">
                Nigerian property, <span className="font-accent text-gradient">without the hype.</span>
              </h2>
              <p className="mt-1.5 max-w-xl text-sm text-navy-100/75">
                Occasional notes on values, rents, land titles and new listings, written by registered valuers. No spam.
              </p>
            </div>
          </div>
          <NewsletterForm className="relative mt-5 lg:mt-0 lg:max-w-md" />
        </div>
      </div>

      <div className="bg-navy-950 pt-28 text-navy-100/75">
        <div className="container-x grid gap-10 pb-12 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo tone="light" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed">
              A registered firm of Estate Surveyors &amp; Valuers operating under the guidelines of NIESV and ESVARBON.
              Independent value, <span className="font-semibold text-aqua-300">signed and sealed.</span>
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {site.accreditations.map((a) => (
                <span
                  key={a.code}
                  title={a.name}
                  className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[0.7rem] font-bold tracking-wider text-aqua-200"
                >
                  {a.code}
                </span>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-sm font-bold text-white">Services</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} className="transition hover:text-aqua-300">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-sm font-bold text-white">Company</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {company.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="transition hover:text-aqua-300">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-sm font-bold text-white">Visit or call</h3>
            <ul className="mt-4 space-y-3.5 text-sm">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-aqua-400" />
                <a href={site.mapLink} target="_blank" rel="noopener noreferrer" className="hover:text-aqua-300">
                  {site.address.full}
                </a>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-aqua-400" />
                <span>
                  {site.phones.map((p, i) => (
                    <span key={p.tel}>
                      {i > 0 && ", "}
                      <a href={`tel:${p.tel}`} className="hover:text-aqua-300">
                        {p.display}
                      </a>
                    </span>
                  ))}
                </span>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-aqua-400" />
                <a href={`mailto:${site.email}`} className="hover:text-aqua-300">
                  {site.email}
                </a>
              </li>
            </ul>
            {socials.length > 0 && (
              <div className="mt-5 flex gap-2">
                {socials.map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="grid h-9 w-9 place-items-center rounded-xl bg-white/5 text-white ring-1 ring-white/10 transition hover:bg-aqua-500 hover:text-navy-950"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="container-x flex flex-col gap-3 py-6 pb-44 text-xs sm:flex-row sm:items-center sm:justify-between lg:pb-6">
            <p>© {new Date().getFullYear()} Valueconnect Consulting. All rights reserved.</p>
            <div className="flex gap-5">
              <Link href="/privacy" className="hover:text-aqua-300">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-aqua-300">
                Terms
              </Link>
              <Link href="/admin" className="hover:text-aqua-300">
                Staff login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
