import { jsonLd } from "@/lib/structured-data";

/**
 * Structured data for search engines. type="application/ld+json" is data, not
 * code: browsers never execute it.
 */
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLd(data) }}
    />
  );
}
