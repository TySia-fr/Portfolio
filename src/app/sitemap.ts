import type { MetadataRoute } from "next";

import { site } from "@/content/site";
import { getAllProjects } from "@/lib/projects";

/** /sitemap.xml — every public page, generated from the same data as the pages. */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ["", "/projets", "/a-propos", "/contact", "/mentions-legales"];
  const projectPages = getAllProjects().map((project) => `/projets/${project.slug}`);

  // Build time = last time any page could have changed (the site is static).
  const lastModified = new Date(process.env.BUILD_TIME ?? Date.now());

  return [...staticPages, ...projectPages].map((path) => ({
    url: `${site.url}${path}`,
    lastModified,
  }));
}
