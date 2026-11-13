import { LegalView, legalMetadata } from "@/views/legal";

export const metadata = legalMetadata("fr");

export default function LegalPage() {
  return <LegalView locale="fr" />;
}
