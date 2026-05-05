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

// The raw recording is 76,919 ms but the order-summary page sits idle from
// ~37,500 ms to ~70,500 ms while Playwright waits on actionability for the
// Finish button. The composition splices that dead zone out:
//   Part A: source 0       → 37,500 ms  (37.5 s)
//   Part B: source 70,500  → 76,919 ms  ( 6.4 s)
// Everything after the cut is shifted by CUT_MS in the public timeline below.
export const CUT_SOURCE_START_MS = 37_500;
export const CUT_SOURCE_END_MS   = 70_500;
export const CUT_MS              = CUT_SOURCE_END_MS - CUT_SOURCE_START_MS; // 33,000

export const VIDEO_DURATION_MS    = 76_919 - CUT_MS; // 43,919
export const TOTAL_DURATION_FRAMES = msToFrame(VIDEO_DURATION_MS);

// Caption regions are decoupled from interaction steps so adjacent fast
// interactions (typing user/pass, three shipping fields) share one readable
// caption rather than flashing a new one every second.
export const CAPTIONS: CaptionRegion[] = [
  { id: 'login-screen',  text: 'Sauce Demo — a sample storefront. Let’s log in and place an order.', startMs: 0,      endMs: 3570  },
  { id: 'credentials',   text: 'Enter the standard user and the shared password.',                   startMs: 3570,   endMs: 7857  },
  { id: 'login-click',   text: 'Click Login to enter the store.',                                    startMs: 7857,   endMs: 9778  },
  { id: 'inventory',     text: 'Six products, sorted A-Z by default.',                               startMs: 9778,   endMs: 13006 },
  { id: 'sort',          text: 'Re-sort by price — the Onesie at $7.99 is now the cheapest.',       startMs: 13006,  endMs: 17888 },
  { id: 'add-items',     text: 'Add two items — the cart badge updates to 2.',                       startMs: 17888,  endMs: 22424 },
  { id: 'open-cart',     text: 'Open the cart to review the order.',                                 startMs: 22424,  endMs: 27525 },
  { id: 'checkout',      text: 'Click Checkout to enter shipping details.',                          startMs: 27525,  endMs: 29099 },
  { id: 'shipping',      text: 'Fill in first name, last name, and zip.',                            startMs: 29099,  endMs: 33725 },
  { id: 'continue',      text: 'Continue to the order overview.',                                    startMs: 33725,  endMs: 35996 },
  { id: 'summary',       text: 'Subtotal, tax and total — review before confirming.',                startMs: 35996,  endMs: 38504 },
  { id: 'finish',        text: 'Click Finish to place the order.',                                   startMs: 38504,  endMs: 40385 },
  { id: 'complete',      text: 'Thank you for your order — flow done.',                              startMs: 40385,  endMs: VIDEO_DURATION_MS },
];

// Coords are native 1920×1080 pixels (recording viewport == composition size).
// Times after the cut (steps 18/19) are pre-shifted by CUT_MS — they live in
// the public timeline alongside everything else.
export const HIGHLIGHTS: HighlightRegion[] = [
  { id: 'h-login-form',    startMs: 0,     endMs: 3570,  delayMs: 300, rect: { x: 814,  y: 154, w: 292,  h: 197 } },
  { id: 'h-username',      startMs: 3570,  endMs: 5797,  delayMs: 100, rect: { x: 814,  y: 154, w: 292,  h: 39  } },
  { id: 'h-password',      startMs: 5797,  endMs: 7857,  delayMs: 100, rect: { x: 814,  y: 208, w: 292,  h: 39  } },
  { id: 'h-login-btn',     startMs: 7857,  endMs: 9778,  delayMs: 200, rect: { x: 814,  y: 302, w: 292,  h: 49  } },
  { id: 'h-inventory',     startMs: 9778,  endMs: 13006, delayMs: 300, rect: { x: 415,  y: 154, w: 1090, h: 786 } },
  { id: 'h-sort',          startMs: 13006, endMs: 14851, delayMs: 200, rect: { x: 1676, y: 70,  w: 223,  h: 30  } },
  { id: 'h-first-item',    startMs: 14851, endMs: 17888, delayMs: 200, rect: { x: 430,  y: 154, w: 505,  h: 240 } },
  { id: 'h-add-onesie',    startMs: 17888, endMs: 19959, delayMs: 200, rect: { x: 740,  y: 339, w: 160,  h: 34  } },
  { id: 'h-add-bike',      startMs: 19959, endMs: 22424, delayMs: 200, rect: { x: 1295, y: 339, w: 160,  h: 34  } },
  { id: 'h-cart-icon',     startMs: 22424, endMs: 24496, delayMs: 200, rect: { x: 1860, y: 10,  w: 40,   h: 40  } },
  { id: 'h-cart-list',     startMs: 24496, endMs: 27525, delayMs: 200, rect: { x: 320,  y: 114, w: 1280, h: 432 } },
  { id: 'h-checkout-btn',  startMs: 27525, endMs: 29099, delayMs: 200, rect: { x: 1380, y: 606, w: 220,  h: 34  } },
  { id: 'h-firstname',     startMs: 29099, endMs: 30548, delayMs: 100, rect: { x: 770,  y: 255, w: 380,  h: 39  } },
  { id: 'h-lastname',      startMs: 30548, endMs: 31893, delayMs: 100, rect: { x: 770,  y: 309, w: 380,  h: 39  } },
  { id: 'h-postalcode',    startMs: 31893, endMs: 33725, delayMs: 100, rect: { x: 770,  y: 363, w: 380,  h: 39  } },
  { id: 'h-continue-btn',  startMs: 33725, endMs: 35996, delayMs: 200, rect: { x: 1365, y: 599, w: 220,  h: 41  } },
  // step 17 (Order summary) — no element captured, skip highlight
  { id: 'h-finish-btn',    startMs: 38504, endMs: 40385, delayMs: 200, rect: { x: 1380, y: 876, w: 220,  h: 34  } },
  { id: 'h-complete',      startMs: 40385, endMs: VIDEO_DURATION_MS, delayMs: 200, rect: { x: 780, y: 296, w: 360, h: 32 } },
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
