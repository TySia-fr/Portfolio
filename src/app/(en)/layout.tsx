import "../globals.css";

import { RootDocument, rootMetadata } from "@/views/root-layout";

export { viewport } from "@/views/root-layout";
export const metadata = rootMetadata("en");

export default function EnglishLayout({ children }: LayoutProps<"/">) {
  return <RootDocument locale="en">{children}</RootDocument>;
}
