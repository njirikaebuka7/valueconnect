"use client";

import { createContext, use, type ReactNode } from "react";
import { defaultContact, type SiteContact } from "@/lib/site";

const ContactContext = createContext<SiteContact>(defaultContact);

/** Hands the admin-edited contact details to client components. */
export function ContactProvider({ value, children }: { value: SiteContact; children: ReactNode }) {
  return <ContactContext value={value}>{children}</ContactContext>;
}

export const useContact = () => use(ContactContext);
