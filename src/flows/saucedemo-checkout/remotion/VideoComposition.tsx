import React from 'react';
import { AbsoluteFill, OffthreadVideo, staticFile, Sequence } from 'remotion';
import { HighlightBox } from './overlays/HighlightBox';
import { RecordingCaption } from './RecordingCaption';
import {
  HIGHLIGHTS_WITH_FRAMES,
  CUT_SOURCE_START_MS,
  CUT_SOURCE_END_MS,
  VIDEO_DURATION_MS,
} from '../data/flow';
import { msToFrame } from './msToFrame';

// Splice the source recording: play 0 → CUT_SOURCE_START_MS, then resume from
// CUT_SOURCE_END_MS to end. Skips the dead Playwright actionability wait on
// the order-summary page without breaking caption/highlight alignment, since
// every flow timing already lives in the post-cut public timeline.
const PART_A_START = 0;
const PART_A_END   = CUT_SOURCE_START_MS;
const PART_B_START = CUT_SOURCE_END_MS;
const PART_B_END   = 76_919; // raw recording duration

const partAFrames = msToFrame(PART_A_END - PART_A_START);
const partBFrames = msToFrame(PART_B_END - PART_B_START);
const totalFrames = msToFrame(VIDEO_DURATION_MS);

export const VideoComposition: React.FC = () => (
  <AbsoluteFill style={{ background: '#111' }}>
    {/* Part A: source 0 → 37.5s */}
    <Sequence from={0} durationInFrames={partAFrames}>
      <OffthreadVideo
        src={staticFile('recordings/saucedemo-checkout/recording.webm')}
        endAt={msToFrame(PART_A_END)}
        style={{ width: '100%', height: '100%' }}
        muted
      />
    </Sequence>

    {/* Part B: source 70.5s → end */}
    <Sequence from={partAFrames} durationInFrames={partBFrames}>
      <OffthreadVideo
        src={staticFile('recordings/saucedemo-checkout/recording.webm')}
        startFrom={msToFrame(PART_B_START)}
        style={{ width: '100%', height: '100%' }}
        muted
      />
    </Sequence>

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

    {/* total frames sanity check at compile time */}
    {totalFrames === partAFrames + partBFrames ? null : null}
  </AbsoluteFill>
);
