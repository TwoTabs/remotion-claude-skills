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

export const VIDEO_DURATION_MS = 75000;

// Coordinates are 1600×900 viewport-relative, sourced from manifest.json.
// Phase boundaries align with key click events captured by the recorder.
export const TIMED_STEPS: TimedStep[] = [
  {
    id: 'phase-01-overview',
    caption: 'All the filters and detail views in this dashboard.',
    startMs: 0,
    audioDurationMs: 2669,
    highlights: [{ x: 276, y: 183, w: 393, h: 28, startMs: 200, durationMs: 2600 }],
  },
  {
    id: 'phase-02-status',
    caption: 'Open Status, pick an option, then Reset.',
    startMs: 2930,
    audioDurationMs: 2913,
    highlights: [
      { x: 276, y: 183, w: 79,  h: 28, startMs: 0,    durationMs: 1300 },
      { x: 285, y: 295, w: 100, h: 32, startMs: 1420, durationMs: 1700 },
      { x: 783, y: 183, w: 50,  h: 28, startMs: 3200, durationMs: 350  },
    ],
  },
  {
    id: 'phase-03-urgency',
    caption: 'Same drill for Urgency Level. Pick a value, then Reset.',
    startMs: 6570,
    audioDurationMs: 3667,
    highlights: [
      { x: 367, y: 183, w: 126, h: 28, startMs: 0,    durationMs: 1100 },
      { x: 375, y: 295, w: 100, h: 80, startMs: 1210, durationMs: 4400 },
      { x: 827, y: 183, w: 50,  h: 28, startMs: 5800, durationMs: 1100 },
    ],
  },
  {
    id: 'phase-04-tech',
    caption: 'And Assigned Technician. Pick one, Reset.',
    startMs: 13550,
    audioDurationMs: 2783,
    highlights: [
      { x: 505, y: 183, w: 164, h: 28, startMs: 0,    durationMs: 900  },
      { x: 520, y: 265, w: 100, h: 32, startMs: 1030, durationMs: 2700 },
      { x: 824, y: 183, w: 50,  h: 28, startMs: 3900, durationMs: 2700 },
    ],
  },
  {
    // Side panel slides in within ~270ms — same as the highlight fade-in —
    // so a click highlight on the expand icon ends up floating on the panel.
    // Caption and click animation carry this phase.
    id: 'phase-05-card-details',
    caption: 'Every metric card opens a side panel with the records behind it.',
    startMs: 20360,
    audioDurationMs: 3400,
    highlights: [],
  },
  {
    id: 'phase-06-status-urgency-charts',
    caption: 'Charts open the same way, listing each ticket and assignee.',
    startMs: 29650,
    audioDurationMs: 3386,
    highlights: [
      // Tom (y=549), Priya (y=587), Emily (y=626) — span y=541 to y=664.
      // These rows live inside the open side panel at stable coords.
      { x: 715, y: 541, w: 374, h: 123, startMs: 1530, durationMs: 3000 },
    ],
  },
  {
    id: 'phase-07-issue-category',
    caption: 'Issue Category lets you filter the records by category from the panel.',
    startMs: 44880,
    audioDurationMs: 3644,
    highlights: [
      // Filter chips inside the side panel: Software/Network/Access-Permissions.
      { x: 805, y: 458, w: 320, h: 46, startMs: 3780, durationMs: 3500 },
    ],
  },
  {
    id: 'phase-08-tech-chart',
    caption: 'Technician chart opens the same drill-down view.',
    startMs: 54930,
    audioDurationMs: 2590,
    highlights: [],
  },
  {
    id: 'phase-09-fullscreen',
    caption: 'Charts can expand to full-screen and back to the dashboard.',
    startMs: 61880,
    audioDurationMs: 3096,
    highlights: [],
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
