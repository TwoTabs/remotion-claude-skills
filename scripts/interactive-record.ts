/**
 * interactive-record.ts
 *
 * Opens a headed Chromium window at 1920×1080. You log in and navigate
 * to the right starting point, then press ENTER to begin recording.
 * Every click is captured automatically with its exact element bounding
 * box.  Press ENTER again to stop.  Produces:
 *
 *   public/recordings/<slug>/recording.webm   — the video
 *   public/recordings/<slug>/manifest.json    — steps with accurate coords
 *
 * Usage:
 *   npx tsx scripts/interactive-record.ts <flow-slug> <start-url>
 *
 * Then feed the manifest into the skill:
 *   Entry: from-manifest
 *   Manifest: public/recordings/<slug>/manifest.json
 */

import { chromium, type BrowserContext } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

// ── args ───────────────────────────────────────────────────────────────────

const [, , FLOW_SLUG, START_URL] = process.argv;

if (!FLOW_SLUG || !START_URL) {
  console.error('\nUsage: npx tsx scripts/interactive-record.ts <flow-slug> <start-url>\n');
  process.exit(1);
}

const RECORDING_DIR = path.join('public', 'recordings', FLOW_SLUG);
const VIDEO_FINAL   = path.join(RECORDING_DIR, 'recording.webm');
const MANIFEST_PATH = path.join(RECORDING_DIR, 'manifest.json');
const VIEWPORT      = { width: 1920, height: 1080 } as const;

// Signal files — Claude creates these to advance phases instead of Enter
const SIGNAL_START = path.join(RECORDING_DIR, '.ir-start');
const SIGNAL_STOP  = path.join(RECORDING_DIR, '.ir-stop');

// When stdin is not a TTY (e.g. run from Claude Code via Bash), use file signals
const USE_SIGNALS = !process.stdin.isTTY;

// ── wait helper — readline (terminal) or file signal (Claude Code) ─────────

function waitForSignal(signalFile: string): Promise<void> {
  return new Promise(resolve => {
    const check = () => {
      if (fs.existsSync(signalFile)) {
        fs.unlinkSync(signalFile);
        resolve();
      } else {
        setTimeout(check, 400);
      }
    };
    check();
  });
}

function prompt(msg: string): { promise: Promise<void>; cancel: () => void } {
  let rl: readline.Interface | null = null;
  let resolved = false;
  let resolve!: () => void;
  const promise = new Promise<void>(r => { resolve = r; });

  rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  process.stdout.write(msg);
  rl.once('line', () => { rl?.close(); rl = null; if (!resolved) { resolved = true; resolve(); } });

  return {
    promise,
    cancel: () => { rl?.close(); rl = null; if (!resolved) { resolved = true; resolve(); } },
  };
}

// Advance to the next phase — file signal in Claude mode, readline in terminal
async function advance(signalFile: string, terminalMsg: string): Promise<() => void> {
  if (USE_SIGNALS) {
    await waitForSignal(signalFile);
    return () => {};
  }
  const p = prompt(terminalMsg);
  await p.promise;
  return p.cancel;
}

// ── captured event types ───────────────────────────────────────────────────

interface RawClick {
  timestamp: number;
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  ariaLabel: string;
  tagName: string;
}

interface RawNav {
  timestamp: number;
  url: string;
}

// ── phase 1: setup (no recording) ─────────────────────────────────────────

async function setup(): Promise<{ storageState: Awaited<ReturnType<BrowserContext['storageState']>>; url: string }> {
  fs.mkdirSync(RECORDING_DIR, { recursive: true });

  console.log('\n┌─────────────────────────────────────────────────────────┐');
  console.log('│  🎭  Interactive Recorder  —  Phase 1: Setup            │');
  console.log('│  Browser is open. Log in and navigate to start page.    │');
  console.log('└─────────────────────────────────────────────────────────┘\n');

  if (USE_SIGNALS) {
    console.log(`  Signal files for this flow:`);
    console.log(`    Start recording:  touch ${SIGNAL_START}`);
    console.log(`    Stop recording:   touch ${SIGNAL_STOP}\n`);
    console.log(`  Waiting for start signal…\n`);
  }

  const browser = await chromium.launch({
    headless: false,
    args: ['--disable-infobars', '--no-default-browser-check'],
  });

  const ctx = await browser.newContext({ viewport: VIEWPORT });
  const page = await ctx.newPage();

  await page.goto(START_URL, { waitUntil: 'domcontentloaded' });

  await advance(SIGNAL_START, '\n  ✅  Ready to record?  Press ENTER to start  › ');

  const url          = page.url();
  const storageState = await ctx.storageState();

  await ctx.close();
  await browser.close();

  console.log(`\n  Session saved. Recording will start at: ${url}\n`);
  return { storageState, url };
}

