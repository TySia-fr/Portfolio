import { ProjectsView, projectsMetadata } from "@/views/projects";

export const metadata = projectsMetadata("fr");

export default function ProjectsPage() {
  return <ProjectsView locale="fr" />;
}
