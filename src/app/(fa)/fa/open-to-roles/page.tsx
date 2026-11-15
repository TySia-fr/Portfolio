import { OpportunitiesView, opportunitiesMetadata } from "@/views/opportunities";

export const metadata = opportunitiesMetadata("fa");

export default function OpportunitiesPage() {
  return <OpportunitiesView locale="fa" />;
}
