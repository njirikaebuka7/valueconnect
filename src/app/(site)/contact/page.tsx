import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/forms/contact-form";
import { FaqSection } from "@/components/home/faq-section";
import { PageHero } from "@/components/layout/page-hero";
import { WhatsAppIcon } from "@/components/ui/social-icons";
import { photos } from "@/lib/images";
import { site, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact us",
  description: `Visit, call or message Valueconnect Consulting at ${site.address.full}`,
  alternates: { canonical: "/contact" },
};

const cards = [
  {
    icon: MapPin,
    label: "Visit our office",
    value: site.address.full,
    href: site.mapLink,
    cta: "Get directions",
    external: true,
  },
  {
    icon: Phone,
    label: "Call us",
    value: site.phones.map((p) => p.display).join(" · "),
    href: `tel:${site.phones[0].tel}`,
    cta: "Call now",
  },
  {
    icon: Mail,
    label: "Email us",
    value: site.email,
    href: `mailto:${site.email}`,
    cta: "Send an email",
  },
  {
    icon: WhatsAppIcon,
    label: "WhatsApp",
    value: "Quick questions, documents and updates",
    href: whatsappLink("Hello Valueconnect, I have an enquiry."),
    cta: "Start a chat",
    external: true,
  },
] as const;

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Get in touch"
        title={
          <>
            Let&apos;s talk about your <span className="font-accent text-gradient">property</span>
          </>
        }
        description="Whether it's a valuation, a listing or a land title question, a registered professional will get back to you."
        image={photos.heroContact}
      />

      <section className="relative z-10 -mt-10 sm:-mt-14">
        <div className="container-x">
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
            {cards.map(({ icon: Icon, label, value, href, cta, ...rest }) => (
              <li key={label}>
                <a
                  href={href}
                  {...("external" in rest ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group flex h-full flex-col rounded-3xl bg-white p-5 shadow-lift ring-1 ring-line/80 transition hover:-translate-y-1"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-navy-700 text-aqua-300 transition group-hover:bg-aqua-500 group-hover:text-navy-950">
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="mt-4 text-xs font-bold tracking-[0.12em] text-muted uppercase">{label}</p>
                  <p className="mt-1 flex-1 text-sm font-semibold text-ink">{value}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-navy-700">
                    {cta} <ArrowUpRight className="h-4 w-4" />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="container-x grid gap-8 lg:grid-cols-2 lg:gap-10">
          <div data-reveal className="rounded-[2rem] bg-white p-6 shadow-card ring-1 ring-line/80 sm:p-9">
            <p className="eyebrow">
              <span className="h-px w-6 bg-aqua-500" />
              Send a message
            </p>
            <h2 className="mt-3 text-2xl font-bold sm:text-3xl">We&apos;d love to hear from you</h2>
            <p className="mt-2 text-sm">
              Need a valuation quote? Use our{" "}
              <Link href="/valuation" className="font-semibold text-navy-700 underline decoration-aqua-400 underline-offset-4">
                valuation request form
              </Link>{" "}
              for the fastest response.
            </p>
            <div className="mt-7">
              <ContactForm />
            </div>
          </div>

          <div
            data-reveal
            style={{ "--reveal-delay": "120ms" } as React.CSSProperties}
            className="relative min-h-[26rem] overflow-hidden rounded-[2rem] bg-surface shadow-card ring-1 ring-line/80"
          >
            <iframe
              title="Map showing Valueconnect Consulting, Victoria Island, Lagos"
              src={site.mapEmbed}
              className="absolute inset-0 h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="glass-light absolute inset-x-4 bottom-4 flex items-start gap-3 rounded-2xl p-4 shadow-card">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-navy-700 text-aqua-300">
                <MapPin className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-bold text-ink">Valueconnect Consulting</p>
                <p className="text-xs text-body">{site.address.full}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FaqSection limit={5} />
    </>
  );
}
