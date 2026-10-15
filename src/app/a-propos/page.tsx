import type { Metadata } from "next";

import { PagePlaceholder } from "@/components/page-placeholder";

export const metadata: Metadata = {
  title: "À propos",
  robots: { index: false },
};

export default function Page() {
  return (
    <PagePlaceholder
      title="À propos"
      description="Mon parcours, ce que j’apprends en ce moment et le type de projets sur lesquels je veux travailler."
    />
  );
}
