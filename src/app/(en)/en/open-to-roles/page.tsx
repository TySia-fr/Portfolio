import { OpportunitiesView, opportunitiesMetadata } from "@/views/opportunities";

export const metadata = opportunitiesMetadata("en");

export default function OpportunitiesPage() {
  return <OpportunitiesView locale="en" />;
}
