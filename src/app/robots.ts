import type { MetadataRoute } from "next";

import { site } from "@/content/site";

/** /robots.txt — everything public may be indexed; the sitemap lists it. */
export default function robots(): MetadataRoute.Robots {
  return {
    // The API is not content: nothing there for a search engine to index.
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
