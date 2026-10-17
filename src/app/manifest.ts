import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Valueconnect Consulting",
    short_name: "Valueconnect",
    description: "Property valuations, listings and real estate services across Nigeria.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#ffffff",
    theme_color: "#04123a",
    icons: [
      { src: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/brand/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Request a valuation", url: "/valuation" },
      { name: "Explore properties", url: "/properties" },
      { name: "Track a request", url: "/track" },
    ],
  };
}
