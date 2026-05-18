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

export const VIDEO_DURATION_MS = 36200;

// Coordinates are 1600×900 viewport-relative, matching manifest.json.
// Highlights end before any page-scroll inside a phase so the box doesn't
// linger on a stale screen position while content scrolls underneath.
export const TIMED_STEPS: TimedStep[] = [
  {
    id: 'phase-01-overview',
    caption: 'A simple Airtable form for filing IT support tickets.',
    startMs: 0,
    audioDurationMs: 3087,
    highlights: [{ x: 248, y: 64, w: 345, h: 46, startMs: 200, durationMs: 3100 }],
  },
  {
    id: 'phase-02-name',
    caption: 'Start with your name.',
    startMs: 3530,
    audioDurationMs: 1055,
    highlights: [{ x: 248, y: 220, w: 546, h: 32, startMs: 0, durationMs: 2700 }],
  },
  {
    id: 'phase-03-email',
    caption: 'Then your email so IT can follow up.',
    startMs: 6400,
    audioDurationMs: 2102,
    highlights: [{ x: 806, y: 220, w: 546, h: 32, startMs: 0, durationMs: 2650 }],
  },
  {
    id: 'phase-04-department',
    caption: 'Pick the department you work in.',
    startMs: 9250,
    audioDurationMs: 1547,
    // Phase ends at 13460ms but page starts scrolling at 12480ms — cap highlight at 3200ms.
    highlights: [{ x: 248, y: 290, w: 1104, h: 32, startMs: 0, durationMs: 3200 }],
  },
  {
    id: 'phase-05-device',
    caption: "Tell IT what kind of device you're on.",
    startMs: 13460,
    audioDurationMs: 2153,
    highlights: [{ x: 248, y: 111, w: 546, h: 32, startMs: 0, durationMs: 3100 }],
  },
  {
    id: 'phase-06-os',
    caption: 'And which operating system it runs.',
    startMs: 16700,
    audioDurationMs: 1960,
    // Scroll begins at 19870ms (3170ms into phase) — cap before that.
    highlights: [{ x: 806, y: 111, w: 546, h: 32, startMs: 0, durationMs: 3100 }],
  },
  {
    id: 'phase-07-category',
    caption: 'Categorise the problem so it routes to the right team.',
    startMs: 20840,
    audioDurationMs: 2761,
    highlights: [{ x: 248, y: 198, w: 546, h: 32, startMs: 0, durationMs: 3150 }],
  },
  {
    id: 'phase-08-urgency',
    caption: 'Set how urgent it is — be honest with this one.',
    startMs: 24090,
    audioDurationMs: 2773,
    highlights: [{ x: 806, y: 198, w: 546, h: 32, startMs: 0, durationMs: 3150 }],
  },
  {
    id: 'phase-09-description',
    caption: "Describe what's going wrong, with steps you've tried.",
    startMs: 27320,
    audioDurationMs: 2811,
    // Scroll to Submit begins at 30660ms (3340ms into phase) — cap before that.
    highlights: [{ x: 248, y: 267, w: 1104, h: 72, startMs: 0, durationMs: 3300 }],
  },
  {
    id: 'phase-10-submit',
    caption: 'Once everything looks right, click Submit and IT picks it up.',
    startMs: 31720,
    audioDurationMs: 3632,
    highlights: [{ x: 1284, y: 708, w: 67, h: 32, startMs: 200, durationMs: 4200 }],
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
