import type { ReactNode } from "react";

/** Plain, readable layout for policy pages (header is solid on these routes). */
export function LegalPage({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <div className="bg-surface pt-28 pb-20 sm:pt-36">
      <div className="container-x">
        <article className="mx-auto max-w-3xl rounded-[2rem] bg-white p-6 shadow-card ring-1 ring-line/80 sm:p-12">
          <p className="eyebrow">Legal</p>
          <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">{title}</h1>
          <p className="mt-2 text-sm text-muted">Last updated {updated}</p>
          <div className="mt-8 space-y-6 text-[0.95rem] leading-relaxed [&_h2]:mt-10 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-ink [&_li]:ml-5 [&_li]:list-disc [&_li]:pl-1 [&_a]:font-semibold [&_a]:text-navy-700 [&_a]:underline [&_a]:decoration-aqua-400 [&_a]:underline-offset-4 [&_ul]:space-y-2">
            {children}
          </div>
        </article>
      </div>
    </div>
  );
}
