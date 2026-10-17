"use client";

import { MessageSquareText, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { EnquiryForm } from "@/components/forms/enquiry-form";
import { WhatsAppIcon } from "@/components/ui/social-icons";
import { buttonClass } from "@/components/ui/button";
import { cn } from "@/lib/format";
import { site, whatsappLink } from "@/lib/site";

/** Sticky Call · WhatsApp · Enquire bar that sits above the mobile tab bar. */
export function PropertyActionBar({
  propertyId,
  propertyTitle,
  price,
  url,
}: {
  propertyId: string;
  propertyTitle: string;
  price: string;
  url: string;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <div className="glass-light fixed inset-x-0 bottom-[calc(76px+env(safe-area-inset-bottom))] z-30 border-t border-line/80 px-4 py-2.5 shadow-[0_-12px_30px_-22px_rgb(4_18_58/0.5)] lg:hidden">
        <div className="mx-auto flex max-w-md items-center gap-2">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[0.7rem] font-semibold text-muted">{propertyTitle}</p>
            <p className="truncate text-base font-extrabold text-navy-700">{price}</p>
          </div>
          <a
            href={`tel:${site.phones[0].tel}`}
            aria-label="Call Valueconnect"
            className={cn(buttonClass("outline", "icon"), "h-11 w-11 rounded-full")}
          >
            <Phone className="h-[1.1rem] w-[1.1rem]" />
          </a>
          <a
            href={whatsappLink(`Hello Valueconnect, I'm interested in "${propertyTitle}" ${url}`)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className={cn(buttonClass("outline", "icon"), "h-11 w-11 rounded-full text-navy-700")}
          >
            <WhatsAppIcon className="h-5 w-5" />
          </a>
          <button type="button" onClick={() => setOpen(true)} className={buttonClass("primary", "md", "h-11 rounded-full")}>
            <MessageSquareText className="h-4 w-4" /> Enquire
          </button>
        </div>
      </div>

      {open && (
        <div role="dialog" aria-modal="true" aria-label="Enquire about this property" className="fixed inset-0 z-[70] lg:hidden">
          <button
            type="button"
            aria-label="Close"
            onClick={() => setOpen(false)}
            className="animate-fade-in absolute inset-0 bg-navy-950/55 backdrop-blur-sm"
          />
          <div className="animate-sheet-up absolute inset-x-0 bottom-0 max-h-[92dvh] overflow-y-auto rounded-t-[2rem] bg-white px-5 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
            <div className="mx-auto h-1.5 w-12 rounded-full bg-line" />
            <div className="mt-3 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-extrabold">Enquire about this property</h2>
                <p className="mt-0.5 line-clamp-1 text-sm text-body">{propertyTitle}</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-surface"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <EnquiryForm propertyId={propertyId} propertyTitle={propertyTitle} idPrefix="sheet" className="mt-5" />
          </div>
        </div>
      )}
    </>
  );
}
