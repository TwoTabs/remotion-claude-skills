import React from 'react';
import { AbsoluteFill, OffthreadVideo, staticFile, Sequence, Audio } from 'remotion';
import { HighlightBox } from './overlays/HighlightBox';
import { RecordingCaption } from './RecordingCaption';
import { HIGHLIGHTS_WITH_FRAMES, AUDIO_WITH_FRAMES } from '../data/flow';

export const SprintTodosComposition: React.FC = () => (
  <AbsoluteFill style={{ background: '#111' }}>
    <OffthreadVideo
      src={staticFile('recordings/todomvc-sprint-todos/recording.webm')}
      style={{ width: '100%', height: '100%' }}
      muted
    />

    {HIGHLIGHTS_WITH_FRAMES.map(hl => (
      <Sequence key={hl.id} from={hl.startFrame} durationInFrames={hl.durationFrames}>
        <HighlightBox x={hl.rect.x} y={hl.rect.y} w={hl.rect.w} h={hl.rect.h} />
      </Sequence>
    ))}

    {AUDIO_WITH_FRAMES.map(a => (
      <Sequence key={a.id} from={a.startFrame} durationInFrames={a.durationFrames}>
        <Audio src={staticFile(`audio/todomvc-sprint-todos/${a.file}`)} />
      </Sequence>
    ))}

    <RecordingCaption />
  </AbsoluteFill>
);
