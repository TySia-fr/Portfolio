import type { Metadata } from "next";

import { ProjectView, projectMetadata, projectStaticParams } from "@/views/project";

export function generateStaticParams() {
  return projectStaticParams("fr");
}

export async function generateMetadata({
  params,
}: PageProps<"/projets/[slug]">): Promise<Metadata> {
  return projectMetadata("fr", (await params).slug);
}

export default async function ProjectPage({ params }: PageProps<"/projets/[slug]">) {
  return <ProjectView locale="fr" slug={(await params).slug} />;
}
