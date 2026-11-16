import "../globals.css";

import { RootDocument, rootMetadata } from "@/views/root-layout";

export { viewport } from "@/views/root-layout";
export const metadata = rootMetadata("fa");

export default function PersianLayout({ children }: LayoutProps<"/">) {
  return <RootDocument locale="fa">{children}</RootDocument>;
}