// ── phase 2: record ────────────────────────────────────────────────────────

async function record(
  storageState: Awaited<ReturnType<BrowserContext['storageState']>>,
  startUrl: string,
): Promise<void> {
  console.log('┌─────────────────────────────────────────────────────────┐');
  console.log('│  Phase 2 — Recording                                    │');
  console.log('│  Perform your flow. Every click is captured.            │');
  if (USE_SIGNALS) {
  console.log(`│  Signal done:  touch ${SIGNAL_STOP.padEnd(33)}│`);
  } else {
  console.log('│  Press ENTER here when done.                            │');
  }
  console.log('└─────────────────────────────────────────────────────────┘\n');

  fs.mkdirSync(RECORDING_DIR, { recursive: true });

  const browser = await chromium.launch({
    headless: false,
    args: [
      '--disable-infobars',
      '--no-default-browser-check',
    ],
  });

  const ctx = await browser.newContext({
    viewport: VIEWPORT,
    storageState,
    recordVideo: { dir: RECORDING_DIR, size: VIEWPORT },
  });

  const page = await ctx.newPage();
  const rawClicks: RawClick[] = [];
  const rawNavs: RawNav[]     = [];

  // Expose callbacks that page JS can call
  await page.exposeFunction('__irClick', (e: RawClick)  => { rawClicks.push(e); });
  await page.exposeFunction('__irNav',   (e: RawNav)    => { rawNavs.push(e);   });

  // Injected before any page script runs — survives SPA navigations
  await page.addInitScript(() => {
    // ── click capture ────────────────────────────────────────────
    document.addEventListener(
      'click',
      function (ev: MouseEvent) {
        let el = ev.target as HTMLElement;

        // Walk up to a more meaningful ancestor if target is a tiny inline element
        for (let i = 0; i < 5 && el.parentElement; i++) {
          const r = el.getBoundingClientRect();
          if (r.width >= 16 && r.height >= 16) break;
          el = el.parentElement;
        }

        const r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) return; // invisible element

        const raw = ((el as HTMLElement).innerText || el.textContent || '')
          .replace(/\s+/g, ' ')
          .trim();

        (window as any).__irClick({
          timestamp: Date.now(),
          x:         Math.round(r.left),
          y:         Math.round(r.top),
          width:     Math.round(Math.min(r.width,  1800)),
          height:    Math.round(Math.min(r.height, 900)),
          text:      raw.slice(0, 80),
          ariaLabel: el.getAttribute('aria-label') || '',
          tagName:   el.tagName.toLowerCase(),
        });
      },
      true, // capture phase — fires before page handlers
    );

    // ── SPA navigation capture ───────────────────────────────────
    let _lastUrl = location.href;
    new MutationObserver(() => {
      if (location.href !== _lastUrl) {
        _lastUrl = location.href;
        (window as any).__irNav({ timestamp: Date.now(), url: location.href });
      }
    }).observe(document.documentElement, { subtree: true, childList: true });
  });

  await page.goto(startUrl, { waitUntil: 'domcontentloaded' });

  // Let the page fully settle before the clock starts
  await page.waitForTimeout(1000);
  const t0 = Date.now();
  console.log('  🔴  Recording!  Do your thing...\n');

  // Race: stop signal/Enter pressed OR user closes the browser window
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const browserClosedPromise = new Promise<void>(r => (page as any).once('close', r));
  const stopPromise = advance(SIGNAL_STOP, '  ⏹   Done?  Press ENTER to stop  › ');

  await Promise.race([stopPromise, browserClosedPromise]);

  const durationMs = Date.now() - t0;

  // Close gracefully to finalise the .webm
  await ctx.close().catch(() => {});
  await browser.close().catch(() => {});

  // ── rename raw video ──────────────────────────────────────────────────────
  const rawFiles = fs
    .readdirSync(RECORDING_DIR)
    .filter(f => f.endsWith('.webm') && f !== 'recording.webm');

  if (rawFiles.length === 0) {
    throw new Error(`No .webm found in ${RECORDING_DIR} — was recording started?`);
  }
  fs.renameSync(path.join(RECORDING_DIR, rawFiles[0]), VIDEO_FINAL);

  // ── merge + filter events ─────────────────────────────────────────────────

  type Step = {
    step: number;
    label: string;
    caption: string;
    startMs: number;
    interaction: 'click' | 'none';
    element: { selector: string; x: number; y: number; width: number; height: number } | null;
  };

  // Merge clicks and navs into a single timeline
  const timeline: Array<
    | ({ kind: 'click' } & RawClick)
    | ({ kind: 'nav'   } & RawNav)
  > = [
    ...rawClicks.map(c => ({ kind: 'click' as const, ...c })),
    ...rawNavs.map(n   => ({ kind: 'nav'   as const, ...n })),
  ].sort((a, b) => a.timestamp - b.timestamp);

  const steps: Step[] = [];

  for (let i = 0; i < timeline.length; i++) {
    const ev = timeline[i];
    const startMs = Math.max(0, ev.timestamp - t0);

    // Skip events before the clock started
    if (ev.timestamp < t0) continue;

    if (ev.kind === 'nav') {
      steps.push({
        step:        0,
        label:       `Navigate → ${new URL(ev.url).pathname.slice(0, 50)}`,
        caption:     '',
        startMs,
        interaction: 'none',
        element:     null,
      });
      continue;
    }

    // ── click filters ──────────────────────────────────────────────────────
    // Skip background clicks (element covers > 90 % of viewport in either axis)
    if (ev.width  > VIEWPORT.width  * 0.9) continue;
    if (ev.height > VIEWPORT.height * 0.9) continue;

    // Skip rapid successive clicks (double-clicks / accidental second click)
    const prev = timeline[i - 1];
    if (prev?.kind === 'click' && ev.timestamp - prev.timestamp < 200) continue;

    const label = (ev.ariaLabel || ev.text || `${ev.tagName} click`).slice(0, 60);

    steps.push({
      step:        0,
      label,
      caption:     '',
      startMs,
      interaction: 'click',
      element: {
        selector: 'captured',
        x:        ev.x,
        y:        ev.y,
        width:    ev.width,
        height:   ev.height,
      },
    });
  }

  // Re-number
  steps.forEach((s, i) => { s.step = i + 1; });

  // ── write manifest ────────────────────────────────────────────────────────

  const manifest = {
    flowSlug:        FLOW_SLUG,
    capturedAt:      new Date().toISOString(),
    recordingFile:   VIDEO_FINAL,
    videoDurationMs: durationMs,
    viewport:        VIEWPORT,
    steps,
  };

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));

  // ── summary ───────────────────────────────────────────────────────────────

  console.log('\n\n✅  Recording complete!\n');
  console.log(`   Video     ${VIDEO_FINAL}   (${(durationMs / 1000).toFixed(1)}s)`);
  console.log(`   Manifest  ${MANIFEST_PATH}`);
  console.log(`   Steps     ${steps.length} captured\n`);

  steps.forEach(s => {
    const t = (s.startMs / 1000).toFixed(2).padStart(7);
    const el = s.element
      ? `  [${s.element.x}, ${s.element.y}, ${s.element.width}×${s.element.height}]`
      : '';
    console.log(`   ${String(s.step).padStart(2)}.  ${t}s  ${s.label}${el}`);
  });

  console.log(`
Next step — run the skill with:

   Entry:    from-manifest
   Manifest: ${MANIFEST_PATH}
`);
}

// ── main ───────────────────────────────────────────────────────────────────

(async () => {
  try {
    const { storageState, url } = await setup();
    await record(storageState, url);
  } catch (err) {
    console.error('\n❌  Error:', (err as Error).message);
    process.exit(1);
  }
})();
