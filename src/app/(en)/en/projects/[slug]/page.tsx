import type { Metadata } from "next";

import { ProjectView, projectMetadata, projectStaticParams } from "@/views/project";

export function generateStaticParams() {
  return projectStaticParams("en");
}

export async function generateMetadata({
  params,
}: PageProps<"/en/projects/[slug]">): Promise<Metadata> {
  return projectMetadata("en", (await params).slug);
}

export default async function ProjectPage({ params }: PageProps<"/en/projects/[slug]">) {
  return <ProjectView locale="en" slug={(await params).slug} />;
}
