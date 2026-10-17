import { Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  TiktokIcon,
  XIcon,
  YoutubeIcon,
} from "@/components/ui/social-icons";
import { services } from "@/lib/content";
import type { SiteContact, SocialKey } from "@/lib/site";

const socialIcons: Record<SocialKey, typeof FacebookIcon> = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  x: XIcon,
  linkedin: LinkedinIcon,
  youtube: YoutubeIcon,
  tiktok: TiktokIcon,
};

const company = [
  { href: "/about", label: "About us" },
  { href: "/properties", label: "Properties" },
  { href: "/valuation", label: "Request a valuation" },
  { href: "/track", label: "Track a request" },
  { href: "/consultation", label: "Book a consultation" },
  { href: "/contact", label: "Contact" },
];

export function Footer({ contact }: { contact: SiteContact }) {
  return (
    <footer className="mt-auto bg-navy-950 text-navy-100/75">
      <div className="container-x grid gap-10 pt-16 pb-12 sm:grid-cols-2 lg:grid-cols-12 lg:pt-20">
        <div className="lg:col-span-4">
          <Logo tone="light" />
          <p className="mt-5 max-w-sm text-sm leading-relaxed">
            A registered firm of Estate Surveyors &amp; Valuers operating under the guidelines of NIESV and ESVARBON.
            Independent value, <span className="font-semibold text-aqua-300">signed and sealed.</span>
          </p>
          {contact.socials.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-2" aria-label="Social media">
              {contact.socials.map(({ key, label, href }) => {
                const Icon = socialIcons[key];
                return (
                  <li key={key}>
                    <a
                      href={href}
                      aria-label={label}
                      title={label}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="grid h-9 w-9 place-items-center rounded-full bg-white/5 text-white ring-1 ring-white/10 transition hover:bg-aqua-500 hover:text-navy-950 hover:ring-aqua-500"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  </li>
                );
              })}
            </ul>
          )}
          <div className="mt-7 max-w-sm">
            <p className="text-sm font-bold text-white">Market notes by email</p>
            <p className="mt-1 text-xs">Values, rents and new listings, now and then. No spam.</p>
            <NewsletterForm className="mt-3" />
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
              <a href={contact.mapLink} target="_blank" rel="noopener noreferrer" className="hover:text-aqua-300">
                {contact.address}
              </a>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-aqua-400" />
              <span>
                {contact.phones.map((p, i) => (
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
              <a href={`mailto:${contact.email}`} className="break-all hover:text-aqua-300">
                {contact.email}
              </a>
            </li>
          </ul>
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
    </footer>
  );
}
