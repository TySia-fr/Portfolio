import type { Metadata } from "next";

import { PagePlaceholder } from "@/components/page-placeholder";

export const metadata: Metadata = {
  title: "Contact",
  robots: { index: false },
};

export default function Page() {
  return (
    <PagePlaceholder
      title="Contact"
      description="Un formulaire de contact sécurisé arrive bientôt. En attendant, vous pouvez me trouver sur GitHub."
    />
  );
}
