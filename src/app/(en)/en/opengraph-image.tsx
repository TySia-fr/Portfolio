import { ogAlt, ogImage } from "@/views/og-image";

/** Preview image shown when the page is shared. Generated at build time. */
export const alt = ogAlt("en");
export { contentType, size } from "@/views/og-image";

export default function OpenGraphImage() {
  return ogImage("en");
}
