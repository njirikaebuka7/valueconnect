import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/home/legal-page";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of use",
  description: "Terms that apply to using the Valueconnect Consulting website.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of use" updated="October 2026">
      <p>
        By using this website you agree to these terms. If you do not agree, please do not use the site.
      </p>

      <h2>Information on this site</h2>
      <p>
        Content on this website is for general information only and is not a valuation or professional advice. A
        valuation is provided only under a signed engagement letter and is set out in a report signed and sealed by a
        registered Estate Surveyor &amp; Valuer.
      </p>

      <h2>Property listings</h2>
      <p>
        We take care to keep listings accurate, but details, prices and availability can change and are subject to
        contract. Photographs may be illustrative. Always inspect a property and complete your own legal due diligence
        before paying any money.
      </p>

      <h2>Payments</h2>
      <p>
        We will never ask you to pay fees into a personal bank account. Payments are made only to Valueconnect
        Consulting&apos;s official company account, as stated on our engagement letter or invoice. If in doubt, call us
        on {site.phones[0].display} before you pay.
      </p>

      <h2>Requests and quotes</h2>
      <p>
        Submitting a valuation request or booking does not create an engagement. Fees, scope and timelines are agreed in
        writing before any work begins.
      </p>

      <h2>Intellectual property</h2>
      <p>
        The Valueconnect name, logo and website content belong to Valueconnect Consulting and may not be reused without
        permission.
      </p>

      <h2>Privacy</h2>
      <p>
        Our <Link href="/privacy">privacy policy</Link> explains how we handle your personal data.
      </p>

      <h2>Governing law</h2>
      <p>These terms are governed by the laws of the Federal Republic of Nigeria.</p>
    </LegalPage>
  );
}
