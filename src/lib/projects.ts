import "server-only";

import { existsSync } from "node:fs";
import { join } from "node:path";

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

// Every screenshot file referenced by content must exist: a missing image
// fails the build instead of shipping a broken <img>. Build only: at runtime
// this module also loads (e.g. for crawlers) and must never throw on files.
const isBuild = process.env.NEXT_PHASE === "phase-production-build";
for (const project of isBuild ? projects : []) {
  const shots = project.media
    ? [project.media.desktop, project.media.mobile, ...project.media.gallery]
    : [];
  for (const shot of shots) {
    for (const width of shot?.widths ?? []) {
      // Build-time check only: keep public/ out of the server file trace.
      const file = join(
        /*turbopackIgnore: true*/ process.cwd(),
        "public",
        `${shot?.base}-${width}.webp`,
      );
      if (!existsSync(file)) {
        throw new Error(`Project "${project.slug}": missing screenshot ${file}`);
      }
    }
  }
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
