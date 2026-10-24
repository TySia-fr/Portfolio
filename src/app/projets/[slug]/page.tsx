import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Container } from "@/components/layout/container";
import { DashList, Fact, ProseSection, TextLink } from "@/components/prose";
import { StatusBadge } from "@/components/projects/status-badge";
import { TechList } from "@/components/projects/tech-list";
import { projectsPage } from "@/content/projects-page";
import { getAllProjects, getProjectBySlug } from "@/lib/projects";

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

  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/projets/${project.slug}` },
    openGraph: { title: project.title, description: project.summary },
  };
}

export default async function ProjectPage({ params }: PageProps<"/projets/[slug]">) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  // Unknown slugs render the French 404 page (not-found.tsx). With Cache
  // Components the status stays 200 but Next.js adds `noindex` (see README).
  if (!project) notFound();

  const { caseStudy } = project;

  return (
    <Container className="py-12 sm:py-20">
      <Link
        href="/projets"
        className="font-mono text-[0.8125rem] text-muted transition-colors hover:text-text"
      >
        ← {t.back}
      </Link>

      <header className="mt-10 border-b border-line pb-12">
        <StatusBadge status={project.status} />
        <h1 className="mt-4 font-mono text-display font-medium [font-stretch:76%]">
          {project.title}
        </h1>
        <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-muted">
          {project.summary}
        </p>

        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 font-mono text-[0.8125rem]">
          {project.links.live ? (
            <TextLink href={project.links.live} external>
              {t.links.live}
            </TextLink>
          ) : null}
          {project.links.repository ? (
            <TextLink href={project.links.repository} external>
              {t.links.repository}
            </TextLink>
          ) : null}
        </div>
      </header>

      <div className="mt-12 grid gap-14 lg:grid-cols-[16rem_1fr] lg:gap-20">
        <aside>
          <dl className="grid gap-6 font-mono text-[0.8125rem] lg:sticky lg:top-24">
            <Fact label={t.facts.year}>{project.year}</Fact>
            <Fact label={t.facts.role}>
              <span className="font-sans text-sm leading-relaxed">{caseStudy.role}</span>
            </Fact>
            <Fact label={t.facts.stack}>
              <TechList items={project.stack} label={t.facts.stack} />
            </Fact>
          </dl>
        </aside>

        <article className="grid max-w-[68ch] gap-14">
          <ProseSection title={t.sections.problem}>
            <p>{caseStudy.problem}</p>
          </ProseSection>

          <ProseSection title={t.sections.audience}>
            <p>{caseStudy.audience}</p>
          </ProseSection>

          <ProseSection title={t.sections.architecture}>
            <DashList items={caseStudy.architecture} />
          </ProseSection>

          <ProseSection title={t.sections.decisions}>
            <div className="grid gap-8">
              {caseStudy.decisions.map((decision) => (
                <div key={decision.title}>
                  <h3 className="font-mono text-base font-medium text-text">
                    {decision.title}
                  </h3>
                  <p className="mt-2">{decision.body}</p>
                </div>
              ))}
            </div>
          </ProseSection>

          {caseStudy.challenges.length > 0 ? (
            <ProseSection title={t.sections.challenges}>
              <div className="grid gap-5">
                {caseStudy.challenges.map((challenge) => (
                  <dl
                    key={challenge.problem}
                    className="grid gap-3 border-l-2 border-line pl-5"
                  >
                    <dt className="sr-only">{t.sections.challengeProblem}</dt>
                    <dd>{challenge.problem}</dd>
                    <dt className="font-mono text-xs tracking-[0.14em] text-muted uppercase">
                      {t.sections.challengeSolution}
                    </dt>
                    <dd className="text-text">{challenge.solution}</dd>
                  </dl>
                ))}
              </div>
            </ProseSection>
          ) : null}

          {caseStudy.nextSteps.length > 0 ? (
            <ProseSection title={t.sections.nextSteps}>
              <DashList items={caseStudy.nextSteps} />
            </ProseSection>
          ) : null}
        </article>
      </div>
    </Container>
  );
}
