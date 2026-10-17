import type { Metadata } from "next";
import { LegalPage } from "@/components/home/legal-page";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How Valueconnect Consulting collects, uses and protects your personal data.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy policy" updated="October 2026">
      <p>
        Valueconnect Consulting (&ldquo;we&rdquo;, &ldquo;us&rdquo;) respects your privacy. This policy explains what
        personal data we collect through this website, why we collect it and how we protect it, in line with the Nigeria
        Data Protection Act 2023 and the regulations of the Nigeria Data Protection Commission (NDPC).
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>Contact details you give us: your name, email address, phone number and, where relevant, company.</li>
        <li>Property details you share when requesting a valuation, consultation or listing information.</li>
        <li>Messages, enquiries and newsletter sign-ups.</li>
        <li>
          Basic technical data, such as browser type and pages visited, used to keep the site secure and working
          properly. Saved properties are stored only on your own device.
        </li>
      </ul>

      <h2>Why we use it</h2>
      <ul>
        <li>To respond to your enquiry and provide the services you request (performance of a contract).</li>
        <li>To send fee quotes, inspection schedules and updates on your request.</li>
        <li>To send occasional market notes if you subscribe (consent, which you can withdraw at any time).</li>
        <li>To meet our professional and legal obligations, including ESVARBON and NIESV requirements.</li>
      </ul>

      <h2>Sharing</h2>
      <p>
        We do not sell your data. We share it only with parties you ask us to (for example, your lender), service
        providers who host our website and database or send our emails under appropriate safeguards, or where the law
        or our regulator requires it.
      </p>

      <h2>Storage and security</h2>
      <p>
        Your data is stored with reputable cloud providers using encryption in transit and access controls. Only
        authorised staff can view requests. We keep records for as long as needed to provide our services and meet
        professional record-keeping obligations.
      </p>

      <h2>Your rights</h2>
      <p>
        You may ask to access, correct, delete or receive a copy of your personal data, object to or restrict certain
        processing, and withdraw consent. To exercise these rights, email{" "}
        <a href={`mailto:${site.email}`}>{site.email}</a>. You may also complain to the Nigeria Data Protection
        Commission.
      </p>

      <h2>Contact</h2>
      <p>
        {site.name}, {site.address.full} · {site.phones[0].display} · <a href={`mailto:${site.email}`}>{site.email}</a>
      </p>
    </LegalPage>
  );
}
