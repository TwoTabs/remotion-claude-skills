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

export const VIDEO_DURATION_MS = 31766;
export const TOTAL_DURATION_FRAMES = msToFrame(VIDEO_DURATION_MS);

export const CAPTIONS: CaptionRegion[] = [
  { id: 'board-overview',  text: "Your team's Linear board shows all issues organized by workflow status — a live snapshot of what everyone is working on.", startMs: 0,     endMs: 2000  },
  { id: 'open-creator',    text: 'Press C from anywhere in Linear to open the quick issue creator instantly, without leaving your current view.',           startMs: 2000,  endMs: 5000  },
  { id: 'enter-title',     text: 'Type a clear, searchable title. Linear uses it across notifications, filters, and search — precision here saves time later.', startMs: 5000,  endMs: 9000  },
  { id: 'add-description', text: 'The description field accepts rich text, images, and mentions — add context that makes the issue self-explanatory.',      startMs: 9000,  endMs: 11000 },
  { id: 'set-status',      text: "The status picker maps to your team's workflow. Issues start as Todo and move forward as work progresses.",               startMs: 11000, endMs: 13000 },
  { id: 'set-priority',    text: 'Priority tells your team what to tackle first. You can filter and sort by priority across any Linear view.',              startMs: 13000, endMs: 15000 },
  { id: 'high-priority',   text: 'High priority flags this issue for prompt attention — it surfaces in priority-filtered views and daily digests.',         startMs: 15000, endMs: 16000 },
  { id: 'assign-teammate', text: "Assigning the issue sends a notification and makes it appear in the assignee's My Issues view immediately.",              startMs: 16000, endMs: 19000 },
  { id: 'link-cycle',      text: 'Linking the issue to a cycle adds it to your sprint. Cycles give Linear its time-boxed, goal-driven structure.',         startMs: 19000, endMs: 21000 },
  { id: 'create-issue',    text: 'Click Create Issue to save it instantly. Linear assigns a unique ID for tracking in commits, PRs, and Slack.',           startMs: 21000, endMs: 23000 },
  { id: 'issue-on-board',  text: 'The new issue appears in the Todo column right away — no refresh needed. The toast confirms the ID for quick reference.',startMs: 23000, endMs: 26000 },
  { id: 'issue-detail',    text: 'Click any issue to open the full detail view, where you can add comments, sub-issues, estimates, and attachments.',      startMs: 26000, endMs: VIDEO_DURATION_MS },
];

// All coordinates are in 1920×1080 space (the converted recording resolution).
export const HIGHLIGHTS: HighlightRegion[] = [
  { id: 'h-board-sidebar',  startMs: 0,     endMs: 2000,             delayMs: 200, rect: { x: 0,    y: 0,   w: 384, h: 1080 } },
  { id: 'h-dialog',         startMs: 2000,  endMs: 5000,             delayMs: 400, rect: { x: 545,  y: 219, w: 741, h: 454  } },
  { id: 'h-title',          startMs: 5000,  endMs: 9000,             delayMs: 200, rect: { x: 545,  y: 219, w: 741, h: 90   } },
  { id: 'h-description',    startMs: 9000,  endMs: 11000,            delayMs: 400, rect: { x: 545,  y: 310, w: 741, h: 120  } },
  { id: 'h-status',         startMs: 11000, endMs: 13000,            delayMs: 400, rect: { x: 545,  y: 450, w: 380, h: 260  } },
  { id: 'h-priority',       startMs: 13000, endMs: 15000,            delayMs: 400, rect: { x: 545,  y: 450, w: 280, h: 200  } },
  { id: 'h-priority-badge', startMs: 15000, endMs: 16000,            delayMs: 200, rect: { x: 545,  y: 610, w: 741, h: 55   } },
  { id: 'h-assignee',       startMs: 16000, endMs: 19000,            delayMs: 400, rect: { x: 545,  y: 450, w: 380, h: 280  } },
  { id: 'h-cycle',          startMs: 19000, endMs: 21000,            delayMs: 400, rect: { x: 545,  y: 380, w: 380, h: 320  } },
  { id: 'h-create-btn',     startMs: 21000, endMs: 23000,            delayMs: 400, rect: { x: 1050, y: 618, w: 230, h: 45   } },
  { id: 'h-detail-panel',   startMs: 26000, endMs: VIDEO_DURATION_MS, delayMs: 400, rect: { x: 1536, y: 0,   w: 384, h: 1080 } },
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
