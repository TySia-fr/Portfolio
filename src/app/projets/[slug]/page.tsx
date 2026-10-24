import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { Container } from "@/components/layout/container";
import { ArchitectureDiagram } from "@/components/pipeline/architecture-diagram";
import { PipelineDiagram } from "@/components/pipeline/pipeline-diagram";
import { DashList } from "@/components/prose";
import { BrowserFrame, PhoneFrame, Screenshot } from "@/components/projects/screenshot";
import { StatusBadge } from "@/components/projects/status-badge";
import { TechList } from "@/components/projects/tech-list";
import type { Project } from "@/content/projects/schema";
import { projectsPage } from "@/content/projects-page";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";
import { getAllProjects, getProjectBySlug } from "@/lib/projects";
import { readExcerpt } from "@/lib/source-excerpt";

const t = projectsPage.detail;

/** Every known project is prerendered at build time. */
export function generateStaticParams() {
  return getAllProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/projets/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};

  return pageMetadata({
    title: project.title,
    description: project.summary,
    path: `/projets/${project.slug}`,
  });
}

type Section = { id: string; title: string; content: ReactNode };

export default async function ProjectPage({ params }: PageProps<"/projets/[slug]">) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  // Normally unreachable: src/proxy.ts answers unknown slugs with a real 404
  // before rendering starts. Kept as a second line of defence.
  if (!project) notFound();

  const sections = buildSections(project);

  return (
    <>
      <Container className="pt-12 sm:pt-20">
        <Link
          href="/projets"
          className="group font-mono text-[0.8125rem] text-muted transition-colors hover:text-text"
        >
          <span aria-hidden="true">←</span> {t.back}
        </Link>

        <header className="mt-10">
          <StatusBadge status={project.status} />
          <h1 className="mt-5 font-mono text-display font-medium [font-stretch:76%]">
            {project.title}
          </h1>
          <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-pretty text-muted">
            {project.summary}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {project.links.live ? (
              <a href={project.links.live} className="btn btn-primary">
                {t.links.live} <span aria-hidden="true">↗</span>
              </a>
            ) : null}
            {project.links.repository ? (
              <a href={project.links.repository} className="btn btn-secondary">
                {t.links.repository} <span aria-hidden="true">↗</span>
              </a>
            ) : null}
          </div>

          <dl className="mt-12 grid gap-6 border-y border-line py-6 font-mono text-[0.8125rem] sm:grid-cols-[8rem_1fr_1.4fr]">
            <div>
              <dt className="text-xs tracking-[0.14em] text-muted uppercase">
                {t.facts.year}
              </dt>
              <dd className="mt-2 text-text">{project.year}</dd>
            </div>
            <div>
              <dt className="text-xs tracking-[0.14em] text-muted uppercase">
                {t.facts.role}
              </dt>
              <dd className="mt-2 font-sans text-sm leading-relaxed text-text">
                {project.caseStudy.role}
              </dd>
            </div>
            <div>
              <dt className="text-xs tracking-[0.14em] text-muted uppercase">
                {t.facts.stack}
              </dt>
              <dd className="mt-2">
                <TechList items={project.stack} label={t.facts.stack} />
              </dd>
            </div>
          </dl>
        </header>
      </Container>

      {project.media ? (
        <Container className="mt-12">
          <div className="relative pb-10 sm:pr-[12%]">
            <BrowserFrame
              address={project.links.live?.replace("https://", "") ?? project.slug}
            >
              <Screenshot
                shot={project.media.desktop}
                sizes="(min-width: 72rem) 62rem, 92vw"
                priority
              />
            </BrowserFrame>
            {project.media.mobile ? (
              <div className="absolute right-0 bottom-0 hidden w-[19%] sm:block">
                <PhoneFrame>
                  <Screenshot shot={project.media.mobile} sizes="12rem" />
                </PhoneFrame>
              </div>
            ) : null}
          </div>
        </Container>
      ) : null}

      <Container className="py-16 sm:py-24">
        <div className="grid gap-14 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-16">
          <nav aria-label={t.toc} className="hidden lg:block">
            <div className="sticky top-24">
              <p className="font-mono text-xs tracking-[0.14em] text-muted uppercase">
                {t.toc}
              </p>
              <ol className="mt-4 grid gap-2.5 border-l border-line font-mono text-[0.8125rem]">
                {sections.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="-ml-px block border-l border-transparent pl-4 text-muted transition-colors hover:border-signal hover:text-text"
                    >
                      {section.title}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </nav>

          <article className="grid min-w-0 gap-20">
            {sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                aria-labelledby={`${section.id}-title`}
                className="reveal scroll-mt-24"
              >
                <h2
                  id={`${section.id}-title`}
                  className="font-mono text-xl font-medium tracking-tight text-text [font-stretch:82%] sm:text-2xl"
                >
                  {section.title}
                </h2>
                <div className="mt-6">{section.content}</div>
              </section>
            ))}
          </article>
        </div>
      </Container>
    </>
  );
}

