import { logoGeometry } from "@/components/brand/logo-geometry";

const { viewBox, strokeWidth, s, i, dot } = logoGeometry;

type Props = {
  className?: string;
  /**
   * Accessible name. Leave it out when visible text next to the logo already
   * names the link (as in the header), so screen readers do not read it twice.
   */
  label?: string;
};

/**
 * The "si" monogram, with the parts its animation needs: strokes drawable from
 * either end and a copy of the signal square that travels the paths. Static
 * wherever it is used (header, footer…); traced once per session inside
 * <LogoIntro />. A Server Component: no JavaScript, nothing re-renders, and a
 * fixed box, so it can never shift layout. When it does not animate, the
 * markup renders exactly like the static logo.
 */
export function AnimatedLogo({ className = "", label }: Props) {
  const a11y = label
    ? ({ role: "img", "aria-label": label } as const)
    : ({ "aria-hidden": true } as const);

  return (
    <svg
      viewBox={`0 0 ${viewBox} ${viewBox}`}
      fill="none"
      focusable="false"
      className={`animated-logo ${className}`}
      {...a11y}
    >
      <path
        className="animated-logo-s"
        pathLength={1}
        d={s}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      <path
        className="animated-logo-stem"
        pathLength={1}
        d={i}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="square"
      />
      <rect
        className="animated-logo-dot"
        x={dot.x}
        y={dot.y}
        width={dot.size}
        height={dot.size}
        fill="var(--color-signal)"
      />
      {/* The travelling signal: a copy of the dot, centred on 0,0 and moved by CSS. */}
      <rect
        className="animated-logo-signal"
        x={-dot.size / 2}
        y={-dot.size / 2}
        width={dot.size}
        height={dot.size}
        fill="var(--color-signal)"
      />
    </svg>
  );
}
