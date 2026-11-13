import type { MetadataRoute } from "next";

import { site } from "@/content/site";
import { defaultLocale, localeInfo, locales } from "@/i18n/config";
import { alternates, projectHref, routes } from "@/i18n/routes";
import { getAllProjects } from "@/lib/projects";

/**
 * /sitemap.xml — every public page in both languages, generated from the same
 * route table and project registry as the pages. Each entry lists its
 * counterparts (hreflang), as Google recommends for multilingual sites.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = locales.flatMap((locale) => [
    ...Object.values(routes).map((route) => route[locale]),
    ...getAllProjects(locale).map((project) => projectHref(locale, project.slug)),
  ]);

  // Build time = last time any page could have changed (the site is static).
  const lastModified = new Date(process.env.BUILD_TIME ?? Date.now());
  const url = (path: string) => `${site.url}${path === "/" ? "" : path}`;

  return paths.map((path) => {
    const pair = alternates(path);
    return {
      url: url(path),
      lastModified,
      alternates: pair
        ? {
            languages: {
              ...Object.fromEntries(
                locales.map((locale) => [localeInfo[locale].bcp47, url(pair[locale])]),
              ),
              "x-default": url(pair[defaultLocale]),
            },
          }
        : undefined,
    };
  });
}
