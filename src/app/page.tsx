import Link from "next/link";

import { SpecSheet } from "@/components/home/spec-sheet";
import { Container } from "@/components/layout/container";
import { PipelineDiagram } from "@/components/pipeline/pipeline-diagram";
import { FeaturedProject } from "@/components/projects/featured-project";
import { ButtonLink } from "@/components/ui/button-link";
import { home } from "@/content/home";
import { pipeline } from "@/content/pipeline";
import { site } from "@/content/site";
import { getFeaturedProjects } from "@/lib/projects";

const sectionLabel =
  "font-mono text-xs font-medium tracking-[0.14em] text-muted uppercase";

export default function HomePage() {
  const featured = getFeaturedProjects();

  return (
    <>
      <div className="relative overflow-hidden">
        <div aria-hidden="true" className="bg-grid absolute inset-0 -top-16" />
        <Container className="relative py-16 sm:py-24 lg:py-28">
          <p className={`motion-enter ${sectionLabel} font-normal`}>
            <span className="text-text">{site.name}</span> · {home.eyebrow}
          </p>

          {/* The headline is the largest element on the page (LCP): it is never
              hidden or delayed by an animation. */}
          <h1 className="mt-6 max-w-[28ch] font-mono text-display font-medium text-balance [font-stretch:76%]">
            {home.title}
          </h1>

          <div className="mt-12 grid gap-12 border-t border-line pt-12 lg:mt-16 lg:grid-cols-[1fr_26rem] lg:gap-16">
            <div className="motion-enter motion-delay-1">
              <p className="max-w-[52ch] text-lg leading-relaxed text-muted">
                {home.lead}
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <ButtonLink href={home.primaryCta.href}>
                  {home.primaryCta.label}{" "}
                  <span className="nudge" aria-hidden="true">
                    →
                  </span>
                </ButtonLink>
                <ButtonLink href={home.secondaryCta.href} variant="secondary">
                  {home.secondaryCta.label}
                </ButtonLink>
              </div>

              <section aria-labelledby="focus-title" className="mt-14">
                <h2 id="focus-title" className={sectionLabel}>
                  {home.focus.title}
                </h2>
                <ul className="mt-5 grid gap-px border border-line bg-line sm:grid-cols-3">
                  {home.focus.items.map((item) => (
                    <li key={item.label} className="bg-ink p-4">
                      <p className="font-mono text-[0.8125rem] font-medium text-text">
                        {item.label}
                      </p>
                      <p className="mt-1.5 text-sm text-muted">{item.detail}</p>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <div className="motion-enter motion-delay-2">
              <SpecSheet />
            </div>
          </div>
        </Container>
      </div>

      <section aria-labelledby="pipeline-title" className="border-t border-line">
        <Container className="reveal py-16 sm:py-24">
          <p className={sectionLabel}>{home.pipeline.eyebrow}</p>
          <h2
            id="pipeline-title"
            className="mt-4 max-w-[24ch] font-mono text-2xl font-medium tracking-tight text-balance [font-stretch:80%] sm:text-4xl"
          >
            {pipeline.title}
          </h2>
          <p className="mt-5 max-w-[60ch] text-lg leading-relaxed text-muted">
            {pipeline.intro}
          </p>
          <div className="mt-12 sm:mt-16">
            <PipelineDiagram />
          </div>
        </Container>
      </section>

      {featured.length > 0 ? (
        <section aria-labelledby="selected-projects" className="border-t border-line">
          <Container className="reveal py-16 sm:py-24">
            <div className="flex items-baseline justify-between gap-6">
              <h2 id="selected-projects" className={sectionLabel}>
                {home.selectedProjects.title}
              </h2>
              <Link
                href="/projets"
                className="font-mono text-[0.8125rem] text-muted transition-colors hover:text-text"
              >
                {home.selectedProjects.all} <span className="nudge">→</span>
              </Link>
            </div>

            <ul className="mt-8 grid gap-6">
              {featured.map((project) => (
                <li key={project.slug}>
                  <FeaturedProject project={project} headingLevel={3} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}

      <section aria-labelledby="about-preview" className="border-t border-line">
        <Container className="reveal grid gap-6 py-16 sm:py-20 lg:grid-cols-[16rem_1fr] lg:gap-20">
          <h2 id="about-preview" className={sectionLabel}>
            {home.about.title}
          </h2>
          <div className="max-w-[62ch]">
            <p className="text-lg leading-relaxed text-pretty text-text">
              {home.about.text}
            </p>
            <Link
              href="/a-propos"
              className="mt-6 inline-block font-mono text-[0.8125rem] text-signal underline decoration-signal/40 underline-offset-4 hover:decoration-signal"
            >
              {home.about.link} <span className="nudge">→</span>
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
