import { CvView, cvMetadata } from "@/views/cv";

export const metadata = cvMetadata("fr");

export default function CvPage() {
  return <CvView locale="fr" />;
}
