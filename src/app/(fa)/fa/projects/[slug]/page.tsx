import type { Metadata } from "next";

import { ProjectView, projectMetadata, projectStaticParams } from "@/views/project";

export function generateStaticParams() {
  return projectStaticParams("fa");
}

export async function generateMetadata({
  params,
}: PageProps<"/fa/projects/[slug]">): Promise<Metadata> {
  return projectMetadata("fa", (await params).slug);
}

export default async function ProjectPage({ params }: PageProps<"/fa/projects/[slug]">) {
  return <ProjectView locale="fa" slug={(await params).slug} />;
}
