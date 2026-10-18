import {
  Banknote,
  BookOpen,
  Building,
  Calculator,
  Handshake,
  Landmark,
  Receipt,
  Scale,
  Shield,
  TrendingUp,
  Users,
} from "lucide-react";
import { Accent, SectionHeading } from "@/components/ui/section-heading";
import { clientSegments, valuationPurposeDetails } from "@/lib/content";

const purposeIcons = [Banknote, BookOpen, Shield, Handshake, Landmark, Receipt, Scale, TrendingUp, Calculator, Building];

export function Purposes() {
  return (
    <section className="py-20 sm:py-24">
      <div className="container-x">
        <SectionHeading
          align="center"
          eyebrow="Valuations for every purpose"
          title={
            <>
              Whatever the reason, the <Accent>right basis</Accent> of value
            </>
          }
          description="Tell us who will rely on the report and we'll confirm the basis, format and standards it needs to meet."
        />

        <ul className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
          {valuationPurposeDetails.map((p, i) => {
            const Icon = purposeIcons[i % purposeIcons.length];
            return (
              <li
                key={p.title}
                data-reveal
                style={{ "--reveal-delay": `${(i % 5) * 70}ms` } as React.CSSProperties}
                className="group rounded-3xl bg-white p-4 shadow-card ring-1 ring-line/80 transition hover:-translate-y-1 hover:shadow-lift hover:ring-aqua-200 sm:p-5"
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-aqua-50 text-aqua-700 transition group-hover:bg-aqua-500 group-hover:text-navy-950">
                  <Icon className="h-[1.15rem] w-[1.15rem]" />
                </span>
                <h3 className="mt-4 text-sm font-bold sm:text-[0.95rem]">{p.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-body sm:text-[0.8rem]">{p.body}</p>
              </li>
            );
          })}
        </ul>

        <div data-reveal className="mt-14 rounded-[2rem] bg-surface p-6 ring-1 ring-line sm:p-10">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">
                <Users className="h-4 w-4" /> Who we work with
              </p>
              <h3 className="mt-2 text-2xl font-bold">Trusted advice for every kind of client</h3>
            </div>
          </div>
          <ul className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {clientSegments.map((c) => (
              <li key={c.title} className="flex items-start gap-3 rounded-2xl bg-white p-4 ring-1 ring-line/80">
                <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-aqua-500" />
                <div>
                  <p className="text-sm font-bold text-ink">{c.title}</p>
                  <p className="mt-0.5 text-xs text-body">{c.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
