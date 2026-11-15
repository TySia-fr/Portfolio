import { ProjectsView, projectsMetadata } from "@/views/projects";

export const metadata = projectsMetadata("fa");

export default function ProjectsPage() {
  return <ProjectsView locale="fa" />;
}
