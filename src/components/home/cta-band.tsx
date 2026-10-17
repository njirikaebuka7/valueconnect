import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/button";
import { Photo } from "@/components/ui/photo";
import { WhatsAppIcon } from "@/components/ui/social-icons";
import { photos } from "@/lib/images";
import { whatsappLink } from "@/lib/site";

export function CtaBand({
  title,
  description,
  image = photos.ctaBand,
}: {
  title?: ReactNode;
  description?: string;
  image?: string;
}) {
  return (
    <section className="pt-8 pb-20 sm:pb-24">
      <div className="container-x">
        <div
          data-reveal
          className="relative isolate overflow-hidden rounded-[2rem] bg-navy-950 px-6 py-14 text-center shadow-lift sm:px-12 sm:py-20"
        >
          <Photo src={image} alt="" fill sizes="(min-width: 1280px) 1216px, 100vw" className="-z-20 object-cover opacity-45" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-navy-950/95 via-navy-900/80 to-navy-800/60" />
          <div aria-hidden className="absolute -top-24 -right-24 -z-10 h-72 w-72 rounded-full bg-aqua-500/30 blur-3xl" />
          <h2 className="mx-auto max-w-3xl text-3xl leading-tight font-bold text-white sm:text-5xl">
            {title ?? (
              <>
                Need a valuation your bank will <span className="font-accent text-gradient">rely on?</span>
              </>
            )}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-navy-100/80 sm:text-lg">
            {description ??
              "Send us the details today. You'll get a written fee quote and inspection date from a registered valuer."}
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="/valuation" variant="accent" size="lg">
              Request a valuation <ArrowRight className="h-4 w-4" />
            </ButtonLink>
            <a
              href={whatsappLink("Hello Valueconnect, I'd like a valuation.")}
              target="_blank"
              rel="noopener noreferrer"
              className="glass inline-flex h-13 items-center justify-center gap-2 rounded-2xl px-6 text-[0.95rem] font-semibold text-white hover:bg-white/20"
            >
              <WhatsAppIcon className="h-4 w-4 text-aqua-300" /> Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
