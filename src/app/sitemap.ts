import type { MetadataRoute } from "next";

import { site } from "@/content/site";
import { getAllProjects } from "@/lib/projects";

/** /sitemap.xml — every public page, generated from the same data as the pages. */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ["", "/projets", "/a-propos", "/contact", "/mentions-legales"];
  const projectPages = getAllProjects().map((project) => `/projets/${project.slug}`);

  return [...staticPages, ...projectPages].map((path) => ({
    url: `${site.url}${path}`,
  }));
}
