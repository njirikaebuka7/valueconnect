import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Accent, SectionHeading } from "@/components/ui/section-heading";
import { valuationSteps } from "@/lib/content";

export function ValuationSteps() {
  return (
    <section className="bg-surface py-20 sm:py-24">
      <div className="container-x">
        <SectionHeading
          eyebrow="How it works"
          title={
            <>
              From instruction to a <Accent>sealed report</Accent>
            </>
          }
          description="A clear, five-step process. You always know the fee, the timeline and who is signing before any work begins."
          action={
            <ButtonLink href="/valuation" variant="primary">
              Start your request <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          }
        />

        <ol className="relative mt-12 grid gap-4 lg:grid-cols-5 lg:gap-5">
          <span
            aria-hidden
            className="absolute top-7 right-[10%] left-[10%] hidden h-px bg-navy-100 lg:block"
          />
          {valuationSteps.map((step, i) => (
            <li
              key={step.title}
              data-reveal
              style={{ "--reveal-delay": `${i * 100}ms` } as React.CSSProperties}
              className="relative flex gap-4 lg:flex-col lg:gap-0"
            >
              {i < valuationSteps.length - 1 && (
                <span aria-hidden className="absolute top-14 bottom-[-1rem] left-7 w-px bg-navy-100 lg:hidden" />
              )}
              <span className="relative z-10 grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white font-brand text-xl font-semibold text-navy-700 shadow-card ring-1 ring-line lg:mx-auto">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex-1 rounded-3xl bg-white p-5 shadow-card ring-1 ring-line/70 transition hover:-translate-y-1 hover:shadow-lift lg:mt-5 lg:min-h-52 lg:text-center">
                <h3 className="text-base font-bold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-body">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
