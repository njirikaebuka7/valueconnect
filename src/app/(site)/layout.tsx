import { ContactProvider } from "@/components/layout/contact-context";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { MobileTabBar } from "@/components/layout/mobile-tab-bar";
import { JsonLd } from "@/components/seo/json-ld";
import { organizationJsonLd } from "@/lib/seo";
import { getContact } from "@/lib/settings";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const contact = await getContact();
  return (
    <ContactProvider value={contact}>
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer contact={contact} />
      <MobileTabBar />
      <JsonLd data={organizationJsonLd(contact)} />
    </ContactProvider>
  );
}