/** The case study, in reading order. Optional parts only appear when they have content. */
function buildSections(project: Project): Section[] {
  const { caseStudy, media } = project;
  const sections: Section[] = [
    {
      id: "contexte",
      title: t.sections.context,
      content: (
        <div className="grid gap-px border border-line bg-line md:grid-cols-2 md:[&>*:last-child:nth-child(odd)]:col-span-2">
          <Panel title={t.sections.problem}>{caseStudy.problem}</Panel>
          <Panel title={t.sections.audience}>{caseStudy.audience}</Panel>
        </div>
      ),
    },
    {
      id: "architecture",
      title: t.sections.architecture,
      content: (
        <div className="grid gap-10">
          {caseStudy.diagrams.includes("architecture") ? <ArchitectureDiagram /> : null}
          <div className="max-w-[68ch] text-[1.0625rem] leading-relaxed text-muted">
            <DashList items={caseStudy.architecture} />
          </div>
        </div>
      ),
    },
  ];

  if (caseStudy.diagrams.includes("pipeline")) {
    sections.push({
      id: "livraison",
      title: t.sections.delivery,
      content: <PipelineDiagram />,
    });
  }

  if (caseStudy.excerpts.length > 0) {
    sections.push({
      id: "code",
      title: t.sections.code,
      content: (
        <div className="grid gap-12">
          {caseStudy.excerpts.map((excerpt) => (
            <figure key={excerpt.file + excerpt.from} className="m-0 min-w-0">
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <h3 className="font-mono text-base font-medium text-text">
                  {excerpt.title}
                </h3>
                <a
                  href={`${site.repositoryUrl}/blob/main/${excerpt.file}`}
                  className="font-mono text-xs text-muted underline decoration-line underline-offset-4 hover:text-signal hover:decoration-signal"
                >
                  {excerpt.file} <span aria-hidden="true">↗</span>
                </a>
              </div>
              {/* Focusable so keyboard users can scroll long lines. */}
              <pre
                tabIndex={0}
                className="mt-4 overflow-x-auto border border-line bg-surface p-5 font-mono text-[0.8125rem] leading-relaxed text-text"
              >
                <code>{readExcerpt(excerpt)}</code>
              </pre>
              <figcaption className="mt-3 max-w-[68ch] text-[0.9375rem] leading-relaxed text-muted">
                {excerpt.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      ),
    });
  }

  sections.push({
    id: "decisions",
    title: t.sections.decisions,
    content: (
      <div className="grid gap-px border border-line bg-line md:grid-cols-2 md:[&>*:last-child:nth-child(odd)]:col-span-2">
        {caseStudy.decisions.map((decision) => (
          <Panel key={decision.title} title={decision.title} strong>
            {decision.body}
          </Panel>
        ))}
      </div>
    ),
  });

  if (caseStudy.challenges.length > 0) {
    sections.push({
      id: "difficultes",
      title: t.sections.challenges,
      content: (
        <div className="grid max-w-[68ch] gap-6">
          {caseStudy.challenges.map((challenge) => (
            <dl
              key={challenge.problem}
              className="grid gap-3 border-l-2 border-line pl-5 text-[1.0625rem] leading-relaxed"
            >
              <dt className="sr-only">{t.sections.challengeProblem}</dt>
              <dd className="text-muted">{challenge.problem}</dd>
              <dt className="font-mono text-xs tracking-[0.14em] text-signal uppercase">
                {t.sections.challengeSolution}
              </dt>
              <dd className="text-text">{challenge.solution}</dd>
            </dl>
          ))}
        </div>
      ),
    });
  }

  sections.push({
    id: "etat",
    title: t.sections.status,
    content: (
      <div className="grid gap-px border border-line bg-line md:grid-cols-2 md:[&>*:last-child:nth-child(odd)]:col-span-2">
        <StatusList title={t.sections.implemented} items={caseStudy.implemented} done />
        <StatusList title={t.sections.nextSteps} items={caseStudy.nextSteps} />
      </div>
    ),
  });

  if (caseStudy.limitations.length > 0) {
    sections.push({
      id: "limites",
      title: t.sections.limitations,
      content: (
        <div className="max-w-[68ch] text-[1.0625rem] leading-relaxed text-muted">
          <DashList items={caseStudy.limitations} />
        </div>
      ),
    });
  }

  if (media && media.gallery.length > 0) {
    sections.push({
      id: "captures",
      title: t.sections.gallery,
      content: (
        <div className="grid gap-10">
          {media.gallery.map((shot) => (
            <figure key={shot.base} className="m-0">
              <BrowserFrame
                address={project.links.live?.replace("https://", "") ?? project.slug}
              >
                <Screenshot shot={shot} sizes="(min-width: 72rem) 52rem, 92vw" />
              </BrowserFrame>
              <figcaption className="mt-3 text-[0.9375rem] text-muted">
                {shot.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      ),
    });
  }

  return sections;
}

function Panel({
  title,
  children,
  strong = false,
}: {
  title: string;
  children: ReactNode;
  strong?: boolean;
}) {
  return (
    <div className="bg-ink p-6">
      <h3
        className={
          strong
            ? "font-mono text-base font-medium text-text"
            : "font-mono text-xs tracking-[0.14em] text-muted uppercase"
        }
      >
        {title}
      </h3>
      <p className="mt-3 text-[1.0625rem] leading-relaxed text-pretty text-muted">
        {children}
      </p>
    </div>
  );
}

function StatusList({
  title,
  items,
  done = false,
}: {
  title: string;
  items: readonly string[];
  done?: boolean;
}) {
  return (
    <div className="bg-ink p-6">
      <h3 className="font-mono text-xs tracking-[0.14em] text-muted uppercase">
        {title}
      </h3>
      <ul className="mt-4 grid gap-3 text-[0.9375rem] leading-relaxed">
        {items.map((item) => (
          <li key={item} className="relative pl-6 text-pretty">
            <span
              aria-hidden="true"
              className={`absolute top-[0.55em] left-0 size-2 ${done ? "bg-live" : "border border-muted"}`}
            />
            <span className={done ? "text-text" : "text-muted"}>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
