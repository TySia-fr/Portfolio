import { Composition } from "remotion";

import { LogoSignal, defaultColors, type LogoSignalProps } from "./LogoSignal";
import { FPS, defaultTimeline } from "./timeline";

const base: LogoSignalProps = {
  timeline: defaultTimeline,
  colors: defaultColors,
  transparent: false,
  markSize: 0.135,
  wordmark: "name",
};

/** Every composition renders the same component; only the frame and lockup change. */
const formats = [
  { id: "LogoReveal", width: 1920, height: 1080, props: base },
  { id: "LogoSquare", width: 1080, height: 1080, props: { ...base, markSize: 0.13 } },
  { id: "LogoVertical", width: 1080, height: 1920, props: { ...base, markSize: 0.13 } },
] as const satisfies readonly {
  id: string;
  width: number;
  height: number;
  props: LogoSignalProps;
}[];

export function Root() {
  return (
    <>
      {formats.map((format) => (
        <Composition
          key={format.id}
          id={format.id}
          component={LogoSignal}
          width={format.width}
          height={format.height}
          fps={FPS}
          durationInFrames={Math.round(format.props.timeline.total * FPS)}
          defaultProps={format.props}
        />
      ))}
    </>
  );
}
