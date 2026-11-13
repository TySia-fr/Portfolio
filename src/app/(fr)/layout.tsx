import "../globals.css";

import { RootDocument, rootMetadata } from "@/views/root-layout";

export { viewport } from "@/views/root-layout";
export const metadata = rootMetadata("fr");

export default function FrenchLayout({ children }: LayoutProps<"/">) {
  return <RootDocument locale="fr">{children}</RootDocument>;
}
