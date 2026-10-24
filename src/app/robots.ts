import type { MetadataRoute } from "next";

import { site } from "@/content/site";

/** /robots.txt — everything public may be indexed; the sitemap lists it. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
