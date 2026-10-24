import type { Screenshot as Shot } from "@/content/projects/schema";

type Props = {
  shot: Shot;
  /** Layout width hint for the browser, e.g. "(min-width: 64rem) 40rem, 100vw". */
  sizes: string;
  /** Above the fold: load immediately instead of lazily. */
  priority?: boolean;
  className?: string;
};

/**
 * A real screenshot, pre-optimised to WebP at build time by
 * scripts/capture-screenshots.mjs. A plain <img> with srcset: the Next.js image
 * optimiser is not used, so the server never resizes images on request (no CPU
 * spikes, no extra attack surface). width/height reserve the space: no layout shift.
 */
export function Screenshot({ shot, sizes, priority = false, className = "" }: Props) {
  const largest = Math.max(...shot.widths);
  return (
    // eslint-disable-next-line @next/next/no-img-element -- pre-optimised static files, see above
    <img
      src={`${shot.base}-${largest}.webp`}
      srcSet={shot.widths.map((w) => `${shot.base}-${w}.webp ${w}w`).join(", ")}
      sizes={sizes}
      width={shot.width}
      height={shot.height}
      alt={shot.alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      className={`block h-auto w-full ${className}`}
    />
  );
}

/**
 * A minimal window frame around a desktop screenshot: one bar with the address.
 * Purely decorative; the image inside is the real page.
 */
export function BrowserFrame({
  address,
  children,
}: {
  address: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-[6px] border border-line bg-surface shadow-[0_24px_60px_-30px_rgb(0_0_0/0.8)]">
      <div
        aria-hidden="true"
        className="flex items-center gap-3 border-b border-line px-3.5 py-2.5"
      >
        <span className="flex gap-1.5">
          <span className="size-2 rounded-full bg-line" />
          <span className="size-2 rounded-full bg-line" />
          <span className="size-2 rounded-full bg-line" />
        </span>
        <span className="truncate font-mono text-[0.6875rem] text-muted">{address}</span>
      </div>
      {children}
    </div>
  );
}

/** A phone-shaped frame around a mobile screenshot. Decorative. */
export function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-[18px] border-4 border-[#24292d] bg-ink shadow-[0_24px_60px_-20px_rgb(0_0_0/0.9)]">
      {children}
    </div>
  );
}
