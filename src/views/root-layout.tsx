import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { LogoIntro, LogoRouteIntro } from "@/components/brand/logo-intro";
import { LogoRouteReplay } from "@/components/brand/logo-route-replay";
import { LogoSessionGate } from "@/components/brand/logo-session-gate";
import { JsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getContent } from "@/content";
import { geistSans, martianMono } from "@/fonts";
import { type Locale, localeInfo } from "@/i18n/config";
import { href } from "@/i18n/routes";
import { pageMetadata } from "@/lib/metadata";
import { siteGraph } from "@/lib/structured-data";

/**
 * Each language has its own root layout (app/(fr) and app/(en)), so <html lang>
 * is right in the prerendered HTML without reading the request. Both render
 * this one document (ADR-0008).
 */
export function rootMetadata(locale: Locale): Metadata {
  const { site } = getContent(locale);
  const base = pageMetadata({
    locale,
    // Both scripts in the home title: people search the name in Latin and in Persian.
    title: `${site.name} (${site.nameFa}) — ${site.role}`,
    description: site.meta.description,
    path: href(locale, "home"),
    absoluteTitle: true,
  });
  return {
    ...base,
    metadataBase: new URL(site.url),
    title: {
      default: `${site.name} (${site.nameFa}) — ${site.role}`,
      template: `%s — ${site.name}`,
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#111416",
  colorScheme: "dark",
};

export function RootDocument({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  const { site } = getContent(locale);
  return (
    // suppressHydrationWarning: LogoSessionGate may add data-logo-* attributes to <html>
    // before hydration. It only affects this element's own attributes.
    <html
      lang={localeInfo[locale].htmlLang}
      className={`${geistSans.variable} ${martianMono.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <LogoSessionGate />
        <LogoIntro />
        <LogoRouteIntro />
        <LogoRouteReplay />
        {/* First focusable element: lets keyboard users jump past the header. */}
        <a
          href="#contenu"
          className="sr-only z-50 bg-signal px-4 py-2 font-mono text-sm text-ink focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          {site.ui.skipToContent}
        </a>
        <SiteHeader locale={locale} />
        <main id="contenu" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <SiteFooter locale={locale} />
        <JsonLd data={siteGraph(locale)} />
      </body>
    </html>
  );
}
