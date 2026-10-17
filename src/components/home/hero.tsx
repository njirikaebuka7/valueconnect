import { ArrowRight, BadgeCheck, FileCheck2, ShieldCheck } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Photo } from "@/components/ui/photo";
import { WhatsAppIcon } from "@/components/ui/social-icons";
import { photos } from "@/lib/images";
import { getContact } from "@/lib/settings";
import { whatsappLink } from "@/lib/site";
import { HeroSearch } from "./hero-search";

export async function Hero() {
  const contact = await getContact();
  return (
    <section className="px-2 pt-[4.5rem] sm:px-3 lg:px-4 lg:pt-[5.5rem]">
      <div className="relative isolate overflow-hidden rounded-[1.75rem] bg-navy-950 text-white shadow-[0_40px_90px_-40px_rgb(1_51_152/0.7)] sm:rounded-[2.25rem]">
        <Photo
          src={photos.heroHome}
          alt="Aerial view of a residential estate in Lagos"
          fill
          preload
          plainFallback
          sizes="100vw"
          quality={70}
          className="animate-hero-zoom -z-20 object-cover"
        />
        {/* Light tint so the photo reads; a soft pool of shade behind the words keeps them legible. */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-navy-950/55 via-navy-950/20 to-navy-950/80" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_45%,rgb(4_18_58/0.68),transparent_78%)]" />
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(45% 55% at 85% 10%, rgb(3 203 250 / 0.22), transparent 65%), radial-gradient(50% 60% at 0% 90%, rgb(18 63 179 / 0.45), transparent 60%)",
          }}
        />

        <div className="container-x relative flex min-h-[calc(100svh-5rem)] flex-col items-center justify-center pt-12 pb-10 text-center [text-shadow:0_2px_24px_rgb(4_18_58/0.45)] sm:pt-16 lg:min-h-[calc(100svh-6.5rem)] lg:pb-14">
          <p className="glass hero-in inline-flex items-center gap-2 rounded-full py-1.5 pr-4 pl-1.5 text-[0.7rem] font-bold tracking-[0.14em] text-aqua-100 uppercase sm:text-xs">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-aqua-500 text-navy-950">
              <ShieldCheck className="h-3.5 w-3.5" />
            </span>
            ESVARBON-registered · Nationwide
          </p>

          <h1 className="hero-rise mt-6 max-w-4xl text-[2.25rem] leading-[1.04] font-extrabold tracking-[-0.03em] text-balance text-white sm:text-[3.25rem] lg:text-[4.25rem]" style={{ "--d": "80ms" } as React.CSSProperties}>
            Valuation, estate agency &amp; auctioneering{" "}
            <span className="font-accent text-gradient">you can trust.</span>
          </h1>

          <p className="hero-in mt-5 max-w-2xl text-base leading-relaxed text-navy-100/85 sm:text-lg" style={{ "--d": "160ms" } as React.CSSProperties}>
            Registered Estate Surveyors &amp; Valuers for land, buildings, plant &amp; machinery and other assets,
            with estate agency, facility management and land administration nationwide.
          </p>

          <div className="hero-in mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row" style={{ "--d": "240ms" } as React.CSSProperties}>
            <ButtonLink href="/valuation" variant="accent" size="lg">
              Request a valuation <ArrowRight className="h-4 w-4" />
            </ButtonLink>
            <a
              href={whatsappLink(contact.whatsapp, "Hello Valueconnect, I'd like to speak to a valuer.")}
              target="_blank"
              rel="noopener noreferrer"
              className="glass inline-flex h-13 items-center justify-center gap-2 rounded-2xl px-6 text-[0.95rem] font-semibold text-white transition hover:bg-white/20"
            >
              <WhatsAppIcon className="h-4 w-4 text-aqua-300" /> Speak to a valuer
            </a>
          </div>

          <div className="hero-in mt-12 w-full sm:mt-14" style={{ "--d": "320ms" } as React.CSSProperties}>
            <HeroSearch />
          </div>

          <ul className="hero-in mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-semibold text-navy-100/80 sm:text-sm" style={{ "--d": "400ms" } as React.CSSProperties}>
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
      </div>
    </section>
  );
}
