import { CvView, cvMetadata } from "@/views/cv";

export const metadata = cvMetadata("fa");

export default function CvPage() {
  return <CvView locale="fa" />;
}
