import Link from "next/link";

import { StatusBadge } from "@/components/projects/status-badge";
import { TechList } from "@/components/projects/tech-list";
import type { Project } from "@/content/projects/schema";
import { projectsPage } from "@/content/projects-page";

/**
 * The whole card is clickable, but there is only ONE link (on the title):
 * its ::after pseudo-element stretches over the card. Screen readers and
 * keyboard users get a single, clearly named link instead of a wrapped block.
 */
export function ProjectCard({ project }: { project: Project }) {
  return (
    // The keyboard focus ring is drawn on the whole card (has-[a:focus-visible]),
    // because the focused link itself is visually the entire card.
    <article className="group relative flex flex-col gap-5 border border-line bg-surface p-6 transition-colors hover:border-muted has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-4 has-[a:focus-visible]:outline-signal">
      <div className="flex items-center justify-between gap-4">
        <StatusBadge status={project.status} />
        <span className="font-mono text-xs text-muted">{project.year}</span>
      </div>

      <div>
        <h3 className="font-mono text-xl font-medium tracking-tight [font-stretch:82%]">
          <Link
            href={`/projets/${project.slug}`}
            className="after:absolute after:inset-0 focus-visible:outline-none"
          >
            {project.title}
          </Link>
        </h3>
        <p className="mt-3 leading-relaxed text-muted">{project.summary}</p>
      </div>

      <div className="mt-auto flex flex-col gap-5">
        <TechList items={project.stack} label={projectsPage.detail.facts.stack} />
        <span
          aria-hidden="true"
          className="font-mono text-[0.8125rem] text-signal transition-transform group-hover:translate-x-0.5"
        >
          {projectsPage.card.readCaseStudy} →
        </span>
      </div>
    </article>
  );
}
