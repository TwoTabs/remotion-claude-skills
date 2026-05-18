import React from 'react';
import { AbsoluteFill, OffthreadVideo, staticFile, Sequence, Audio } from 'remotion';
import { HighlightBox } from './overlays/HighlightBox';
import { RecordingCaption } from './RecordingCaption';
import { STEPS_WITH_FRAMES } from '../data/flow';

// Phase IDs map directly to TTS audio filenames in public/audio/<flow>/.
// Steps 3, 6, 9 from the manifest are subsumed into phases 2, 5, 8 — those
// captured clicks happen during the parent phase and have no separate audio.
const AUDIO_FILE_BY_PHASE: Record<string, string> = {
  'phase-01-overview':       'step-01.mp3',
  'phase-02-status':         'step-02.mp3',
  'phase-04-status-result':  'step-04.mp3',
  'phase-05-urgency':        'step-05.mp3',
  'phase-07-combined':       'step-07.mp3',
  'phase-08-technician':     'step-08.mp3',
  'phase-10-final':          'step-10.mp3',
};

export const VideoComposition: React.FC = () => (
  <AbsoluteFill>
    {/*
      recordVideo starts at context creation, before page.goto + load waits +
      capture.start(). The .webm is ~3.9s longer than the manifest's
      videoDurationMs. Skip those leading load frames so our overlays
      (timed from capture.start = manifest t0) line up with the video.
      31160 ms (webm) − 27254 ms (manifest) ≈ 3906 ms ≈ 117 frames @ 30fps.
    */}
    <OffthreadVideo
      src={staticFile('recordings/airtable-interface-filters/recording.webm')}
      style={{ width: '100%', height: '100%' }}
      startFrom={117}
      muted
    />

    {STEPS_WITH_FRAMES.flatMap(step =>
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

    {STEPS_WITH_FRAMES.map(step => (
      <Sequence
        key={`audio-${step.id}`}
        from={step.captionStart}
        durationInFrames={step.captionDuration}
      >
        <Audio src={staticFile(`audio/airtable-interface-filters/${AUDIO_FILE_BY_PHASE[step.id]}`)} />
      </Sequence>
    ))}

    <RecordingCaption />
  </AbsoluteFill>
);
