// Run with: npx tsx scripts/todomvc-walkthrough-recording.ts
import { chromium } from 'playwright';
import { TutorialCaptureRecording } from './playwright-capture';
import * as fs from 'fs';
import * as path from 'path';

const FLOW_SLUG = 'todomvc-walkthrough';
const APP_URL   = 'https://demo.playwright.dev/todomvc/';

(async () => {
  // headless required — recordVideo crashes in headed mode on many setups.
  // Viewport matches the Remotion composition (1920×1080) so element coordinates
  // are native video pixels — no scaling needed.
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
  // domcontentloaded — networkidle never fires reliably on TodoMVC demo
  await page.waitForLoadState('domcontentloaded');
  await page.waitForSelector('.new-todo', { timeout: 10000 });
  await page.waitForTimeout(1000); // settle initial paint

  capture.start(); // ← t = 0

  // ── Step 1: orientation ─────────────────────────────────────────────
  await capture.mark(
    'Overview',
    'TodoMVC — a clean to-do list. Let’s add three items, manage them, and clean up.',
    '.new-todo',
  );
  await page.waitForTimeout(3500);

  // ── Step 2: type first todo ─────────────────────────────────────────
  await page.locator('.new-todo').focus();
  await capture.type(
    'Buy groceries',
    'Add first todo',
    'Type the first item into the input.',
    '.new-todo',
  );
  await page.waitForTimeout(800);

  // ── Step 3: submit first todo ───────────────────────────────────────
  await capture.press(
    'Enter',
    'Submit first',
    'Press Enter to add it to the list.',
  );
  await page.waitForTimeout(2200);

  // ── Step 4: type second todo ────────────────────────────────────────
  await capture.type(
    'Walk the dog',
    'Add second todo',
    'Add another one — the input stays focused.',
    '.new-todo',
  );
  await page.waitForTimeout(700);

  // ── Step 5: submit second todo ──────────────────────────────────────
  await capture.press(
    'Enter',
    'Submit second',
    'And submit.',
  );
  await page.waitForTimeout(1800);

  // ── Step 6: type third todo ─────────────────────────────────────────
  await capture.type(
    'Finish weekly report',
    'Add third todo',
    'One more for the day.',
    '.new-todo',
  );
  await page.waitForTimeout(700);

  // ── Step 7: submit third todo ───────────────────────────────────────
  await capture.press(
    'Enter',
    'Submit third',
    'Three todos added.',
  );
  await page.waitForTimeout(2500);

  // ── Step 8: highlight all three ─────────────────────────────────────
  await capture.mark(
    'Three todos visible',
    'Now let’s mark the middle one as complete.',
    '.todo-list',
  );
  await page.waitForTimeout(3200);

  // ── Step 9: complete the middle todo ────────────────────────────────
  // The toggle is a checkbox inside the second list item. Use nth(1) for index.
  await capture.click(
    '.todo-list li .toggle',
    'Complete middle',
    'Click the checkbox to mark "Walk the dog" done.',
    1,
  );
  await page.waitForTimeout(2200);

  // ── Step 10: show completed state ───────────────────────────────────
  await capture.mark(
    'Completed item',
    'It’s struck through to show it’s done.',
    '.todo-list li.completed',
  );
  await page.waitForTimeout(3000);

  // ── Step 11: filter to Active ───────────────────────────────────────
  await capture.click(
    '.filters >> text=Active',
    'Filter active',
    'Filter to see only what’s still pending.',
  );
  await page.waitForTimeout(2200);

  // ── Step 12: show active list ───────────────────────────────────────
  await capture.mark(
    'Active filter applied',
    'Two active items remain.',
    '.todo-list',
  );
  await page.waitForTimeout(3000);

  // ── Step 13: filter to Completed ────────────────────────────────────
  await capture.click(
    '.filters >> text=Completed',
    'Filter completed',
    'Switch to the completed view.',
  );
  await page.waitForTimeout(2200);

  // ── Step 14: show completed list ────────────────────────────────────
  await capture.mark(
    'Completed filter applied',
    'Just the one we marked done.',
    '.todo-list',
  );
  await page.waitForTimeout(3000);

  // ── Step 15: filter back to All ─────────────────────────────────────
  await capture.click(
    '.filters >> text=All',
    'Show all',
    'Back to everything.',
  );
  await page.waitForTimeout(2000);

  // ── Step 16: double-click to edit first todo ────────────────────────
  await capture.dblclick(
    '.todo-list li label',
    'Edit todo',
    'Double-click any item to edit it inline.',
    0,
  );
  await page.waitForTimeout(1500);

  // ── Step 17: rename ─────────────────────────────────────────────────
  await capture.fill(
    '.todo-list li.editing .edit',
    'Buy groceries and milk',
    'Rename it',
    'Replace the text with a new name.',
  );
  await page.waitForTimeout(900);

  // ── Step 18: press Enter to save ────────────────────────────────────
  await capture.press(
    'Enter',
    'Save edit',
    'Press Enter to save the change.',
  );
  await page.waitForTimeout(2500);

  // ── Step 19: clear completed ────────────────────────────────────────
  await capture.click(
    '.clear-completed',
    'Clear completed',
    'Click "Clear completed" to remove finished items.',
  );
  await page.waitForTimeout(2200);

  // ── Step 20: final state ────────────────────────────────────────────
  await capture.mark(
    'Done',
    'Two items left — clean and tidy.',
    '.todo-count',
  );
  await page.waitForTimeout(3500);

  // ── Finalize ────────────────────────────────────────────────────────
  const endMs = Date.now();
  await context.close(); // finalizes the .webm

  const videoPath = await page.video()!.path();
  const finalPath = `public/recordings/${FLOW_SLUG}/recording.webm`;
  fs.mkdirSync(path.dirname(finalPath), { recursive: true });
  fs.renameSync(videoPath, finalPath);

  const videoDurationMs = endMs - capture.t0;
  await capture.save(finalPath, videoDurationMs);
  await browser.close();
})();
