import { msToFrame } from '../remotion/msToFrame';

export interface PhaseHighlight {
  x: number;
  y: number;
  w: number;
  h: number;
  startMs: number;     // relative to the phase start
  durationMs: number;
}

export interface TimedStep {
  id: string;
  caption: string;
  startMs: number;
  audioDurationMs: number;
  highlights: PhaseHighlight[];
}

export const VIDEO_DURATION_MS = 27254;

// Coordinates are 1600×900 viewport-relative, matching manifest.json.
// Phases map to Playwright manifest steps as follows:
//   phase-01 → step 1 (overview)
//   phase-02 → steps 2+3 (open Status, pick Open)
//   phase-04 → step 4 (status filter applied)
//   phase-05 → steps 5+6 (open Urgency, pick High) — step 5 had no captured box
//   phase-07 → step 7 (combined filter)
//   phase-08 → steps 8+9 (open Technician, pick Wyn) — step 8 had no captured box
//   phase-10 → step 10 (final state)
export const TIMED_STEPS: TimedStep[] = [
  {
    id: 'phase-01-overview',
    caption: 'An Airtable IT support dashboard with three filters.',
    startMs: 0,
    audioDurationMs: 3098,
    highlights: [{ x: 276, y: 231, w: 79, h: 28, startMs: 200, durationMs: 3500 }],
  },
  {
    id: 'phase-02-status',
    caption: "Click the Status filter and pick Open to show only unresolved tickets.",
    startMs: 3803,
    audioDurationMs: 3755,
    highlights: [
      // Status combobox until just before the option click
      { x: 276, y: 231, w: 79, h: 28, startMs: 0,    durationMs: 1200 },
      // "Open" option in the dropdown
      { x: 288, y: 311, w: 208, h: 32, startMs: 1272, durationMs: 2700 },
    ],
  },
  {
    id: 'phase-04-status-result',
    caption: 'The charts now reflect only Open requests.',
    startMs: 8074,
    audioDurationMs: 2435,
    highlights: [{ x: 276, y: 231, w: 79, h: 28, startMs: 0, durationMs: 3000 }],
  },
  {
    id: 'phase-05-urgency',
    caption: 'Open Urgency Level and pick High to focus on the urgent ones.',
    startMs: 11275,
    audioDurationMs: 3528,
    // No combobox highlight here — the click animation is visible in the video.
    // The "High" option appears at startMs 1140 (12415 - 11275) within the popover.
    highlights: [{ x: 445, y: 375, w: 208, h: 32, startMs: 1140, durationMs: 2700 }],
  },
  {
    id: 'phase-07-combined',
    caption: 'Both filters are active. Open AND High urgency.',
    startMs: 15408,
    audioDurationMs: 2706,
    highlights: [{ x: 367, y: 231, w: 126, h: 28, startMs: 0, durationMs: 3000 }],
  },
  {
    id: 'phase-08-technician',
    caption: 'Open Assigned Technician and pick one to see their workload.',
    startMs: 18609,
    audioDurationMs: 2820,
    highlights: [{ x: 646, y: 311, w: 208, h: 32, startMs: 1141, durationMs: 2700 }],
  },
  {
    id: 'phase-10-final',
    caption: 'Three filters working together pinpoint exactly what each technician is handling.',
    startMs: 22753,
    audioDurationMs: 4329,
    highlights: [
      { x: 276, y: 231, w: 79,  h: 28, startMs: 200, durationMs: 4000 },
      { x: 367, y: 231, w: 126, h: 28, startMs: 200, durationMs: 4000 },
      { x: 505, y: 231, w: 164, h: 28, startMs: 200, durationMs: 4000 },
    ],
  },
];

export const STEPS_WITH_FRAMES = TIMED_STEPS.map((s, i, arr) => {
  const next = arr[i + 1];
  const phaseDurationMs = next ? next.startMs - s.startMs : VIDEO_DURATION_MS - s.startMs;
  return {
    ...s,
    captionStart:    msToFrame(s.startMs),
    captionDuration: msToFrame(phaseDurationMs),
    audioDuration:   msToFrame(s.audioDurationMs),
    highlightFrames: s.highlights.map(h => ({
      ...h,
      from:           msToFrame(s.startMs + h.startMs),
      durationFrames: msToFrame(h.durationMs),
    })),
  };
});

export const TOTAL_DURATION_FRAMES = msToFrame(VIDEO_DURATION_MS);
