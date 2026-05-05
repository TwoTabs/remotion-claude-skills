import React from 'react';
import { AbsoluteFill, OffthreadVideo, staticFile, Sequence } from 'remotion';
import { HighlightBox } from './overlays/HighlightBox';
import { RecordingCaption } from './RecordingCaption';
import { HIGHLIGHTS_WITH_FRAMES } from '../data/flow';

export const VideoComposition: React.FC = () => (
  <AbsoluteFill style={{ background: '#111' }}>
    <OffthreadVideo
      src={staticFile('recordings/automationexercise-product-detail/recording.webm')}
      style={{ width: '100%', height: '100%' }}
      muted
    />

    {HIGHLIGHTS_WITH_FRAMES.map(hl => (
      <Sequence
        key={hl.id}
        from={hl.startFrame}
        durationInFrames={Math.max(1, hl.durationFrames)}
      >
        <HighlightBox x={hl.rect.x} y={hl.rect.y} w={hl.rect.w} h={hl.rect.h} />
      </Sequence>
    ))}

    <RecordingCaption />
  </AbsoluteFill>
);
