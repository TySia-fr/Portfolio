import { LegalView, legalMetadata } from "@/views/legal";

export const metadata = legalMetadata("fa");

export default function LegalPage() {
  return <LegalView locale="fa" />;
}
