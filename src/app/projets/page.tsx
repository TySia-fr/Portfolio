import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
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
        <ul className="mt-14 grid gap-5 md:grid-cols-2">
          {projects.map((project) => (
            <li key={project.slug} className="flex">
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}
