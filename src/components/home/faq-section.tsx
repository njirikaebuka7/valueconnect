import { CalendarCheck, Phone } from "lucide-react";
import { Accordion } from "@/components/ui/accordion";
import { ButtonLink } from "@/components/ui/button";
import { Accent, SectionHeading } from "@/components/ui/section-heading";
import { WhatsAppIcon } from "@/components/ui/social-icons";
import { faqs } from "@/lib/content";
import { site, whatsappLink } from "@/lib/site";

export function FaqSection({ limit }: { limit?: number }) {
  return (
    <section className="py-20 sm:py-24">
      <div className="container-x grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5">
          <SectionHeading
            eyebrow="Questions, answered"
            title={
              <>
                Frequently asked <Accent>questions</Accent>
              </>
            }
            description="The things clients most often ask before instructing a valuer. Can't see yours? Talk to us."
          />
          <div
            data-reveal
            className="bg-navy-mesh relative mt-8 overflow-hidden rounded-[2rem] p-6 text-white shadow-lift sm:p-8"
          >
            <div aria-hidden className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-aqua-500/25 blur-3xl" />
            <span className="glass grid h-12 w-12 place-items-center rounded-2xl text-aqua-300">
              <CalendarCheck className="h-5 w-5" />
            </span>
            <h3 className="mt-5 text-xl font-bold text-white">Book a consultation</h3>
            <p className="mt-2 text-sm leading-relaxed text-navy-100/80">
              Meet a registered valuer at our Victoria Island office, by phone or on a video call. We&apos;ll scope your
              instruction and explain the fee before you commit.
            </p>
            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
              <ButtonLink href="/consultation" variant="accent">
                Book a slot
              </ButtonLink>
              <a
                href={whatsappLink("Hello Valueconnect, I have a question about a valuation.")}
                target="_blank"
                rel="noopener noreferrer"
                className="glass inline-flex h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold text-white hover:bg-white/20"
              >
                <WhatsAppIcon className="h-4 w-4 text-aqua-300" /> WhatsApp
              </a>
            </div>
            <a href={`tel:${site.phones[0].tel}`} className="mt-5 inline-flex items-center gap-2 text-sm text-navy-100/80 hover:text-white">
              <Phone className="h-4 w-4 text-aqua-400" /> {site.phones[0].display}
            </a>
          </div>
        </div>
        <div data-reveal style={{ "--reveal-delay": "120ms" } as React.CSSProperties} className="lg:col-span-7 lg:pt-4">
          <Accordion items={limit ? faqs.slice(0, limit) : faqs} />
        </div>
      </div>
    </section>
  );
}
