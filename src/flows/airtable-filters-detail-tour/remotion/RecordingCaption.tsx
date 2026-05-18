import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { STEPS_WITH_FRAMES } from '../data/flow';

export const RecordingCaption: React.FC = () => {
  const frame = useCurrentFrame();

  const step = [...STEPS_WITH_FRAMES].reverse().find(
    s => frame >= s.captionStart && s.audioDuration <= s.captionDuration
  );
  if (!step) return null;

  const localFrame = frame - step.captionStart;
  const { caption } = step;
  const typewriterDuration = Math.min(caption.length * 0.75, step.captionDuration * 0.6);

  const charCount = Math.floor(
    interpolate(localFrame, [0, typewriterDuration], [0, caption.length], {
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
        height: 80,
        display: 'flex',
        alignItems: 'center',
        padding: '0 40px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        fontSize: 22,
        lineHeight: 1.4,
        letterSpacing: '0.005em',
        color: 'white',
        background: 'rgba(0, 0, 0, 0.78)',
        opacity,
      }}
    >
      <span>{caption.slice(0, charCount)}</span>
    </div>
  );
};
