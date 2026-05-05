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

export const VIDEO_DURATION_MS = 44444;
export const TOTAL_DURATION_FRAMES = msToFrame(VIDEO_DURATION_MS);

// Caption regions are decoupled from interaction steps so multi-step phases
// (e.g. typing three todos in a row) share a single readable caption rather
// than flashing a new one every 800ms.
export const CAPTIONS: CaptionRegion[] = [
  { id: 'overview',         text: 'TodoMVC — a clean to-do list. Let’s add three items, manage them, and clean up.', startMs: 0,     endMs: 3553  },
  { id: 'type-and-submit',  text: 'Type each item and press Enter — the input stays focused.',                       startMs: 3553,  endMs: 9904  },
  { id: 'three-added',      text: 'Three todos added.',                                                               startMs: 9904,  endMs: 12408 },
  { id: 'mark-middle',      text: 'Now let’s mark the middle one as complete.',                                       startMs: 12408, endMs: 15625 },
  { id: 'click-checkbox',   text: 'Click the checkbox to complete "Walk the dog".',                                   startMs: 15625, endMs: 17905 },
  { id: 'completed',        text: 'It’s struck through to show it’s done.',                                           startMs: 17905, endMs: 20943 },
  { id: 'filter-active',    text: 'Filter to see only active items.',                                                 startMs: 20943, endMs: 23210 },
  { id: 'two-active',       text: 'Two active items remain.',                                                         startMs: 23210, endMs: 26244 },
  { id: 'filter-completed', text: 'Switch to the completed view.',                                                    startMs: 26244, endMs: 28513 },
  { id: 'one-completed',    text: 'Just the one we marked done.',                                                     startMs: 28513, endMs: 31545 },
  { id: 'show-all',         text: 'Back to everything.',                                                              startMs: 31545, endMs: 33611 },
  { id: 'edit',             text: 'Double-click any item to edit it inline.',                                         startMs: 33611, endMs: 35183 },
  { id: 'rename',           text: 'Replace the text and press Enter to save.',                                        startMs: 35183, endMs: 38640 },
  { id: 'clear',            text: 'Click "Clear completed" to remove finished items.',                                startMs: 38640, endMs: 40909 },
  { id: 'done',             text: 'Done — two items left.',                                                           startMs: 40909, endMs: VIDEO_DURATION_MS },
];

// Highlights are tied to the element captured at each interaction. Coords are
// native 1920×1080 pixels — no scaling needed because the recording viewport
// matched the composition size.
export const HIGHLIGHTS: HighlightRegion[] = [
  { id: 'h-input',           startMs: 0,     endMs: 3553,  delayMs: 300, rect: { x: 685,  y: 175, w: 550, h: 66  } },
  { id: 'h-list-all',        startMs: 12408, endMs: 15625, delayMs: 200, rect: { x: 685,  y: 241, w: 550, h: 178 } },
  { id: 'h-toggle-middle',   startMs: 15625, endMs: 17905, delayMs: 400, rect: { x: 685,  y: 310, w: 40,  h: 40  } },
  { id: 'h-completed-item',  startMs: 17905, endMs: 20943, delayMs: 200, rect: { x: 685,  y: 301, w: 550, h: 60  } },
  { id: 'h-filter-active',   startMs: 20943, endMs: 23210, delayMs: 400, rect: { x: 909,  y: 428, w: 51,  h: 25  } },
  { id: 'h-list-active',     startMs: 23210, endMs: 26244, delayMs: 200, rect: { x: 685,  y: 241, w: 550, h: 119 } },
  { id: 'h-filter-completed',startMs: 26244, endMs: 28513, delayMs: 400, rect: { x: 970,  y: 368, w: 80,  h: 25  } },
  { id: 'h-list-completed',  startMs: 28513, endMs: 31545, delayMs: 200, rect: { x: 685,  y: 241, w: 550, h: 59  } },
  { id: 'h-filter-all',      startMs: 31545, endMs: 33611, delayMs: 400, rect: { x: 870,  y: 308, w: 29,  h: 25  } },
  { id: 'h-edit-target',     startMs: 33611, endMs: 35183, delayMs: 200, rect: { x: 685,  y: 241, w: 550, h: 59  } },
  { id: 'h-edit-input',      startMs: 35183, endMs: 38640, delayMs: 100, rect: { x: 728,  y: 241, w: 506, h: 60  } },
  { id: 'h-clear-button',    startMs: 38640, endMs: 40909, delayMs: 400, rect: { x: 1124, y: 431, w: 96,  h: 20  } },
  { id: 'h-count',           startMs: 40909, endMs: VIDEO_DURATION_MS, delayMs: 200, rect: { x: 700, y: 371, w: 63, h: 20 } },
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
