import { LegalView, legalMetadata } from "@/views/legal";

export const metadata = legalMetadata("en");

export default function LegalPage() {
  return <LegalView locale="en" />;
}
