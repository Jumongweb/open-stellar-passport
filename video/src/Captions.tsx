import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { CAPTIONS } from "./captionData";

// Lower-third caption synced to the voiceover. Shows the segment whose
// [from, to] window contains the current time; fades at the edges.
export const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ms = (frame / fps) * 1000;

  if (ms >= 118400) return null; // end card takes over
  const active = CAPTIONS.find((c) => ms >= c.from && ms < c.to);
  if (!active) return null;

  const FADE = 180; // ms
  const opacity = interpolate(
    ms,
    [active.from, active.from + FADE, active.to - FADE, active.to],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 54,
        display: "flex",
        justifyContent: "center",
        padding: "0 80px",
      }}
    >
      <div
        style={{
          opacity,
          maxWidth: 920,
          background: "rgba(23,23,23,0.94)",
          color: "#fff",
          font: '600 25px/1.42 Inter, system-ui, sans-serif',
          letterSpacing: "-0.01em",
          padding: "14px 26px",
          borderRadius: 6,
          textAlign: "center",
          boxShadow: "0 16px 48px -16px rgba(0,0,0,0.55)",
        }}
      >
        {active.text}
      </div>
    </div>
  );
};
