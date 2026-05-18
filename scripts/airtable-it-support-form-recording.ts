import { chromium } from 'playwright';
import { TutorialCaptureRecording } from './playwright-capture';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

const FLOW_SLUG = 'airtable-it-support-form';
const APP_URL   = 'https://airtable.com/appNZEQ7oQPJT0cDW/pagQ8hHX8akodwk2F/form';
const VIEWPORT  = { width: 1600, height: 900 } as const;

const HOLD_FILL  = 2800;
const HOLD_PICK  = 2400;
const HOLD_FINAL = 4000;

(async () => {
  const RECORDING_DIR = `public/recordings/${FLOW_SLUG}`;
  fs.mkdirSync(RECORDING_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const recordStartMs = Date.now();
  const context = await browser.newContext({
    viewport: VIEWPORT,
    recordVideo: { dir: `${RECORDING_DIR}/`, size: VIEWPORT },
  });

  const page    = await context.newPage();
  const capture = new TutorialCaptureRecording(page, FLOW_SLUG);

  await page.goto(APP_URL, { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('load');
  await page.waitForSelector('h2:has-text("New IT Support Request")', { timeout: 15000 });
  // Wait for form fields to actually paint — H2 alone matches before fields render.
  await page.waitForSelector('textarea', { state: 'visible', timeout: 15000 });
  await page.waitForFunction(() => document.querySelectorAll('[role="combobox"]').length >= 5, { timeout: 15000 });
  await page.waitForTimeout(1500);

  capture.start();

  // ── 1. Overview ───────────────────────────────────────────────────
  await capture.mark(
    'Form overview',
    'A simple Airtable form for filing IT support tickets.',
    'h2:has-text("New IT Support Request")',
  );
  await page.waitForTimeout(3500);

  // ── 2. Requester Name ─────────────────────────────────────────────
  await capture.fill(
    'textarea',
    'Alex Morgan',
    'Requester Name',
    'Start with your name.',
    0,
  );
  await page.waitForTimeout(HOLD_FILL);

  // ── 3. Email Address ──────────────────────────────────────────────
  await capture.fill(
    'textarea',
    'alex.morgan@example.com',
    'Email Address',
    'Then your email so IT can follow up.',
    1,
  );
  await page.waitForTimeout(HOLD_FILL);

  // ── 4. Department: open + pick Marketing ──────────────────────────
  await capture.click(
    '[role="combobox"]',
    'Open Department dropdown',
    'Pick the department you work in.',
    0,
  );
  await page.waitForTimeout(700);
  await capture.click(
    '[role="option"]:has-text("Marketing"), li:has-text("Marketing")',
    'Choose Marketing',
    '',
    0,
  );
  await page.waitForTimeout(HOLD_PICK);

  // Scroll to Device & System section
  await page.evaluate(() => {
    const h = document.querySelector('h2');
    const all = Array.from(document.querySelectorAll('h2'));
    const target = all.find(x => x.textContent?.includes('Device and System Details'));
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  await page.waitForTimeout(900);

  // ── 5. Device Type: Laptop ────────────────────────────────────────
  await capture.click(
    '[role="combobox"]',
    'Open Device Type',
    'Tell IT what kind of device you are on.',
    1,
  );
  await page.waitForTimeout(700);
  await capture.click(
    '[role="option"]:has-text("Laptop"), li:has-text("Laptop")',
    'Choose Laptop',
    '',
    0,
  );
  await page.waitForTimeout(HOLD_PICK);

  // ── 6. Operating System: macOS ────────────────────────────────────
  await capture.click(
    '[role="combobox"]',
    'Open Operating System',
    'And which operating system it runs.',
    2,
  );
  await page.waitForTimeout(700);
  await capture.click(
    '[role="option"]:has-text("macOS"), li:has-text("macOS")',
    'Choose macOS',
    '',
    0,
  );
  await page.waitForTimeout(HOLD_PICK);

  // Scroll to Issue Information
  await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('h2'));
    const target = all.find(x => x.textContent?.includes('Issue Information'));
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  await page.waitForTimeout(900);

  // ── 7. Issue Category: Software ───────────────────────────────────
  await capture.click(
    '[role="combobox"]',
    'Open Issue Category',
    'Categorise the problem so it routes to the right team.',
    3,
  );
  await page.waitForTimeout(700);
  await capture.click(
    '[role="option"]:has-text("Software"), li:has-text("Software")',
    'Choose Software',
    '',
    0,
  );
  await page.waitForTimeout(HOLD_PICK);

  // ── 8. Urgency Level: High ────────────────────────────────────────
  await capture.click(
    '[role="combobox"]',
    'Open Urgency Level',
    'Set how urgent it is — be honest with this one.',
    4,
  );
  await page.waitForTimeout(700);
  await capture.click(
    '[role="option"]:has-text("High"), li:has-text("High")',
    'Choose High',
    '',
    0,
  );
  await page.waitForTimeout(HOLD_PICK);

  // ── 9. Issue Description ──────────────────────────────────────────
  // role=textbox indices: 0,1 are section help-text; 2 is the actual description input;
  // 3 is the Related-Task help-text.
  await capture.click(
    '[role="textbox"]',
    'Focus description',
    'Describe what is going wrong, with steps you have tried.',
    2,
  );
  await page.waitForTimeout(500);
  await capture.type(
    'Adobe Creative Cloud apps crash on launch after the latest macOS update. Restarted, reinstalled — no fix. Blocking work on Q3 campaign assets.',
    'Type description',
    '',
  );
  await page.waitForTimeout(HOLD_FILL);

  // Scroll to Submit button
  await page.evaluate(() => {
    const submit = document.querySelector('button[aria-label="Submit"]');
    submit?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
  await page.waitForTimeout(900);

  // ── 10. Highlight Submit (do not click — would create a real record) ─
  await capture.mark(
    'Ready to submit',
    'Once everything looks right, click Submit and IT picks it up.',
    'button[aria-label="Submit"]',
  );
  await page.waitForTimeout(HOLD_FINAL);

  const endMs = Date.now();
  await context.close();

  const captureDurationMs = endMs - capture.t0;

  const rawPath   = path.join(RECORDING_DIR, 'recording.raw.webm');
  const finalPath = path.join(RECORDING_DIR, 'recording.webm');

  // Wait for finalization, then grab the path.
  const videoPath = await page.video()!.path();
  fs.renameSync(videoPath, rawPath);

  // Trim from the wall-clock offset between newContext() (when recordVideo started)
  // and capture.start(). This is exact — no dependency on .webm duration metadata
  // (which can be off by hundreds of ms due to encoder finalisation).
  const offsetSec = (capture.t0 - recordStartMs) / 1000;

  console.log(`\n  record→capture offset: ${offsetSec.toFixed(3)}s   capture duration: ${(captureDurationMs / 1000).toFixed(2)}s`);

  execSync(
    `ffmpeg -y -ss ${offsetSec.toFixed(3)} -i "${rawPath}" -c:v libvpx -b:v 2M -an "${finalPath}" -loglevel error`,
    { stdio: 'inherit' }
  );
  fs.unlinkSync(rawPath);

  const finalDurationMs = Math.round(
    parseFloat(
      execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${finalPath}"`)
        .toString().trim()
    ) * 1000
  );

  await capture.save(finalPath, finalDurationMs);
  await browser.close();
})();
