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

export interface AudioRegion {
  id: string;
  file: string;
  startMs: number;
  durationMs: number;
}

export const VIDEO_DURATION_MS = 48732;
export const TOTAL_DURATION_FRAMES = msToFrame(VIDEO_DURATION_MS);

// Caption regions — one per narrated step. Steps 2, 4, 6, 18 (rapid typing)
// are omitted because their gaps are too short for any audio (~640ms each).
export const CAPTIONS: CaptionRegion[] = [
  { id: 'step-01', text: "TodoMVC. Let’s add three sprint items.",                             startMs: 0,     endMs: 3549  },
  { id: 'step-03', text: "Press Enter to add it to the list.",                                       startMs: 4188,  endMs: 6056  },
  { id: 'step-05', text: "Submit it the same way.",                                                  startMs: 6720,  endMs: 8551  },
  { id: 'step-07', text: "Three todos added.",                                                       startMs: 9195,  endMs: 11216 },
  { id: 'step-08', text: "All three items are in the list.",                                         startMs: 11216, endMs: 14428 },
  { id: 'step-09', text: "Checking off the first item.",                                             startMs: 14428, endMs: 16550 },
  { id: 'step-10', text: "Check off Attend Sprint Meeting too.",                                     startMs: 16550, endMs: 18616 },
  { id: 'step-11', text: "Two items done, one still active.",                                        startMs: 18616, endMs: 21849 },
  { id: 'step-12', text: "Filtering to Active.",                                                     startMs: 21849, endMs: 23917 },
  { id: 'step-13', text: "Just Play Tetris remains — the only pending item.",                   startMs: 23917, endMs: 27147 },
  { id: 'step-14', text: "Switch to Completed to see what’s done.",                            startMs: 27147, endMs: 29217 },
  { id: 'step-15', text: "The two completed meetings appear here.",                                  startMs: 29217, endMs: 32448 },
  { id: 'step-16', text: "Back to all items.",                                                       startMs: 32448, endMs: 34515 },
  { id: 'step-17', text: "Double-click to edit.",                                                    startMs: 34515, endMs: 36090 },
  { id: 'step-19', text: "Click outside — blurring saves the edit.",                           startMs: 37035, endMs: 39599 },
  { id: 'step-20', text: "Renamed to Play Tetris at lunch.",                                        startMs: 39599, endMs: 42830 },
  { id: 'step-21', text: "Clearing completed items.",                                               startMs: 42830, endMs: 44905 },
  { id: 'step-22', text: "The counter confirms it: 1 item left.",                                   startMs: 44905, endMs: VIDEO_DURATION_MS },
];

// Audio durations measured from the generated MP3 files.
export const AUDIO_REGIONS: AudioRegion[] = [
  { id: 'audio-01', file: 'step-01.mp3', startMs: 0,     durationMs: 2893 },
  { id: 'audio-03', file: 'step-03.mp3', startMs: 4188,  durationMs: 1618 },
  { id: 'audio-05', file: 'step-05.mp3', startMs: 6720,  durationMs: 1356 },
  { id: 'audio-07', file: 'step-07.mp3', startMs: 9195,  durationMs: 1171 },
  { id: 'audio-08', file: 'step-08.mp3', startMs: 11216, durationMs: 1562 },
  { id: 'audio-09', file: 'step-09.mp3', startMs: 14428, durationMs: 1437 },
  { id: 'audio-10', file: 'step-10.mp3', startMs: 16550, durationMs: 1842 },
  { id: 'audio-11', file: 'step-11.mp3', startMs: 18616, durationMs: 2242 },
  { id: 'audio-12', file: 'step-12.mp3', startMs: 21849, durationMs: 1181 },
  { id: 'audio-13', file: 'step-13.mp3', startMs: 23917, durationMs: 2971 },
  { id: 'audio-14', file: 'step-14.mp3', startMs: 27147, durationMs: 1983 },
  { id: 'audio-15', file: 'step-15.mp3', startMs: 29217, durationMs: 2006 },
  { id: 'audio-16', file: 'step-16.mp3', startMs: 32448, durationMs: 1177 },
  { id: 'audio-17', file: 'step-17.mp3', startMs: 34515, durationMs: 1075 },
  { id: 'audio-19', file: 'step-19.mp3', startMs: 37035, durationMs: 2316 },
  { id: 'audio-20', file: 'step-20.mp3', startMs: 39599, durationMs: 1843 },
  { id: 'audio-21', file: 'step-21.mp3', startMs: 42830, durationMs: 1437 },
  { id: 'audio-22', file: 'step-22.mp3', startMs: 44905, durationMs: 2321 },
];

