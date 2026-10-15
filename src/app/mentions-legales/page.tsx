import type { Metadata } from "next";

import { PagePlaceholder } from "@/components/page-placeholder";

export const metadata: Metadata = {
  title: "Mentions légales",
  robots: { index: false },
};

export default function Page() {
  return (
    <PagePlaceholder
      title="Mentions légales"
      description="Éditeur du site, hébergement et traitement des données personnelles."
    />
  );
}
