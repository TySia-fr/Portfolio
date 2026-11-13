/**
 * The two languages of the site (ADR-0008). French is the default and lives at
 * the root; English lives under /en. Everything locale-specific is looked up
 * from here, so adding a language is a new entry, not a search through pages.
 */
export const locales = ["fr", "en"] as const;
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
} as const satisfies Record<Locale, unknown>;

/**
 * Set by the language switcher only, so a visitor's explicit choice wins over
 * the browser's Accept-Language on the next visit to "/". Strictly functional
 * (no consent needed), documented on the legal pages.
 */
export const LOCALE_COOKIE = "lang";