// Highlights tied to interaction elements. Coords are native 1920×1080 pixels.
export const HIGHLIGHTS: HighlightRegion[] = [
  { id: 'h-input-overview',    startMs: 0,     endMs: 3549,  delayMs: 300, rect: { x: 685,  y: 175, w: 550, h: 66  } },
  { id: 'h-input-enter1',      startMs: 4188,  endMs: 6056,  delayMs: 200, rect: { x: 685,  y: 175, w: 550, h: 66  } },
  { id: 'h-input-enter2',      startMs: 6720,  endMs: 8551,  delayMs: 200, rect: { x: 685,  y: 175, w: 550, h: 66  } },
  { id: 'h-list-all',          startMs: 11216, endMs: 14428, delayMs: 200, rect: { x: 685,  y: 241, w: 550, h: 179 } },
  { id: 'h-toggle-first',      startMs: 14428, endMs: 16550, delayMs: 400, rect: { x: 685,  y: 251, w: 40,  h: 40  } },
  { id: 'h-toggle-second',     startMs: 16550, endMs: 18616, delayMs: 400, rect: { x: 685,  y: 310, w: 40,  h: 40  } },
  { id: 'h-list-two-done',     startMs: 18616, endMs: 21849, delayMs: 200, rect: { x: 685,  y: 241, w: 550, h: 179 } },
  { id: 'h-filter-active',     startMs: 21849, endMs: 23917, delayMs: 400, rect: { x: 909,  y: 428, w: 51,  h: 25  } },
  { id: 'h-list-active',       startMs: 23917, endMs: 27147, delayMs: 200, rect: { x: 685,  y: 241, w: 550, h: 59  } },
  { id: 'h-filter-completed',  startMs: 27147, endMs: 29217, delayMs: 400, rect: { x: 970,  y: 308, w: 80,  h: 25  } },
  { id: 'h-list-completed',    startMs: 29217, endMs: 32448, delayMs: 200, rect: { x: 685,  y: 241, w: 550, h: 119 } },
  { id: 'h-filter-all',        startMs: 32448, endMs: 34515, delayMs: 400, rect: { x: 870,  y: 368, w: 29,  h: 25  } },
  { id: 'h-edit-target',       startMs: 34515, endMs: 36090, delayMs: 200, rect: { x: 685,  y: 361, w: 550, h: 59  } },
  { id: 'h-edit-input',        startMs: 36090, endMs: 37035, delayMs: 100, rect: { x: 728,  y: 361, w: 506, h: 60  } },
  { id: 'h-new-todo-blur',     startMs: 37035, endMs: 39599, delayMs: 200, rect: { x: 685,  y: 175, w: 550, h: 66  } },
  { id: 'h-renamed-item',      startMs: 39599, endMs: 42830, delayMs: 200, rect: { x: 685,  y: 361, w: 550, h: 59  } },
  { id: 'h-clear-completed',   startMs: 42830, endMs: 44905, delayMs: 400, rect: { x: 1124, y: 431, w: 96,  h: 20  } },
  { id: 'h-count',             startMs: 44905, endMs: VIDEO_DURATION_MS, delayMs: 200, rect: { x: 685,  y: 301, w: 140, h: 29  } },
];

export const CAPTIONS_WITH_FRAMES = CAPTIONS.map(c => ({
  ...c,
  startFrame:     msToFrame(c.startMs),
  endFrame:       msToFrame(c.endMs),
  durationFrames: msToFrame(c.endMs - c.startMs),
}));

export const AUDIO_WITH_FRAMES = AUDIO_REGIONS.map(a => ({
  ...a,
  startFrame:    msToFrame(a.startMs),
  durationFrames: msToFrame(a.durationMs),
}));

export const HIGHLIGHTS_WITH_FRAMES = HIGHLIGHTS.map(h => ({
  ...h,
  startFrame:     msToFrame(h.startMs + h.delayMs),
  durationFrames: msToFrame(h.endMs - h.startMs - h.delayMs),
}));
