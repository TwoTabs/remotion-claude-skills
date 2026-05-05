import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { CAPTIONS_WITH_FRAMES } from '../data/flow';

export const RecordingCaption: React.FC = () => {
  const frame = useCurrentFrame();

  const active = [...CAPTIONS_WITH_FRAMES]
    .reverse()
    .find(c => frame >= c.startFrame && frame < c.endFrame);
  if (!active) return null;

  const localFrame = frame - active.startFrame;
  const { text } = active;

  const typewriterDuration = Math.min(text.length * 0.75, active.durationFrames * 0.6);

  const charCount = Math.floor(
    interpolate(localFrame, [0, typewriterDuration], [0, text.length], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );

  const opacity = interpolate(localFrame, [0, 6], [0.85, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 96,
        display: 'flex',
        alignItems: 'center',
        padding: '0 48px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        fontSize: 24,
        lineHeight: 1.4,
        letterSpacing: '0.005em',
        color: 'white',
        background: 'rgba(0, 0, 0, 0.78)',
        opacity,
      }}
    >
      <span>{text.slice(0, charCount)}</span>
    </div>
  );
};
