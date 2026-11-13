import { ogAlt, ogImage } from "@/views/og-image";

/** Preview image shown when the page is shared. Generated at build time. */
export const alt = ogAlt("fr");
export { contentType, size } from "@/views/og-image";

export default function OpenGraphImage() {
  return ogImage("fr");
}
