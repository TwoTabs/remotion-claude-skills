// Run with: npx tsx scripts/todomvc-sprint-todos-recording.ts
import { chromium } from 'playwright';
import { TutorialCaptureRecording } from './playwright-capture';
import * as fs from 'fs';
import * as path from 'path';

const FLOW_SLUG = 'todomvc-sprint-todos';
const APP_URL   = 'https://demo.playwright.dev/todomvc/';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: {
      dir: `public/recordings/${FLOW_SLUG}/`,
      size: { width: 1920, height: 1080 },
    },
  });

  const page    = await context.newPage();
  const capture = new TutorialCaptureRecording(page, FLOW_SLUG);

  await page.goto(APP_URL);
  await page.waitForLoadState('domcontentloaded');
  await page.waitForSelector('.new-todo', { timeout: 10000 });
  await page.waitForTimeout(1000);

  capture.start(); // t = 0

  // ── Step 1: orientation ─────────────────────────────────────────────
  await capture.mark(
    'App overview',
    "TodoMVC — a clean to-do app. Let's add three sprint items.",
    '.new-todo',
  );
  await page.waitForTimeout(3500);

  // ── Step 2–3: Add "Open Gather" ─────────────────────────────────────
  await page.locator('.new-todo').focus();
  await capture.type(
    'Open Gather',
    'Type first todo',
    'Type the first item into the input field.',
    '.new-todo',
  );
  await page.waitForTimeout(600);
  await capture.press('Enter', 'Submit first', 'Press Enter to add it to the list.', '.new-todo');
  await page.waitForTimeout(1800);

  // ── Step 4–5: Add "Attend Sprint Meeting" ───────────────────────────
  await capture.type(
    'Attend Sprint Meeting',
    'Type second todo',
    'Add the second item — the input stays focused.',
    '.new-todo',
  );
  await page.waitForTimeout(600);
  await capture.press('Enter', 'Submit second', 'Submit it the same way.', '.new-todo');
  await page.waitForTimeout(1800);

  // ── Step 6–7: Add "Play Tetris" ─────────────────────────────────────
  await capture.type(
    'Play Tetris',
    'Type third todo',
    'One more — a well-earned break item.',
    '.new-todo',
  );
  await page.waitForTimeout(600);
  await capture.press('Enter', 'Submit third', 'Three todos added.', '.new-todo');
  await page.waitForTimeout(2000);

  // ── Step 8: Three todos visible ─────────────────────────────────────
  await capture.mark(
    'Three todos added',
    'All three items are in the list.',
    '.todo-list',
  );
  await page.waitForTimeout(3200);

  // ── Step 9: Complete "Open Gather" (index 0) ────────────────────────
  await capture.click(
    '.todo-list li .toggle',
    'Complete first',
    "Check off 'Open Gather' — first meeting done.",
    0,
  );
  await page.waitForTimeout(2000);

  // ── Step 10: Complete "Attend Sprint Meeting" (index 1) ─────────────
  await capture.click(
    '.todo-list li .toggle',
    'Complete second',
    "Check off 'Attend Sprint Meeting' too.",
    1,
  );
  await page.waitForTimeout(2000);

  // ── Step 11: Both meetings done ─────────────────────────────────────
  await capture.mark(
    'Two completed',
    'Two items done, one still active.',
    '.todo-list',
  );
  await page.waitForTimeout(3200);

  // ── Step 12: Filter Active ───────────────────────────────────────────
  await capture.click(
    '.filters >> text=Active',
    'Filter active',
    "Filter to 'Active' — only unfinished items show.",
  );
  await page.waitForTimeout(2000);

  // ── Step 13: Active filter result ───────────────────────────────────
  await capture.mark(
    'Active filter',
    "Just 'Play Tetris' remains — the only pending item.",
    '.todo-list',
  );
  await page.waitForTimeout(3200);

  // ── Step 14: Filter Completed ────────────────────────────────────────
  await capture.click(
    '.filters >> text=Completed',
    'Filter completed',
    "Switch to 'Completed' to see what's done.",
  );
  await page.waitForTimeout(2000);

  // ── Step 15: Completed filter result ────────────────────────────────
  await capture.mark(
    'Completed filter',
    'The two completed meetings appear here.',
    '.todo-list',
  );
  await page.waitForTimeout(3200);

  // ── Step 16: Back to All ─────────────────────────────────────────────
  await capture.click(
    '.filters >> text=All',
    'Show all',
    "Back to 'All' — all three items visible again.",
  );
  await page.waitForTimeout(2000);

  // ── Step 17: Double-click "Play Tetris" to edit ──────────────────────
  await capture.dblclick(
    '.todo-list li label',
    'Edit todo',
    "Double-click 'Play Tetris' to edit it inline.",
    2,
  );
  await page.waitForTimeout(1500);

  // ── Step 18: Clear and type new name ────────────────────────────────
  await capture.fill(
    '.todo-list li.editing .edit',
    'Play Tetris at lunch',
    'Rename todo',
    "Clear the field and type the updated name.",
  );
  await page.waitForTimeout(900);

  // ── Step 19: Blur to save (click .new-todo) ──────────────────────────
  await capture.click(
    '.new-todo',
    'Blur to save',
    'Click outside the field — blurring saves the edit without pressing Enter.',
  );
  await page.waitForTimeout(2500);

  // ── Step 20: Edit saved ──────────────────────────────────────────────
  await capture.mark(
    'Edit saved',
    "Renamed to 'Play Tetris at lunch' — blur saves automatically.",
    '.todo-list li:last-child label',
  );
  await page.waitForTimeout(3200);

  // ── Step 21: Clear completed ─────────────────────────────────────────
  await capture.click(
    '.clear-completed',
    'Clear completed',
    "Click 'Clear completed' to remove the two finished items.",
  );
  await page.waitForTimeout(2000);

  // ── Step 22: Verify count ────────────────────────────────────────────
  await capture.mark(
    'Count verified',
    "The counter confirms it: 1 item left.",
    '.todo-count',
  );
  await page.waitForTimeout(3800);

  // ── Finalize ────────────────────────────────────────────────────────
  const endMs = Date.now();
  await context.close();

  const videoPath = await page.video()!.path();
  const finalPath = `public/recordings/${FLOW_SLUG}/recording.webm`;
  fs.mkdirSync(path.dirname(finalPath), { recursive: true });
  fs.renameSync(videoPath, finalPath);

  const videoDurationMs = endMs - capture.t0;
  await capture.save(finalPath, videoDurationMs);
  await browser.close();
})();
