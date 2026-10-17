import "@fontsource-variable/plus-jakarta-sans";
import "@fontsource/instrument-serif/400-italic.css";
import "@fontsource/oswald/500.css";
import "@fontsource/oswald/600.css";
import "./globals.css";
import type { Metadata, Viewport } from "next";
import { RevealObserver } from "@/components/ui/reveal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Valueconnect Consulting | Estate Surveyors & Valuers, Lagos",
    template: "%s | Valueconnect Consulting",
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "property valuation Lagos",
    "estate surveyors and valuers",
    "ESVARBON registered valuer",
    "mortgage valuation Nigeria",
    "facility management Lagos",
    "land administration C of O",
    "auctioneers Lagos",
    "property for sale Lagos",
  ],
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_NG",
    url: site.url,
    title: "Valueconnect Consulting | Estate Surveyors & Valuers",
    description: site.description,
  },
  twitter: { card: "summary_large_image" },
  appleWebApp: { capable: true, title: "Valueconnect", statusBarStyle: "black-translucent" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#04123a",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-NG" className="h-full" suppressHydrationWarning>
      <head>
        {/* Marks JS as available before paint so scroll-reveal never flashes. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="flex min-h-full flex-col">
        {children}
        <RevealObserver />
      </body>
    </html>
  );
}
