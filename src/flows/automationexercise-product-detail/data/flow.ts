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

export const VIDEO_DURATION_MS    = 39_836;
export const TOTAL_DURATION_FRAMES = msToFrame(VIDEO_DURATION_MS);

export const CAPTIONS: CaptionRegion[] = [
  { id: 'home',           text: 'AutomationExercise — let’s open the catalog and inspect a product.', startMs: 0,     endMs: 3539  },
  { id: 'nav',            text: 'The top nav links to every section of the site.',                    startMs: 3539,  endMs: 6370  },
  { id: 'open-products',  text: 'Click Products to see the full catalog.',                            startMs: 6370,  endMs: 9289  },
  { id: 'all-products',   text: 'You’re on the All Products page — every item in the catalog.',      startMs: 9289,  endMs: 12522 },
  { id: 'product-list',   text: 'Each card shows a thumbnail, name, and price.',                      startMs: 12522, endMs: 15775 },
  { id: 'view-product',   text: 'Click "View Product" on the first item.',                            startMs: 15775, endMs: 18897 },
  { id: 'detail-page',    text: 'You’re now on the product detail page.',                             startMs: 18897, endMs: 22136 },
  { id: 'name',           text: 'Name appears as the page heading.',                                  startMs: 22136, endMs: 24971 },
  { id: 'category',       text: 'Category — e.g. Women › Tops.',                                      startMs: 24971, endMs: 27805 },
  { id: 'price',          text: 'Price, in rupees, just below the name.',                             startMs: 27805, endMs: 30638 },
  { id: 'availability',   text: 'Availability — In Stock when ready to ship.',                        startMs: 30638, endMs: 33471 },
  { id: 'condition',      text: 'Condition tells you New vs. Used.',                                  startMs: 33471, endMs: 36306 },
  { id: 'brand',          text: 'And finally, the brand.',                                            startMs: 36306, endMs: VIDEO_DURATION_MS },
];

// Native 1920×1080 coords from the manifest. Coordinates are rounded to ints
// (Playwright reports fractional sub-pixels for scrolled elements).
export const HIGHLIGHTS: HighlightRegion[] = [
  { id: 'h-hero',         startMs: 0,     endMs: 3539,  delayMs: 300, rect: { x: 390,  y: 133, w: 1140, h: 441 } },
  { id: 'h-nav',          startMs: 3539,  endMs: 6370,  delayMs: 200, rect: { x: 887,  y: 30,  w: 79,   h: 21  } },
  { id: 'h-nav-click',    startMs: 6370,  endMs: 9289,  delayMs: 200, rect: { x: 887,  y: 30,  w: 79,   h: 21  } },
  { id: 'h-page-title',   startMs: 9289,  endMs: 12522, delayMs: 200, rect: { x: 698,  y: 513, w: 833,  h: 20  } },
  { id: 'h-product-card', startMs: 12522, endMs: 15775, delayMs: 200, rect: { x: 698,  y: 563, w: 257,  h: 424 } },
  { id: 'h-view-btn',     startMs: 15775, endMs: 18897, delayMs: 200, rect: { x: 703,  y: 944, w: 247,  h: 39  } },
  { id: 'h-detail-panel', startMs: 18897, endMs: 22136, delayMs: 300, rect: { x: 1057, y: 143, w: 473,  h: 351 } },
  { id: 'h-name',         startMs: 22136, endMs: 24971, delayMs: 200, rect: { x: 1118, y: 204, w: 411,  h: 22  } },
  { id: 'h-category',     startMs: 24971, endMs: 27805, delayMs: 200, rect: { x: 1118, y: 236, w: 411,  h: 20  } },
  { id: 'h-price',        startMs: 27805, endMs: 30638, delayMs: 200, rect: { x: 1118, y: 299, w: 105,  h: 43  } },
  { id: 'h-availability', startMs: 30638, endMs: 33471, delayMs: 200, rect: { x: 1118, y: 358, w: 411,  h: 20  } },
  { id: 'h-condition',    startMs: 33471, endMs: 36306, delayMs: 200, rect: { x: 1118, y: 383, w: 411,  h: 20  } },
  { id: 'h-brand',        startMs: 36306, endMs: VIDEO_DURATION_MS, delayMs: 200, rect: { x: 1118, y: 408, w: 411, h: 20 } },
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
