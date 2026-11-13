import { OpportunitiesView, opportunitiesMetadata } from "@/views/opportunities";

export const metadata = opportunitiesMetadata("fr");

export default function OpportunitiesPage() {
  return <OpportunitiesView locale="fr" />;
}
