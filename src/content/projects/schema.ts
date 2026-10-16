import { z } from "zod";

/**
 * Shape of a project case study. Content files are validated against this
 * schema when the site is built: a missing field or a malformed URL fails the
 * build instead of shipping a broken page (ADR-0001).
 */

const text = z.string().trim().min(1);
const httpsUrl = z.url({ protocol: /^https$/ });

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
      nextSteps: z.array(text),
    }),
  })
  // A project marked "live" must actually be reachable.
  .refine((project) => project.status !== "live" || project.links.live, {
    message: 'A project with status "live" needs links.live',
    path: ["links", "live"],
  });

export type Project = z.infer<typeof projectSchema>;
