import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { FeaturedProject } from "@/components/projects/featured-project";
import { ProjectCard } from "@/components/projects/project-card";
import { projectsPage } from "@/content/projects-page";
import { getAllProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: projectsPage.title,
  description: projectsPage.description,
  alternates: { canonical: "/projets" },
};

export default function ProjectsPage() {
  const projects = getAllProjects();
  // Featured projects get the full-width treatment; the others share a grid.
  const featured = projects.filter((project) => project.featured);
  const others = projects.filter((project) => !project.featured);

  return (
    <Container className="py-16 sm:py-24">
      <h1 className="font-mono text-3xl font-medium tracking-tight [font-stretch:80%] sm:text-5xl">
        {projectsPage.title}
      </h1>
      <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-muted">
        {projectsPage.intro}
      </p>

      {projects.length === 0 ? (
        <p className="mt-14 border border-dashed border-line p-8 text-muted">
          {projectsPage.empty}
        </p>
      ) : (
        <>
          <ul className="mt-14 grid gap-6">
            {featured.map((project, index) => (
              <li
                key={project.slug}
                // The first card holds the page's largest image (LCP): never hidden by an animation.
                className={index === 0 ? undefined : "reveal"}
              >
                <FeaturedProject project={project} priority={index === 0} />
              </li>
            ))}
          </ul>
          {others.length > 0 ? (
            <ul className="mt-6 grid gap-6 md:grid-cols-2">
              {others.map((project) => (
                <li key={project.slug} className="reveal flex">
                  <ProjectCard project={project} />
                </li>
              ))}
            </ul>
          ) : null}
        </>
      )}
    </Container>
  );
}
