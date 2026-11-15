/**
 * The languages of the site (ADR-0008, ADR-0009). French is the default and
 * lives at the root; English lives under /en, Persian (right to left) under /fa. Everything locale-specific is looked up
 * from here, so adding a language is a new entry, not a search through pages.
 */
export const locales = ["fr", "en", "fa"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "fr";

/** Per-locale constants used by metadata, dates and structured data. */
export const localeInfo = {
  fr: {
    htmlLang: "fr",
    bcp47: "fr-FR",
    ogLocale: "fr_FR",
    label: "Français",
    short: "FR",
  },
  en: {
    htmlLang: "en",
    bcp47: "en-US",
    ogLocale: "en_US",
    label: "English",
    short: "EN",
  },
  fa: {
    htmlLang: "fa",
    bcp47: "fa-IR",
    ogLocale: "fa_IR",
    label: "فارسی",
    short: "FA",
  },
} as const satisfies Record<Locale, unknown>;

/**
 * Set by the language switcher only, so a visitor's explicit choice wins over
 * the browser's Accept-Language on the next visit to "/". Strictly functional
 * (no consent needed), documented on the legal pages.
 */
export const LOCALE_COOKIE = "lang";

/** A number in the locale's digits (Persian digits on /fa), without grouping. */
export const formatNumber = (locale: Locale, value: number) =>
  new Intl.NumberFormat(localeInfo[locale].bcp47, { useGrouping: false }).format(value);

/** Writing direction: Persian is right to left. */
export const dirOf = (locale: Locale): "ltr" | "rtl" => (locale === "fa" ? "rtl" : "ltr");

/** The locale a path belongs to: its first segment, when it names a locale. */
export function localeFromPath(pathname: string): Locale {
  const first = pathname.split("/")[1];
  return first === "en" || first === "fa" ? first : "fr";
}
