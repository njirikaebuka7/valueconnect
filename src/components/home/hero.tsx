import { ArrowRight, BadgeCheck, FileCheck2, ShieldCheck } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Photo } from "@/components/ui/photo";
import { WhatsAppIcon } from "@/components/ui/social-icons";
import { img } from "@/lib/images";
import { whatsappLink } from "@/lib/site";
import { HeroSearch } from "./hero-search";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-navy-950 text-white">
      <Photo src={img.hero[0]} alt="" fill preload plainFallback sizes="100vw" className="-z-20 object-cover opacity-70" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-navy-950/85 via-navy-950/55 to-navy-950" />
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(45% 55% at 80% 15%, rgb(3 203 250 / 0.28), transparent 65%), radial-gradient(50% 60% at 5% 85%, rgb(18 63 179 / 0.55), transparent 60%)",
        }}
      />
      <div aria-hidden className="bg-grid-faint absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,black,transparent_70%)]" />

      <div className="container-x relative flex min-h-[100svh] flex-col items-center justify-center pt-28 pb-12 text-center sm:pt-32 lg:min-h-[94vh] lg:pb-16">
        <p className="glass animate-fade-up inline-flex items-center gap-2 rounded-full py-1.5 pr-4 pl-1.5 text-[0.7rem] font-bold tracking-[0.14em] text-aqua-100 uppercase sm:text-xs">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-aqua-500 text-navy-950">
            <ShieldCheck className="h-3.5 w-3.5" />
          </span>
          ESVARBON-registered · Nationwide
        </p>

        <h1 className="animate-fade-up mt-6 max-w-5xl text-[2.6rem] leading-[1.02] font-extrabold tracking-[-0.035em] text-white [animation-delay:80ms] sm:text-6xl lg:text-[5.25rem]">
          The true worth of property,{" "}
          <span className="font-accent text-gradient block pb-2 text-[1.08em] sm:inline">signed and sealed.</span>
        </h1>

        <p className="animate-fade-up mt-5 max-w-2xl text-base leading-relaxed text-navy-100/85 [animation-delay:160ms] sm:text-lg">
          Independent, inspection-led valuations from registered Estate Surveyors &amp; Valuers, built for lenders,
          boards, courts and families to rely on.
        </p>

        <div className="animate-fade-up mt-8 flex w-full flex-col gap-3 [animation-delay:240ms] sm:w-auto sm:flex-row">
          <ButtonLink href="/valuation" variant="accent" size="lg">
            Request a valuation <ArrowRight className="h-4 w-4" />
          </ButtonLink>
          <a
            href={whatsappLink("Hello Valueconnect, I'd like to speak to a valuer.")}
            target="_blank"
            rel="noopener noreferrer"
            className="glass inline-flex h-13 items-center justify-center gap-2 rounded-2xl px-6 text-[0.95rem] font-semibold text-white transition hover:bg-white/20"
          >
            <WhatsAppIcon className="h-4 w-4 text-aqua-300" /> Speak to a valuer
          </a>
        </div>

        <div className="animate-fade-up mt-12 w-full [animation-delay:320ms] sm:mt-14">
          <HeroSearch />
        </div>

        <ul className="animate-fade-up mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-semibold text-navy-100/80 [animation-delay:400ms] sm:text-sm">
          {["Bank-ready reports", "Title reviewed, not assumed", "Written fee before work starts"].map((t) => (
            <li key={t} className="flex items-center gap-1.5">
              <BadgeCheck className="h-4 w-4 text-aqua-400" />
              {t}
            </li>
          ))}
        </ul>
      </div>

      {/* Floating glass cards on wide screens */}
      <div
        aria-hidden
        className="glass animate-float absolute top-[30%] left-[4%] hidden w-56 rounded-2xl p-4 text-left 2xl:block"
      >
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-aqua-500/90 text-navy-950">
            <FileCheck2 className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-bold text-white">Sealed report</p>
            <p className="text-xs text-navy-100/70">ESVARBON stamp</p>
          </div>
        </div>
      </div>
      <div
        aria-hidden
        className="glass animate-float absolute top-[36%] right-[4%] hidden w-60 rounded-2xl p-4 text-left [animation-delay:1.5s] 2xl:block"
      >
        <p className="text-[0.65rem] font-bold tracking-[0.14em] text-aqua-200 uppercase">Basis of value</p>
        <p className="mt-1 text-sm font-bold text-white">Market &amp; Forced Sale Value</p>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/15">
          <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-aqua-400 to-navy-400" />
        </div>
      </div>
    </section>
  );
}
