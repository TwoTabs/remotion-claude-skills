import React from 'react';
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';

interface HighlightBoxProps {
  x: number;
  y: number;
  w: number;
  h: number;
}

export const HighlightBox: React.FC<HighlightBoxProps> = ({ x, y, w, h }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const scale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 200, mass: 0.5 },
    from: 1.08,
    to: 1,
  });

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
        borderRadius: 8,
        pointerEvents: 'none',
        border: '3px solid #3B82F6',
        background: 'rgba(59, 130, 246, 0.12)',
        boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.18), 0 0 24px rgba(59, 130, 246, 0.35)',
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: 'center',
      }}
    />
  );
};
