import { CvView, cvMetadata } from "@/views/cv";

export const metadata = cvMetadata("en");

export default function CvPage() {
  return <CvView locale="en" />;
}
