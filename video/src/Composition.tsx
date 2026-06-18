import {
  AbsoluteFill,
  Audio,
  interpolate,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { PLAYBACK_RATE } from "./vo";
import { Captions } from "./Captions";

const Shield: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <path
      d="M16 4 L25 7.5 V14 C25 19.5 21.4 23.3 16 25 C10.6 23.3 7 19.5 7 14 V7.5 Z"
      stroke="#fff"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <path
      d="M16 10C16.4 13.4 18.1 15.1 21.5 15.5C18.1 15.9 16.4 17.6 16 21C15.6 17.6 13.9 15.9 10.5 15.5C13.9 15.1 15.6 13.4 16 10Z"
      fill="#fdda24"
    />
  </svg>
);

const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        opacity,
        backgroundColor: "#0f0f0f",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <div
        style={{
          width: 76,
          height: 76,
          borderRadius: 16,
          background: "#171717",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,.08)",
        }}
      >
        <Shield size={46} />
      </div>
      <div style={{ color: "#fff", fontSize: 56, fontWeight: 800, letterSpacing: "-0.03em" }}>Agent Passport</div>
      <div style={{ color: "#bdbdbd", fontSize: 22 }}>ZK-gated agent payments on Stellar · open source</div>
      <div style={{ color: "#fdda24", fontSize: 17, fontFamily: "Inconsolata, monospace", letterSpacing: "0.02em" }}>
        github.com/leocagli/open-stellar-passport
      </div>
    </AbsoluteFill>
  );
};

export const Narrated: React.FC = () => {
  const { fps, durationInFrames } = useVideoConfig();
  const endFrom = Math.round(118.4 * fps);
  return (
    <AbsoluteFill style={{ backgroundColor: "#fff" }}>
      <OffthreadVideo src={staticFile("screencast.mp4")} playbackRate={PLAYBACK_RATE} muted />
      <Captions />
      <Sequence from={endFrom} durationInFrames={durationInFrames - endFrom} layout="none">
        <EndCard />
      </Sequence>
      <Audio src={staticFile("narration.mp3")} />
    </AbsoluteFill>
  );
};
