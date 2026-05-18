import React from 'react';
import { AbsoluteFill, OffthreadVideo, staticFile, Sequence, Audio } from 'remotion';
import { HighlightBox } from './overlays/HighlightBox';
import { RecordingCaption } from './RecordingCaption';
import { STEPS_WITH_FRAMES } from '../data/flow';

export const VideoComposition: React.FC = () => (
  <AbsoluteFill>
    <OffthreadVideo
      src={staticFile('recordings/airtable-main-feature-demo/recording.webm')}
      style={{ width: '100%', height: '100%' }}
      muted
    />

    {STEPS_WITH_FRAMES.filter(s => s.highlight).map(step => (
      <Sequence key={`hl-${step.id}`} from={step.overlayStart} durationInFrames={step.overlayDuration}>
        <HighlightBox {...step.highlight!} />
      </Sequence>
    ))}

    {STEPS_WITH_FRAMES.map((step, i) => (
      <Sequence key={`audio-${step.id}`} from={step.captionStart} durationInFrames={step.captionDuration}>
        <Audio src={staticFile(`audio/airtable-main-feature-demo/step-${String(i + 1).padStart(2, '0')}.mp3`)} />
      </Sequence>
    ))}

    <RecordingCaption />
  </AbsoluteFill>
);
