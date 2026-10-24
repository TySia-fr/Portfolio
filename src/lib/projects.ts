import "server-only";

import { projectSources } from "@/content/projects";
import { type Project, projectSchema } from "@/content/projects/schema";

const sources: readonly unknown[] = projectSources;

/**
 * Parsed once when the module loads, i.e. during the build.
 * Invalid content throws here and the build fails with Zod's error message.
 */
const projects: readonly Project[] = sources
  .map((source) => projectSchema.parse(source))
  .sort((a, b) => b.year - a.year);

const slugs = new Set<string>();
for (const project of projects) {
  if (slugs.has(project.slug)) {
    throw new Error(`Duplicate project slug: "${project.slug}"`);
  }
  slugs.add(project.slug);
}

export function getAllProjects(): readonly Project[] {
  return projects;
}

export function getFeaturedProjects(): readonly Project[] {
  return projects.filter((project) => project.featured);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
