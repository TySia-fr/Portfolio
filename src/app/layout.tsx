import type { Metadata, Viewport } from "next";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { site } from "@/content/site";
import { geistSans, martianMono } from "@/fonts";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.role}`,
    template: `%s — ${site.name}`,
  },
  description:
    "Portfolio de Siavash Izadi, développeur full-stack JavaScript basé en France : projets, méthode et contact.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: site.name,
  },
};

export const viewport: Viewport = {
  themeColor: "#111416",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${geistSans.variable} ${martianMono.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        {/* First focusable element: lets keyboard users jump past the header. */}
        <a
          href="#contenu"
          className="sr-only z-50 bg-signal px-4 py-2 font-mono text-sm text-ink focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          {site.ui.skipToContent}
        </a>
        <SiteHeader />
        <main id="contenu" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
