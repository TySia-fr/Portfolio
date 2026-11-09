import { useEffect, useState } from "react";
import {
  AbsoluteFill,
  Easing,
  cancelRender,
  continueRender,
  delayRender,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import {
  logoGeometry,
  pathVertices,
  pointAlong,
} from "../../src/components/brand/logo-geometry";
import tokens from "./tokens.generated.json";
import type { Timeline } from "./timeline";

export type LogoSignalProps = {
  timeline: Timeline;
  /** Colours default to the site's tokens (synced from src/app/globals.css). */
  colors: { background: string; stroke: string; signal: string; muted: string };
  /** Transparent background, for the alpha WebM. */
  transparent: boolean;
  /** Logo height as a fraction of the frame's shorter side. */
  markSize: number;
  /** Show the name next to the mark, or the mark alone. */
  wordmark: "name" | "none";
};

const { viewBox, strokeWidth, s, i, dot } = logoGeometry;
const sPoints = pathVertices(s);
const stemPoints = pathVertices(i);
const stemFoot = stemPoints[stemPoints.length - 1] ?? [18, 19];
const stemTop = stemPoints[0] ?? [18, 10];
const dotCentre = [dot.x + dot.size / 2, dot.y + dot.size / 2] as const;

/** Visible extent of the mark in viewBox units (strokes include their square caps). */
const inkBounds = (() => {
  const half = strokeWidth / 2;
  const xs = [...sPoints, ...stemPoints].map(([x]) => x);
  const ys = [...sPoints, ...stemPoints].map(([, y]) => y);
  return {
    minX: Math.min(...xs, dot.x + half) - half,
    maxX: Math.max(...xs.map((x) => x + half), dot.x + dot.size),
    minY: Math.min(...ys.map((y) => y - half), dot.y),
    maxY: Math.max(...ys) + half,
  };
})();

const [x1, y1, x2, y2] = tokens.easeOut as [number, number, number, number];
/** The site's one easing (--ease-out). */
const easeOut = Easing.bezier(x1, y1, x2, y2);
/** Slow in, slow out: for the one movement that should feel unhurried. */
const easeInOut = Easing.bezier(0.6, 0, 0.15, 1);

const FONT_FAMILY = "Martian Mono";
const LABEL = "siavash izadi";

/**
 * Width of the wordmark exactly as the browser lays it out (condensed width and
 * tight tracking included), measured on a detached copy of the same styles.
 */
function measureWordmark(text: string, style: Record<string, string | number>): number {
  const probe = document.createElement("span");
  Object.assign(probe.style, style, {
    position: "absolute",
    visibility: "hidden",
    fontSize: `${style.fontSize}px`,
  });
  probe.textContent = text;
  document.body.appendChild(probe);
  const width = probe.getBoundingClientRect().width;
  probe.remove();
  return width;
}

/** Loads the brand font; the frame is captured only after a re-render with it. */
function useBrandFont() {
  const [handle] = useState(() => delayRender("Loading Martian Mono"));
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const face = new FontFace(
      FONT_FAMILY,
      `url(${staticFile("MartianMono-latin.woff2")})`,
      {
        weight: "100 800",
        stretch: "75% 112.5%",
      },
    );
    face
      .load()
      .then((loaded) => {
        document.fonts.add(loaded);
        setReady(true);
      })
      .catch((error: unknown) => cancelRender(error));
  }, []);
  // Runs after the re-render that used the loaded font (and measured with it).
  useEffect(() => {
    if (ready) continueRender(handle);
  }, [ready, handle]);
  return ready;
}

