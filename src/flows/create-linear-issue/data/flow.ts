import { msToFrame } from '../remotion/msToFrame';

export interface CaptionRegion {
  id: string;
  text: string;
  startMs: number;
  endMs: number;
}

export interface HighlightRegion {
  id: string;
  startMs: number;
  endMs: number;
  delayMs: number;
  rect: { x: number; y: number; w: number; h: number };
}

export const VIDEO_DURATION_MS = 51318;
export const TOTAL_DURATION_FRAMES = msToFrame(VIDEO_DURATION_MS);

export const CAPTIONS: CaptionRegion[] = [
  { id: 'board-overview',  text: "Linear's board organises every issue by workflow status — a live snapshot of what your team is working on.", startMs: 0,     endMs: 13145 },
  { id: 'add-issue',       text: "Click 'Add new issue' (or press C) to create one directly in the current column.",                              startMs: 13145, endMs: 16245 },
  { id: 'enter-title',     text: "Type a clear, searchable title — Linear surfaces it across notifications, filters, and search.",                startMs: 16245, endMs: 21512 },
  { id: 'add-description', text: "Add a description with rich text, images, or mentions to give the issue full context.",                         startMs: 21512, endMs: 26344 },
  { id: 'set-status',      text: "Set the workflow status — issues default to Todo but can start anywhere on the board.",                         startMs: 26344, endMs: 29896 },
  { id: 'set-priority',    text: "Set priority so urgent work surfaces in priority-filtered views and daily digests.",                            startMs: 29896, endMs: 33311 },
  { id: 'set-cycle',       text: "Link the issue to a cycle so it's part of the current sprint with a real time-box.",                            startMs: 33311, endMs: 35896 },
  { id: 'create-issue',    text: "Click 'Create issue' — Linear saves it instantly and assigns a unique ID for tracking.",                        startMs: 35896, endMs: 39095 },
  { id: 'view-issue',      text: "Open the new issue from the toast to jump straight into its full detail view.",                                 startMs: 39095, endMs: VIDEO_DURATION_MS },
];

// All coordinates captured from real DOM bounding boxes during recording.
// No scaling needed — viewport === recording size === composition size (1920×1080).
export const HIGHLIGHTS: HighlightRegion[] = [
  { id: 'h-add-issue',     startMs: 13145, endMs: 16245,            delayMs: 200, rect: { x: 611,  y: 769, w: 320, h: 28 } },
  { id: 'h-title',         startMs: 16245, endMs: 21512,            delayMs: 200, rect: { x: 604,  y: 198, w: 712, h: 24 } },
  { id: 'h-description',   startMs: 21512, endMs: 26344,            delayMs: 200, rect: { x: 604,  y: 234, w: 712, h: 23 } },
  { id: 'h-status-btn',    startMs: 26344, endMs: 28528,            delayMs: 200, rect: { x: 598,  y: 353, w: 63,  h: 24 } },
  { id: 'h-status-pick',   startMs: 28528, endMs: 29896,            delayMs: 100, rect: { x: 599,  y: 553, w: 206, h: 32 } },
  { id: 'h-priority-btn',  startMs: 29896, endMs: 31561,            delayMs: 200, rect: { x: 703,  y: 353, w: 75,  h: 24 } },
  { id: 'h-priority-pick', startMs: 31561, endMs: 33311,            delayMs: 100, rect: { x: 718,  y: 465, w: 174, h: 16 } },
  { id: 'h-cycle-btn',     startMs: 33311, endMs: 34628,            delayMs: 200, rect: { x: 1201, y: 353, w: 84,  h: 24 } },
  { id: 'h-cycle-pick',    startMs: 34628, endMs: 35896,            delayMs: 100, rect: { x: 1085, y: 426, w: 161, h: 20 } },
  { id: 'h-create-btn',    startMs: 35896, endMs: 39095,            delayMs: 200, rect: { x: 1228, y: 401, w: 94,  h: 28 } },
  { id: 'h-toast',         startMs: 39095, endMs: VIDEO_DURATION_MS, delayMs: 200, rect: { x: 1545, y: 963, w: 326, h: 23 } },
];

export const CAPTIONS_WITH_FRAMES = CAPTIONS.map(c => ({
  ...c,
  startFrame:     msToFrame(c.startMs),
  endFrame:       msToFrame(c.endMs),
  durationFrames: msToFrame(c.endMs - c.startMs),
}));

export const HIGHLIGHTS_WITH_FRAMES = HIGHLIGHTS.map(h => ({
  ...h,
  startFrame:     msToFrame(h.startMs + h.delayMs),
  durationFrames: msToFrame(h.endMs - h.startMs - h.delayMs),
}));
