import { AboutView, aboutMetadata } from "@/views/about";

export const metadata = aboutMetadata("fa");

export default function AboutPage() {
  return <AboutView locale="fa" />;
}
