import { z } from "zod";

/**
 * Shape of a project case study. Content files are validated against this
 * schema when the site is built: a missing field or a malformed URL fails the
 * build instead of shipping a broken page (ADR-0001).
 */

const text = z.string().trim().min(1);
const httpsUrl = z.url({ protocol: /^https$/ });

/**
 * A screenshot pre-optimised by scripts/capture-screenshots.mjs into
 * public/<base>-<width>.webp for every width listed. width/height are the
 * intrinsic size of the largest file and reserve space (no layout shift).
 * lib/projects.ts checks at build time that every file exists.
 */
const screenshot = z.object({
  base: z.string().regex(/^\/images\/[a-z0-9/-]+$/),
  widths: z.array(z.number().int().positive()).min(1),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  alt: text,
});

/**
 * An excerpt of a real file of the repository, cut between two marker lines at
 * build time (lib/source-excerpt.ts). The build fails if a marker disappears,
 * so the case study can never show code that no longer exists.
 */
const excerpt = z.object({
  title: text,
  file: z.string().regex(/^[A-Za-z0-9._/-]+$/),
  from: text,
  to: text,
  caption: text,
});

export const projectSchema = z
  .object({
    /** URL segment: /projets/<slug>. Lowercase letters, digits and dashes only. */
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    title: text,
    /** One sentence shown on cards and in search results. */
    summary: text.max(180),
    status: z.enum(["live", "in-progress"]),
    year: z.number().int().min(2020).max(2100),
    featured: z.boolean(),
    stack: z.array(text).min(1),

    links: z.object({
      live: httpsUrl.optional(),
      repository: httpsUrl.optional(),
    }),

    caseStudy: z.object({
      problem: text,
      audience: text,
      role: text,
      architecture: z.array(text).min(1),
      decisions: z.array(z.object({ title: text, body: text })).min(1),
      challenges: z.array(z.object({ problem: text, solution: text })),
      /** Shipped and checkable in the repository or on the live site. */
      implemented: z.array(text),
      /** Planned, not built. Shown separately so it is never mistaken for done. */
      nextSteps: z.array(text),
      limitations: z.array(text),
      excerpts: z.array(excerpt),
      /** Diagrams of this site's own infrastructure, drawn from src/content. */
      diagrams: z.array(z.enum(["architecture", "pipeline"])),
    }),

    media: z
      .object({
        desktop: screenshot,
        mobile: screenshot.optional(),
        gallery: z.array(screenshot.extend({ caption: text })),
      })
      .optional(),
  })
  // A project marked "live" must actually be reachable.
  .refine((project) => project.status !== "live" || project.links.live, {
    message: 'A project with status "live" needs links.live',
    path: ["links", "live"],
  });

export type Project = z.infer<typeof projectSchema>;
export type Screenshot = z.infer<typeof screenshot>;
export type Excerpt = z.infer<typeof excerpt>;
