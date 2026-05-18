import React from 'react';
import { AbsoluteFill, OffthreadVideo, staticFile, Sequence, Audio } from 'remotion';
import { HighlightBox } from './overlays/HighlightBox';
import { RecordingCaption } from './RecordingCaption';
import { STEPS_WITH_FRAMES } from '../data/flow';

export const VideoComposition: React.FC = () => (
  <AbsoluteFill>
    <OffthreadVideo
      src={staticFile('recordings/airtable-it-support-form/recording.webm')}
      style={{ width: '100%', height: '100%' }}
      muted
    />

    {STEPS_WITH_FRAMES.flatMap((step, si) =>
      step.highlightFrames.map((h, hi) => (
        <Sequence
          key={`hl-${step.id}-${hi}`}
          from={h.from}
          durationInFrames={h.durationFrames}
        >
          <HighlightBox x={h.x} y={h.y} w={h.w} h={h.h} />
        </Sequence>
      ))
    )}

    {STEPS_WITH_FRAMES.map((step, i) => (
      <Sequence
        key={`audio-${step.id}`}
        from={step.captionStart}
        durationInFrames={step.captionDuration}
      >
        <Audio src={staticFile(`audio/airtable-it-support-form/step-${String(i + 1).padStart(2, '0')}.mp3`)} />
      </Sequence>
    ))}

    <RecordingCaption />
  </AbsoluteFill>
);