export function LogoSignal({
  timeline,
  colors,
  transparent,
  markSize,
  wordmark,
}: LogoSignalProps) {
  useBrandFont();
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;

  // An even number of pixels per viewBox unit: the dot sits at x = 16.5, so only
  // even units put every edge of the logo on the pixel grid. The final frame is
  // then crisp, not anti-aliased.
  const step = viewBox * 2;
  const markPx = Math.max(
    step,
    Math.round((Math.min(width, height) * markSize) / step) * step,
  );
  const locked = t >= timeline.lock;

  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

  // Drawing progress, 0 → 1, at constant speed.
  const sProgress = interpolate(t, [timeline.appear, timeline.sEnd], [0, 1], clamp);
  const stemProgress = interpolate(
    t,
    [timeline.stemStart, timeline.stemEnd],
    [0, 1],
    clamp,
  );

  // Where the travelling signal is, and whether it is visible.
  let head: readonly [number, number] = sPoints[0] ?? [13, 8];
  let headOpacity = 0;
  if (t < timeline.sEnd) {
    head = pointAlong(sPoints, sProgress);
    headOpacity = interpolate(
      t,
      [timeline.appear, timeline.appear + 0.08],
      [0, 1],
      clamp,
    );
  } else if (t < timeline.stemStart) {
    // Routed from the end of the S to the foot of the i: it leaves, then arrives.
    const mid = (timeline.sEnd + timeline.stemStart) / 2;
    head = t < mid ? (sPoints[sPoints.length - 1] ?? head) : stemFoot;
    headOpacity =
      t < mid
        ? interpolate(t, [timeline.sEnd, mid], [1, 0], clamp)
        : interpolate(t, [mid, timeline.stemStart], [0, 1], clamp);
  } else if (t < timeline.stemEnd) {
    head = [stemFoot[0], stemFoot[1] + (stemTop[1] - stemFoot[1]) * stemProgress];
    headOpacity = 1;
  } else if (!locked) {
    const arrive = interpolate(t, [timeline.stemEnd, timeline.lock], [0, 1], {
      ...clamp,
      easing: easeOut,
    });
    head = [stemTop[0], stemTop[1] + (dotCentre[1] - stemTop[1]) * arrive];
    headOpacity = 1;
  }

  const slideIn = interpolate(t, [timeline.slide, timeline.slideEnd], [0, 1], {
    ...clamp,
    easing: easeInOut,
  });
  const lastLetterEnd =
    timeline.wordmark +
    (LABEL.length - 1) * timeline.letterStagger +
    timeline.letterDuration;
  // The name arrives loosely spaced and gathers towards the mark as it settles.
  const gather = interpolate(t, [timeline.wordmark, lastLetterEnd], [0, 1], {
    ...clamp,
    easing: easeOut,
  });
  /** Focus (0 = invisible and blurred, 1 = sharp) of the letter at `index`. */
  const letterFocus = (index: number) =>
    interpolate(
      t,
      [
        timeline.wordmark + index * timeline.letterStagger,
        timeline.wordmark + index * timeline.letterStagger + timeline.letterDuration,
      ],
      [0, 1],
      { ...clamp, easing: easeOut },
    );

  // Quieter than the header lockup on purpose: the mark carries the motion, the
  // name only signs it. Lighter weight, smaller size, more air around it.
  const fontPx = Math.round(markPx * 0.4);
  const gapPx = Math.round(markPx * 0.5);
  const label = LABEL;
  const textStyle = {
    fontFamily: `"${FONT_FAMILY}", monospace`,
    fontSize: fontPx,
    fontWeight: 400,
    fontStretch: "87.5%",
    letterSpacing: "0",
    lineHeight: 1,
    whiteSpace: "nowrap",
  } as const;
  const textWidth = wordmark === "none" ? 0 : measureWordmark(label, textStyle);
  // Centre what is visible, not the SVG box: the box has empty margins (4 units
  // left of the S, 4.5 right of the dot), which would push the lockup sideways.
  const inkLeft = (inkBounds.minX * markPx) / viewBox;
  const inkTop = (inkBounds.minY * markPx) / viewBox;
  const markInkWidth = ((inkBounds.maxX - inkBounds.minX) * markPx) / viewBox;
  const markInkHeight = ((inkBounds.maxY - inkBounds.minY) * markPx) / viewBox;
  const lockupInkWidth =
    wordmark === "none" ? markInkWidth : markPx - inkLeft + gapPx + textWidth;
  // Whole pixels, so the final frame stays on the pixel grid.
  const markLeft = Math.round((width - lockupInkWidth) / 2 - inkLeft);
  const markTop = Math.round((height - markInkHeight) / 2 - inkTop);
  // The mark is traced alone at the centre of the frame, then slides into its
  // place in the lockup as the wordmark arrives. Its own drawing never moves.
  const centredOffset = width / 2 - (markLeft + inkLeft + markInkWidth / 2);
  const slide = centredOffset * (1 - slideIn);

  return (
    <AbsoluteFill
      style={{ backgroundColor: transparent ? "transparent" : colors.background }}
    >
      <div
        style={{
          position: "absolute",
          left: markLeft,
          top: markTop,
          height: markPx,
          display: "flex",
          alignItems: "center",
          gap: gapPx,
          transform: `translateX(${slide}px)`,
        }}
      >
        {locked ? (
          // From the lock frame on, this is the logo's own markup, nothing animated.
          <svg
            width={markPx}
            height={markPx}
            viewBox={`0 0 ${viewBox} ${viewBox}`}
            fill="none"
          >
            <path
              d={s}
              stroke={colors.stroke}
              strokeWidth={strokeWidth}
              strokeLinecap="square"
              strokeLinejoin="miter"
            />
            <path
              d={i}
              stroke={colors.stroke}
              strokeWidth={strokeWidth}
              strokeLinecap="square"
            />
            <rect
              x={dot.x}
              y={dot.y}
              width={dot.size}
              height={dot.size}
              fill={colors.signal}
            />
          </svg>
        ) : (
          <svg
            width={markPx}
            height={markPx}
            viewBox={`0 0 ${viewBox} ${viewBox}`}
            fill="none"
          >
            <path
              d={s}
              pathLength={1}
              strokeDasharray="1 1"
              strokeDashoffset={1 - sProgress}
              stroke={colors.stroke}
              strokeWidth={strokeWidth}
              strokeLinecap="square"
              strokeLinejoin="miter"
              opacity={sProgress > 0 ? 1 : 0}
            />
            {/* Drawn from the foot up: a negative offset reveals the path from its end. */}
            <path
              d={i}
              pathLength={1}
              strokeDasharray="1 1"
              strokeDashoffset={stemProgress - 1}
              stroke={colors.stroke}
              strokeWidth={strokeWidth}
              strokeLinecap="square"
              opacity={stemProgress > 0 ? 1 : 0}
            />
            <rect
              x={head[0] - dot.size / 2}
              y={head[1] - dot.size / 2}
              width={dot.size}
              height={dot.size}
              fill={colors.signal}
              opacity={headOpacity}
            />
          </svg>
        )}

        {wordmark === "none" ? null : (
          <div
            style={{
              ...textStyle,
              color: colors.stroke,
              letterSpacing: `${0.32 * (1 - gather)}em`,
            }}
          >
            {[...label].map((character, index) => {
              const focus = letterFocus(index);
              return (
                <span
                  key={index}
                  style={{
                    opacity: focus,
                    filter: `blur(${(1 - focus) * fontPx * 0.14}px)`,
                  }}
                >
                  {character}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
}

export const defaultColors: LogoSignalProps["colors"] = {
  background: tokens.color.ink,
  stroke: tokens.color.text,
  signal: tokens.color.signal,
  muted: tokens.color.muted,
};
