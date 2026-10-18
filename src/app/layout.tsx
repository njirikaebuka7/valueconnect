import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Oswald, Plus_Jakarta_Sans } from "next/font/google";
import { RevealObserver } from "@/components/ui/reveal";
import { site } from "@/lib/site";

// Self-hosted at build time, with metric-matched fallbacks so text doesn't jump. Only the
// Latin file is preloaded; the extended file (₦ and accented names) still loads when used.
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jakarta",
});

// Only the logo wordmark uses Oswald: one weight, Latin only.
const oswald = Oswald({
  subsets: ["latin"],
  weight: "600",
  display: "swap",
  variable: "--font-oswald",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Valueconnect Consulting | Estate Surveyors & Valuers, Lagos",
    template: "%s | Valueconnect",
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
  // Set these in Vercel to verify the site in Google Search Console / Bing Webmaster Tools.
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    ...(process.env.BING_SITE_VERIFICATION && { other: { "msvalidate.01": process.env.BING_SITE_VERIFICATION } }),
  },
};

export const viewport: Viewport = {
  themeColor: "#04123a",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const introScript = `(function(){var d=document.documentElement;d.classList.add('js');try{if(sessionStorage.getItem('vc-intro')||matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('intro-done')}else{sessionStorage.setItem('vc-intro','1');setTimeout(function(){d.classList.add('intro-done')},1800)}}catch(e){d.classList.add('intro-done')}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-NG" className={`${jakarta.variable} ${oswald.variable} h-full`} suppressHydrationWarning>
      <head>
        {/* Runs before paint: enables scroll-reveal, and plays the brand intro only on the first page of a visit. */}
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        {children}
        <RevealObserver />
      </body>
    </html>
  );
}
