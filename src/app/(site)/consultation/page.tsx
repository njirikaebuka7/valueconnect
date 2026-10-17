import { CalendarCheck, ClipboardList, FileText, Phone, UserRoundCheck } from "lucide-react";
import type { Metadata } from "next";
import { ConsultationForm } from "@/components/forms/consultation-form";
import { PageHero } from "@/components/layout/page-hero";
import { WhatsAppIcon } from "@/components/ui/social-icons";
import { services } from "@/lib/content";
import { img } from "@/lib/images";
import { site, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Book a consultation",
  description:
    "Book a consultation with a registered Estate Surveyor & Valuer at our Victoria Island office, by phone or by video call.",
  alternates: { canonical: "/consultation" },
};

const expect = [
  { icon: ClipboardList, title: "We scope your instruction", body: "What you need, who will rely on it and any deadlines." },
  { icon: FileText, title: "We review your documents", body: "Bring or send copies of your title and survey if you have them." },
  { icon: UserRoundCheck, title: "You get clear advice", body: "The right service, a fee range and realistic timelines, with no obligation." },
];

export default async function ConsultationPage({ searchParams }: { searchParams: Promise<{ service?: string }> }) {
  const { service } = await searchParams;
  const defaultService = services.find((s) => s.slug === service || s.title === service)?.title;

  return (
    <>
      <PageHero
        eyebrow="Book a consultation"
        title={
          <>
            Speak with a <span className="font-accent text-gradient">registered valuer</span>
          </>
        }
        description="At our Victoria Island office, by phone or on a video call. Pick a time that suits you and we'll confirm."
        image={img.people[3]}
      />

      <section className="py-14 sm:py-20">
        <div className="container-x grid gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="rounded-[2rem] bg-white p-6 shadow-lift ring-1 ring-line/80 sm:p-9 lg:col-span-7">
            <h2 className="text-2xl font-bold">Choose your slot</h2>
            <p className="mt-1.5 text-sm">It takes under a minute. Fields marked * are required.</p>
            <div className="mt-7">
              <ConsultationForm defaultService={defaultService} />
            </div>
          </div>

          <aside className="space-y-4 lg:col-span-5">
            <div className="bg-navy-mesh relative overflow-hidden rounded-[2rem] p-6 text-white sm:p-8">
              <div aria-hidden className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-aqua-500/25 blur-3xl" />
              <p className="relative flex items-center gap-2 text-[0.7rem] font-bold tracking-[0.16em] text-aqua-200 uppercase">
                <CalendarCheck className="h-4 w-4" /> What to expect
              </p>
              <ol className="relative mt-6 space-y-5">
                {expect.map(({ icon: Icon, title, body }) => (
                  <li key={title} className="flex gap-4">
                    <span className="glass grid h-11 w-11 shrink-0 place-items-center rounded-xl text-aqua-300">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-bold text-white">{title}</p>
                      <p className="mt-1 text-sm text-navy-100/75">{body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <div className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-line/80">
              <p className="font-bold text-ink">Need to talk sooner?</p>
              <p className="mt-1 text-sm">Call or WhatsApp our team.</p>
              <div className="mt-4 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <a
                  href={`tel:${site.phones[0].tel}`}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-surface px-4 py-3 text-sm font-semibold text-navy-800 ring-1 ring-line hover:bg-navy-50"
                >
                  <Phone className="h-4 w-4 text-aqua-600" /> {site.phones[0].display}
                </a>
                <a
                  href={whatsappLink("Hello Valueconnect, I'd like to book a consultation.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-2xl bg-navy-700 px-4 py-3 text-sm font-semibold text-white hover:bg-navy-800"
                >
                  <WhatsAppIcon className="h-4 w-4 text-aqua-300" /> WhatsApp
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
