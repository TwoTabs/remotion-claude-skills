import React from 'react';
import { AbsoluteFill, OffthreadVideo, staticFile, Sequence, Audio } from 'remotion';
import { HighlightBox } from './overlays/HighlightBox';
import { RecordingCaption } from './RecordingCaption';
import { STEPS_WITH_FRAMES } from '../data/flow';

const AUDIO_FILE_BY_PHASE: Record<string, string> = {
  'phase-01-overview':                'step-01.mp3',
  'phase-02-status':                  'step-02.mp3',
  'phase-03-urgency':                 'step-03.mp3',
  'phase-04-tech':                    'step-04.mp3',
  'phase-05-card-details':            'step-05.mp3',
  'phase-06-status-urgency-charts':   'step-06.mp3',
  'phase-07-issue-category':          'step-07.mp3',
  'phase-08-tech-chart':              'step-08.mp3',
  'phase-09-fullscreen':              'step-09.mp3',
};

export const VideoComposition: React.FC = () => (
  <AbsoluteFill>
    {/*
      interactive-record's Phase 2 starts a fresh browser context with
      recordVideo, then page.goto's. The .webm has ~2.7s of page-load before
      the user's clock (manifest t0) starts. Skip those frames.
      77.68s (webm) − 75.0s (manifest) ≈ 2.68s ≈ 80 frames @ 30fps.
    */}
    <OffthreadVideo
      src={staticFile('recordings/airtable-filters-detail-tour/recording.webm')}
      style={{ width: '100%', height: '100%' }}
      startFrom={80}
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
        <Audio src={staticFile(`audio/airtable-filters-detail-tour/${AUDIO_FILE_BY_PHASE[step.id]}`)} />
      </Sequence>
    ))}

    <RecordingCaption />
  </AbsoluteFill>
);
