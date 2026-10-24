import Link from "next/link";

import { BrowserFrame, PhoneFrame, Screenshot } from "@/components/projects/screenshot";
import { StatusBadge } from "@/components/projects/status-badge";
import { TechList } from "@/components/projects/tech-list";
import type { Project } from "@/content/projects/schema";
import { projectsPage } from "@/content/projects-page";

/**
 * A featured project, full width: text on one side, real screenshots on the
 * other. One main link (the title) covers the card; the secondary links sit
 * above it (relative z-10) so they stay independently clickable.
 */
export function FeaturedProject({
  project,
  headingLevel = 2,
  priority = false,
}: {
  project: Project;
  headingLevel?: 2 | 3;
  priority?: boolean;
}) {
  const Heading = `h${headingLevel}` as const;
  const t = projectsPage;

  return (
    <article className="card-lift group relative grid overflow-hidden border border-line bg-surface has-[a.card-link:focus-visible]:outline-2 has-[a.card-link:focus-visible]:outline-offset-4 has-[a.card-link:focus-visible]:outline-signal lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <div className="flex flex-col gap-6 p-6 sm:p-8 lg:p-10">
        <div className="flex items-center justify-between gap-4">
          <StatusBadge status={project.status} />
          <span className="font-mono text-xs text-muted">{project.year}</span>
        </div>

        <div>
          <Heading className="font-mono text-2xl font-medium tracking-tight [font-stretch:80%] sm:text-3xl">
            <Link
              href={`/projets/${project.slug}`}
              className="card-link after:absolute after:inset-0 focus-visible:outline-none"
            >
              {project.title}
            </Link>
          </Heading>
          <p className="mt-4 text-[1.0625rem] leading-relaxed text-pretty text-muted">
            {project.summary}
          </p>
        </div>

        <TechList items={project.stack} label={t.detail.facts.stack} />

        <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-3 pt-2 font-mono text-[0.8125rem]">
          <span aria-hidden="true" className="text-signal">
            {t.card.readCaseStudy} <span className="nudge">→</span>
          </span>
          {project.links.live ? (
            <a
              href={project.links.live}
              className="relative z-10 text-muted underline decoration-line underline-offset-4 transition-colors hover:text-text hover:decoration-muted"
            >
              {t.detail.links.live} <span aria-hidden="true">↗</span>
            </a>
          ) : null}
          {project.links.repository ? (
            <a
              href={project.links.repository}
              className="relative z-10 text-muted underline decoration-line underline-offset-4 transition-colors hover:text-text hover:decoration-muted"
            >
              {t.detail.links.repository} <span aria-hidden="true">↗</span>
            </a>
          ) : null}
        </div>
      </div>

      {project.media ? (
        // Fixed height, screenshots cropped at the bottom: the card reads as a
        // window onto the site. From lg the height follows the text column.
        <div className="relative h-72 overflow-hidden border-t border-line bg-ink sm:h-96 lg:h-auto lg:min-h-80 lg:border-t-0 lg:border-l">
          <div aria-hidden="true" className="bg-grid absolute inset-0" />
          <div className="card-media absolute inset-x-6 top-8 sm:inset-x-10 sm:top-10">
            <BrowserFrame
              address={project.links.live?.replace("https://", "") ?? project.slug}
            >
              <Screenshot
                shot={project.media.desktop}
                sizes="(min-width: 80rem) 40rem, (min-width: 64rem) 55vw, 90vw"
                priority={priority}
              />
            </BrowserFrame>
            {project.media.mobile ? (
              <div className="absolute top-14 -right-2 hidden w-[24%] sm:block">
                <PhoneFrame>
                  <Screenshot shot={project.media.mobile} sizes="9rem" />
                </PhoneFrame>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </article>
  );
}
