// scripts/airtable-interface-filters-recording.ts
// Tutorial: open the three filter dropdowns on an Airtable Interface dashboard
// (Status / Urgency Level / Assigned Technician), apply each one, watch the
// charts update.
//
// Cumulative flow — each filter stays applied so the viewer sees how filters
// combine, ending with all three active.

import { chromium } from 'playwright';
import { TutorialCaptureRecording } from './playwright-capture';
import * as fs from 'fs';
import * as path from 'path';

const FLOW_SLUG = 'airtable-interface-filters';
const APP_URL   = 'https://airtable.com/appNZEQ7oQPJT0cDW/pagxaMvstTeFv1xgF';
const VIEWPORT  = { width: 1600, height: 900 } as const;

const RECORDING_DIR  = `public/recordings/${FLOW_SLUG}`;
const STORAGE_PATH   = path.join(RECORDING_DIR, 'storage-state.json');
const START_URL_PATH = path.join(RECORDING_DIR, 'start-url.txt');

const HOLD_OPEN_MENU = 1100;   // dropdown open animation + reading menu
const HOLD_PICK      = 2200;   // option click + chart re-render
const HOLD_RESULT    = 3200;   // dwell on filtered dashboard
const HOLD_FINAL     = 4500;

// Airtable's filter popover closes on outside-click but leaves a lingering
// portal in the DOM that blocks Playwright's actionability check on the next
// combobox for ~30s. Workaround: outside-click to dismiss (the popover
// visually closes within ~300ms), then use `force: true` on the next combobox
// click to skip actionability and click the element directly.
async function dismissPopover(page: import('playwright').Page) {
  await page.mouse.click(1500, 140);
  await page.waitForFunction(
    () => document.querySelectorAll('[role="option"]').length === 0,
    { timeout: 5000 },
  ).catch(() => {});
}

// Node-side sleep — page.waitForTimeout has been observed to stall ~30s on
// some pages after popover-related state changes. Plain setTimeout always
// takes exactly the specified duration.
const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

