import { ArrowLeft, Compass } from "lucide-react";
import type { Metadata } from "next";
import { Logo } from "@/components/brand/logo";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <main className="bg-navy-mesh relative isolate flex min-h-[100svh] flex-col overflow-hidden text-white">
      <div aria-hidden className="bg-grid-faint absolute inset-0 -z-10 opacity-60" />
      <div aria-hidden className="absolute top-1/4 left-1/2 -z-10 h-80 w-80 -translate-x-1/2 rounded-full bg-aqua-500/25 blur-3xl" />
      <div className="container-x py-6">
        <Logo tone="light" />
      </div>
      <div className="container-x flex flex-1 flex-col items-center justify-center pb-20 text-center">
        <p className="font-brand text-gradient text-[7rem] leading-none font-semibold sm:text-[10rem]">404</p>
        <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
          This page has <span className="font-accent text-gradient">moved on</span>
        </h1>
        <p className="mt-4 max-w-md text-navy-100/80">
          The page you&apos;re looking for doesn&apos;t exist, or the listing may have been sold or let.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/" variant="accent" size="lg">
            <ArrowLeft className="h-4 w-4" /> Back to home
          </ButtonLink>
          <ButtonLink href="/properties" variant="glass" size="lg">
            <Compass className="h-4 w-4" /> Explore properties
          </ButtonLink>
        </div>
      </div>
    </main>
  );
}
