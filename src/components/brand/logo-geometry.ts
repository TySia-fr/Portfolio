/**
 * The "si" monogram's geometry: the single source of truth for every place the
 * logo is drawn (AnimatedLogo, the favicon in src/app/icon.svg, and
 * the Remotion videos in /motion). Animations move a copy of the signal square
 * along these paths; they never change the paths themselves.
 */
export const logoGeometry = {
  viewBox: 24,
  strokeWidth: 2,
  /** The S, traced like a circuit path, with a short hook at each end. */
  s: "M13 8V5H5v7h8v7H5v-3",
  /** The stem of the i. */
  i: "M18 10v9",
  /** The dot of the i: the site's "signal" square. Its centre sits on the stem's axis. */
  dot: { x: 16.5, y: 3.5, size: 3 },
} as const;

export type Point = readonly [x: number, y: number];

/**
 * Vertices of an orthogonal path written with M, H and V commands (absolute or
 * relative), which is all the monogram uses. Anything else throws, so a future
 * redesign with curves fails loudly instead of animating along the wrong route.
 */
export function pathVertices(d: string): Point[] {
  const tokens = d.match(/[a-zA-Z]|-?\d*\.?\d+/g) ?? [];
  const points: Point[] = [];
  let x = 0;
  let y = 0;
  let command = "";

  for (let index = 0; index < tokens.length; index++) {
    const token = tokens[index] as string;
    if (/[a-zA-Z]/.test(token)) {
      command = token;
      continue;
    }
    const value = Number(token);
    switch (command) {
      case "M":
        x = value;
        y = Number(tokens[++index]);
        command = "L";
        break;
      case "L":
        x = value;
        y = Number(tokens[++index]);
        break;
      case "H":
        x = value;
        break;
      case "h":
        x += value;
        break;
      case "V":
        y = value;
        break;
      case "v":
        y += value;
        break;
      default:
        throw new Error(`Unsupported path command "${command}" in logo geometry`);
    }
    points.push([x, y]);
  }
  return points;
}

/** Total length of a polyline, in viewBox units. */
export function polylineLength(points: readonly Point[]): number {
  let length = 0;
  for (let index = 1; index < points.length; index++) {
    const [ax, ay] = points[index - 1] as Point;
    const [bx, by] = points[index] as Point;
    length += Math.hypot(bx - ax, by - ay);
  }
  return length;
}

/** The point at a fraction (0–1) of a polyline's length. */
export function pointAlong(points: readonly Point[], fraction: number): Point {
  const total = polylineLength(points);
  let remaining = Math.min(Math.max(fraction, 0), 1) * total;
  for (let index = 1; index < points.length; index++) {
    const [ax, ay] = points[index - 1] as Point;
    const [bx, by] = points[index] as Point;
    const segment = Math.hypot(bx - ax, by - ay);
    if (remaining <= segment || index === points.length - 1) {
      const t = segment === 0 ? 0 : Math.min(remaining / segment, 1);
      return [ax + (bx - ax) * t, ay + (by - ay) * t];
    }
    remaining -= segment;
  }
  return points[0] ?? [0, 0];
}