(async () => {
  const storageState = fs.existsSync(STORAGE_PATH)   ? STORAGE_PATH                                : undefined;
  const startUrl     = fs.existsSync(START_URL_PATH) ? fs.readFileSync(START_URL_PATH, 'utf8').trim() : APP_URL;

  fs.mkdirSync(RECORDING_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: VIEWPORT,
    storageState,
    recordVideo: { dir: `${RECORDING_DIR}/`, size: VIEWPORT },
  });

  const page    = await context.newPage();
  const capture = new TutorialCaptureRecording(page, FLOW_SLUG);

  await page.goto(startUrl, { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('load');
  // The dashboard renders three combobox filters — wait for them.
  await page.waitForFunction(
    () => document.querySelectorAll('button[role="combobox"]').length >= 3,
    { timeout: 20000 },
  );
  await page.waitForTimeout(1800); // settle initial chart animations

  // Pre-fetch combobox bounding boxes via evaluate — Playwright's
  // locator.boundingBox() auto-waits 30s for actionability and gets blocked
  // by Airtable's lingering popover portal. We inject these coords into the
  // manifest at the end instead of letting capture.mark fetch them live.
  type Box = { x: number; y: number; width: number; height: number };
  // Inline DOM reads — tsx/esbuild's __name helper is not available in
  // page.evaluate context, so avoid declaring inner functions or types.
  const boxes = await page.evaluate(() => {
    const out: Record<string, { x: number; y: number; width: number; height: number } | null> = {
      status: null, urgency: null, tech: null,
    };
    const s = document.querySelector('button[role="combobox"][aria-label="Status"]');
    if (s) { const r = (s as HTMLElement).getBoundingClientRect(); out.status = { x: r.left, y: r.top, width: r.width, height: r.height }; }
    const u = document.querySelector('button[role="combobox"][aria-label="Urgency Level"]');
    if (u) { const r = (u as HTMLElement).getBoundingClientRect(); out.urgency = { x: r.left, y: r.top, width: r.width, height: r.height }; }
    const all = document.querySelectorAll('button[role="combobox"]');
    if (all[2]) { const r = (all[2] as HTMLElement).getBoundingClientRect(); out.tech = { x: r.left, y: r.top, width: r.width, height: r.height }; }
    return out as { status: Box | null; urgency: Box | null; tech: Box | null };
  });
  console.log(`[diag] pre-fetched boxes: ${JSON.stringify(boxes)}`);

  capture.start();

  // ── 1. Overview — highlight the filter row ──────────────────────
  // Selector omitted — coords injected from pre-fetched `boxes` after save.
  await capture.mark(
    'Dashboard overview',
    'This Airtable interface tracks IT support requests, with three filters at the top.',
  );
  await page.waitForTimeout(3800);

  // ── 2. Open Status dropdown ─────────────────────────────────────
  await capture.click(
    'button[role="combobox"][aria-label="Status"]',
    'Open Status filter',
    'Click the Status filter to narrow requests by workflow state.',
  );
  await page.waitForTimeout(HOLD_OPEN_MENU);

  // ── 3. Pick "Open" ──────────────────────────────────────────────
  await capture.click(
    '[role="option"]:has-text("Open"), li:has-text("Open")',
    'Choose Open',
    'Pick "Open" to show only unresolved tickets.',
    0,
  );
  await page.waitForTimeout(700);
  await dismissPopover(page);
  await sleep(HOLD_PICK);

  // ── 4. Show result — highlight the Status chart ─────────────────
  await capture.mark(
    'Status filter applied',
    'The charts now reflect only Open requests.',
  );
  await sleep(HOLD_RESULT);

  // ── 5. Open Urgency Level dropdown ──────────────────────────────
  // No highlight selector here: the prior Status popover leaves a lingering
  // portal that makes boundingBox() wait 30s. The visible click animation is
  // enough to direct attention; caption carries the message.
  await capture.mark(
    'Open Urgency filter',
    'Open Urgency Level to layer on a second filter.',
  );
  await page.locator('button[role="combobox"][aria-label="Urgency Level"]').click({ force: true });
  await page.waitForTimeout(HOLD_OPEN_MENU);

  // ── 6. Pick "High" ──────────────────────────────────────────────
  await capture.click(
    '[role="option"]:has-text("High"), li:has-text("High")',
    'Choose High',
    'Select "High" to focus on the urgent ones.',
    0,
  );
  await page.waitForTimeout(700);
  await dismissPopover(page);
  await sleep(HOLD_PICK);

  // ── 7. Show combined result ─────────────────────────────────────
  await capture.mark(
    'Combined filter',
    'Both filters are active — Open AND High urgency.',
  );
  await sleep(HOLD_RESULT);

  // ── 8. Open Assigned Technician dropdown ────────────────────────
  // No highlight selector — same lingering-portal issue as step 5.
  await capture.mark(
    'Open Technician filter',
    'Finally, filter by Assigned Technician.',
  );
  await page.locator('button[role="combobox"]').nth(2).click({ force: true });
  await page.waitForTimeout(HOLD_OPEN_MENU);

  // ── 9. Pick "Wyn Villanueva" ────────────────────────────────────
  await capture.click(
    '[role="option"]:has-text("Wyn"), li:has-text("Wyn")',
    'Choose Wyn Villanueva',
    'Pick a technician to see their workload.',
    0,
  );
  await page.waitForTimeout(700);
  await dismissPopover(page);
  await sleep(HOLD_PICK);

  // ── 10. Final state ─────────────────────────────────────────────
  await capture.mark(
    'All filters active',
    'Three filters working together pinpoint exactly what each technician is handling.',
  );
  await sleep(HOLD_FINAL);

  const endMs = Date.now();
  await context.close();

  const videoPath = await page.video()!.path();
  const videoDurationMs = endMs - capture.t0;

  fs.renameSync(videoPath, path.join(RECORDING_DIR, 'recording.webm'));
  await capture.save(`${RECORDING_DIR}/recording.webm`, videoDurationMs);

  // Inject pre-fetched bounding boxes for the marks we deliberately left
  // selector-less (steps 1, 4, 7, 10 highlight comboboxes; 5 and 8 stay
  // unhighlighted because the click animation is visible).
  const manifestPath = path.join(RECORDING_DIR, 'manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const inject = (stepIdx: number, box: Box | null, sel: string) => {
    if (!box) return;
    manifest.steps[stepIdx].element = { selector: sel, ...box };
  };
  inject(0, boxes.status,  'button[role="combobox"][aria-label="Status"]');         // step 1
  inject(3, boxes.status,  'button[role="combobox"][aria-label="Status"]');         // step 4
  inject(6, boxes.urgency, 'button[role="combobox"][aria-label="Urgency Level"]');  // step 7
  inject(9, boxes.status,  'button[role="combobox"][aria-label="Status"]');         // step 10
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`✅ Injected pre-fetched coords for steps 1, 4, 7, 10`);

  await browser.close();
})();
