import type { Metadata } from "next";

import { PagePlaceholder } from "@/components/page-placeholder";

export const metadata: Metadata = {
  title: "Projets",
  robots: { index: false },
};

export default function Page() {
  return (
    <PagePlaceholder
      title="Projets"
      description="Les études de cas détaillées de chaque projet : problème, architecture, choix techniques et résultats vérifiables."
    />
  );
}
