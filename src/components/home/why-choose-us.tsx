import { BadgeCheck, CalendarCheck, FileSearch, FileText, Scale, ShieldCheck } from "lucide-react";
import { Photo } from "@/components/ui/photo";
import { SectionHeading } from "@/components/ui/section-heading";
import { whyChooseUs } from "@/lib/content";
import { photos } from "@/lib/images";

const icons = [ShieldCheck, Scale, BadgeCheck, FileSearch, FileText, CalendarCheck];

export function WhyChooseUs() {
  return (
    <section className="bg-navy-mesh relative overflow-hidden py-20 text-white sm:py-28">
      <div aria-hidden className="bg-grid-faint absolute inset-0 opacity-40" />
      <div className="container-x relative">
        <SectionHeading
          tone="light"
          eyebrow="Why Valueconnect"
          title={
            <>
              Advice you can take to the <span className="font-accent text-gradient">bank</span>
            </>
          }
          description="In a market where asking prices and paperwork can mislead, we inspect, verify and value property on the facts."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-12">
          <div data-reveal className="relative min-h-80 overflow-hidden rounded-[2rem] bg-navy-900 lg:col-span-5">
            <Photo src={photos.whyChooseUs} alt="Valuer presenting a report to clients" fill sizes="(min-width: 1024px) 500px, 92vw" className="object-cover opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/10 to-transparent" />
            <div className="glass absolute inset-x-4 bottom-4 rounded-2xl p-5">
              <p className="text-[0.65rem] font-bold tracking-[0.16em] text-aqua-200 uppercase">Our promise</p>
              <p className="mt-1.5 text-lg leading-snug font-bold">
                The value the evidence supports, not the value anyone hopes for.
              </p>
            </div>
          </div>

          <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            {whyChooseUs.map((item, i) => {
              const Icon = icons[i % icons.length];
              return (
                <li
                  key={item.title}
                  data-reveal
                  style={{ "--reveal-delay": `${(i % 2) * 100}ms` } as React.CSSProperties}
                  className="glass rounded-3xl p-5 transition hover:bg-white/15 sm:p-6"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-aqua-500 text-navy-950">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-base font-bold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-navy-100/75">{item.body}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
