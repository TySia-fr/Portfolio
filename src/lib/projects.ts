import "server-only";

import { existsSync } from "node:fs";
import { join } from "node:path";

import { projectSourcesEn } from "@/content/en/projects";
import { projectSources } from "@/content/projects";
import { type Project, projectSchema } from "@/content/projects/schema";
import type { Locale } from "@/i18n/config";

/**
 * Parsed once when the module loads, i.e. during the build.
 * Invalid content throws here and the build fails with Zod's error message.
 */
function parse(sources: readonly unknown[]): readonly Project[] {
  const projects = sources
    .map((source) => projectSchema.parse(source))
    .sort((a, b) => b.year - a.year);
  const slugs = new Set<string>();
  for (const project of projects) {
    if (slugs.has(project.slug)) {
      throw new Error(`Duplicate project slug: "${project.slug}"`);
    }
    slugs.add(project.slug);
  }
  return projects;
}

const byLocale: Record<Locale, readonly Project[]> = {
  fr: parse(projectSources),
  en: parse(projectSourcesEn),
};

// Both languages must describe the same projects with the same facts that a
// reader can compare: slug, status, links, year, featured. Words may differ.
const fingerprint = (p: Project) =>
  JSON.stringify([p.slug, p.status, p.year, p.featured, p.links, p.stack]);
const frPrints = byLocale.fr.map(fingerprint).sort().join("\n");
const enPrints = byLocale.en.map(fingerprint).sort().join("\n");
if (frPrints !== enPrints) {
  throw new Error(
    "French and English projects differ (slug, status, links, year or stack)",
  );
}

// Every screenshot file referenced by content must exist: a missing image
// fails the build instead of shipping a broken <img>. Build only: at runtime
// this module also loads (e.g. for crawlers) and must never throw on files.
const isBuild = process.env.NEXT_PHASE === "phase-production-build";
for (const project of isBuild ? [...byLocale.fr, ...byLocale.en] : []) {
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

export function getAllProjects(locale: Locale): readonly Project[] {
  return byLocale[locale];
}

export function getFeaturedProjects(locale: Locale): readonly Project[] {
  return byLocale[locale].filter((project) => project.featured);
}

export function getProjectBySlug(locale: Locale, slug: string): Project | undefined {
  return byLocale[locale].find((project) => project.slug === slug);
}
