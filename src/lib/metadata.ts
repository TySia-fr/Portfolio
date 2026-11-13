import type { Metadata } from "next";

import { getContent } from "@/content";
import { type Locale, defaultLocale, localeInfo, locales } from "@/i18n/config";
import { alternates } from "@/i18n/routes";

/**
 * Metadata for one page: title, description, canonical URL, hreflang links to
 * the same page in the other language, and the matching Open Graph fields.
 * Next.js replaces (does not merge) a page's `openGraph` object, so every page
 * builds the full set here instead of half of it.
 */
export function pageMetadata({
  locale,
  title,
  description,
  path,
  absoluteTitle = false,
}: {
  locale: Locale;
  title: string;
  description: string;
  /** Path starting with "/", e.g. "/a-propos". */
  path: `/${string}`;
  /** true: use the title as is, without the "— Siavash Izadi" suffix. */
  absoluteTitle?: boolean;
}): Metadata {
  const { site } = getContent(locale);
  const pair = alternates(path);
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: path,
      // hreflang: tells search engines both URLs are one page in two languages.
      languages: pair
        ? {
            ...Object.fromEntries(locales.map((l) => [localeInfo[l].bcp47, pair[l]])),
            "x-default": pair[defaultLocale],
          }
        : undefined,
    },
    openGraph: {
      type: "website",
      locale: localeInfo[locale].ogLocale,
      alternateLocale: locales
        .filter((l) => l !== locale)
        .map((l) => localeInfo[l].ogLocale),
      siteName: site.name,
      url: path,
      title: absoluteTitle ? title : `${title} — ${site.name}`,
      description,
    },
  };
}
