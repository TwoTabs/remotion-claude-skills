import { msToFrame } from '../remotion/msToFrame';

export interface TimedStep {
  id: string;
  label: string;
  caption: string;
  startMs: number;
  overlayDelayMs: number;
  overlayDurationMs: number;
  audioDurationMs: number;
  highlight?: { x: number; y: number; w: number; h: number };
}

export const VIDEO_DURATION_MS = 29673;

export const TIMED_STEPS: TimedStep[] = [
  {
    id: 'phase-01',
    label: 'Orientation',
    caption: 'My Project Forecasts shows your weekly projected hours alongside actuals synced from Clockify.',
    startMs: 0,
    overlayDelayMs: 200,
    overlayDurationMs: 6100,
    audioDurationMs: 5501,
  },
  {
    id: 'phase-02',
    label: 'Project breakdown',
    caption: 'Each project shows its share of your weekly forecast.',
    startMs: 6300,
    overlayDelayMs: 200,
    overlayDurationMs: 5100,
    audioDurationMs: 2901,
    highlight: { x: 52, y: 323, w: 720, h: 232 },
  },
  {
    id: 'phase-03',
    label: 'Week selector',
    caption: 'Use the week selector to jump to any forecast period.',
    startMs: 11700,
    overlayDelayMs: 200,
    overlayDurationMs: 5100,
    audioDurationMs: 3120,
    highlight: { x: 36, y: 610, w: 263, h: 28 },
  },
  {
    id: 'phase-04',
    label: 'Past week comparison',
    caption: 'Pick a previous week to compare prior forecasts against actuals from Clockify.',
    startMs: 17000,
    overlayDelayMs: 200,
    overlayDurationMs: 4500,
    audioDurationMs: 4393,
  },
];

export const STEPS_WITH_FRAMES = TIMED_STEPS.map((s, i, arr) => {
  const next = arr[i + 1];
  const phaseDurationMs = next ? next.startMs - s.startMs : VIDEO_DURATION_MS - s.startMs;
  return {
    ...s,
    overlayStart:    msToFrame(s.startMs + s.overlayDelayMs),
    overlayDuration: msToFrame(s.overlayDurationMs),
    captionStart:    msToFrame(s.startMs),
    captionDuration: msToFrame(phaseDurationMs),
    audioDuration:   msToFrame(s.audioDurationMs),
  };
});

export const TOTAL_DURATION_FRAMES = msToFrame(VIDEO_DURATION_MS);
