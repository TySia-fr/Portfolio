import { type Locale, locales } from "./config";

/**
 * Every page, in both languages. French URLs are the historical ones and never
 * change; English URLs use English words under /en. The alternance page is
 * French-only by design: its English counterpart is "open to roles", which
 * speaks to a different audience (ADR-0008).
 */
export const routes = {
  home: { fr: "/", en: "/en" },
  projects: { fr: "/projets", en: "/en/projects" },
  opportunities: { fr: "/alternance", en: "/en/open-to-roles" },
  cv: { fr: "/cv", en: "/en/cv" },
  about: { fr: "/a-propos", en: "/en/about" },
  contact: { fr: "/contact", en: "/en/contact" },
  legal: { fr: "/mentions-legales", en: "/en/legal" },
} as const satisfies Record<string, Record<Locale, `/${string}`>>;

export type RouteKey = keyof typeof routes;

export function href(locale: Locale, key: RouteKey): `/${string}` {
  return routes[key][locale];
}

export function projectHref(locale: Locale, slug: string): `/${string}` {
  return `${routes.projects[locale]}/${slug}`;
}

/**
 * The same page in every language, for one path of either language, or null
 * if the path is not a known page. Used by the language switcher and hreflang.
 */
export function alternates(pathname: string): Record<Locale, `/${string}`> | null {
  const path = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;
  for (const route of Object.values(routes)) {
    if (locales.some((locale) => route[locale] === path)) return route;
  }
  for (const locale of locales) {
    const prefix = `${routes.projects[locale]}/`;
    if (path.startsWith(prefix)) {
      const slug = path.slice(prefix.length);
      if (!slug.includes("/")) {
        return Object.fromEntries(
          locales.map((other) => [other, projectHref(other, slug)]),
        ) as Record<Locale, `/${string}`>;
      }
    }
  }
  return null;
}

/** The locale a path belongs to. */
export function localeOf(pathname: string): Locale {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "fr";
}
