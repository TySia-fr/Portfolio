import type { Metadata } from "next";

import { site } from "@/content/site";

/**
 * Metadata for one page: title, description, canonical URL and the matching
 * Open Graph fields. Next.js replaces (does not merge) a page's `openGraph`
 * object, so every page builds the full set here instead of half of it.
 */
export function pageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
}: {
  title: string;
  description: string;
  /** Path starting with "/", e.g. "/a-propos". */
  path: `/${string}`;
  /** true: use the title as is, without the "— Siavash Izadi" suffix. */
  absoluteTitle?: boolean;
}): Metadata {
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "fr_FR",
      siteName: site.name,
      url: path,
      title: absoluteTitle ? title : `${title} — ${site.name}`,
      description,
    },
  };
}
