/**
 * The "si" monogram: an orthogonal S traced like a circuit path, and an i whose
 * dot is the site's signal square. Same geometry as src/app/icon.svg.
 *
 * On first page load the strokes draw themselves once (.logo-mark in
 * globals.css). The header lives in the root layout and is not remounted on
 * navigation, so the animation never replays while browsing.
 */
export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={`logo-mark ${className}`}
    >
      <path
        className="logo-mark-stroke"
        pathLength={1}
        d="M13 8V5H5v7h8v7H5v-3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      <path
        className="logo-mark-stroke logo-mark-stroke-2"
        pathLength={1}
        d="M18 10v9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
      />
      <rect
        className="logo-mark-dot"
        x="16.5"
        y="3.5"
        width="3"
        height="3"
        fill="var(--color-signal)"
      />
    </svg>
  );
}
