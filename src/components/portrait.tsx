import { getContent } from "@/content";
import type { Locale } from "@/i18n/config";

/**
 * Siavash's portrait, pre-cropped to a square and exported to WebP at the
 * widths listed in site.portrait. A plain <img> like the screenshots: no
 * runtime optimiser, intrinsic size set so the layout never shifts.
 */
export function Portrait({
  locale,
  sizes,
  priority = false,
  className = "",
}: {
  locale: Locale;
  /** Rendered width, e.g. "10rem". */
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  const p = getContent(locale).site.portrait;
  return (
    // eslint-disable-next-line @next/next/no-img-element -- pre-optimised static files
    <img
      src={`${p.base}-${Math.max(...p.widths)}.webp`}
      srcSet={p.widths.map((w) => `${p.base}-${w}.webp ${w}w`).join(", ")}
      sizes={sizes}
      width={p.size}
      height={p.size}
      alt={p.alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className={`block aspect-square object-cover ${className}`}
    />
  );
}
