// scripts/recording-setup.ts
// Usage: npx tsx scripts/recording-setup.ts <flow-slug> <start-url>
//
// Drive from chat: touch public/recordings/<flow-slug>/.ir-start once the user
// confirms they're on the correct starting page (logged in, modals dismissed, etc).
//
// Env: IR_WIDTH / IR_HEIGHT to override viewport (default 1920x1080).

import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

const [, , FLOW_SLUG, START_URL] = process.argv;
if (!FLOW_SLUG || !START_URL) {
  console.error('\nUsage: npx tsx scripts/recording-setup.ts <flow-slug> <start-url>\n');
  process.exit(1);
}

const RECORDING_DIR  = path.join('public', 'recordings', FLOW_SLUG);
const STORAGE_PATH   = path.join(RECORDING_DIR, 'storage-state.json');
const START_URL_PATH = path.join(RECORDING_DIR, 'start-url.txt');
const SIGNAL_START   = path.join(RECORDING_DIR, '.ir-start');
const VIEWPORT       = {
  width:  parseInt(process.env.IR_WIDTH  || '1920', 10),
  height: parseInt(process.env.IR_HEIGHT || '1080', 10),
} as const;

function waitForSignal(): Promise<void> {
  fs.mkdirSync(RECORDING_DIR, { recursive: true });
  if (fs.existsSync(SIGNAL_START)) fs.unlinkSync(SIGNAL_START);

  if (process.stdin.isTTY) {
    return new Promise(resolve => {
      const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
      process.stdout.write('\n  On the correct starting page? Press ENTER › ');
      rl.once('line', () => { rl.close(); resolve(); });
    });
  }

  return new Promise(resolve => {
    const interval = setInterval(() => {
      if (fs.existsSync(SIGNAL_START)) {
        fs.unlinkSync(SIGNAL_START);
        clearInterval(interval);
        resolve();
      }
    }, 250);
  });
}

(async () => {
  console.log('\n┌──────────────────────────────────────────────────────────┐');
  console.log('│  🎭  Setup Phase — confirm starting page                 │');
  console.log('│  Browser is open. Log in, dismiss banners, navigate to   │');
  console.log('│  the exact page where the recording should begin.        │');
  console.log('└──────────────────────────────────────────────────────────┘\n');
  console.log(`  Viewport: ${VIEWPORT.width}x${VIEWPORT.height}`);
  console.log(`  Signal (non-TTY): touch ${SIGNAL_START}\n`);

  const browser = await chromium.launch({
    headless: false,
    args: ['--disable-infobars', '--no-default-browser-check'],
  });
  const ctx  = await browser.newContext({ viewport: VIEWPORT });
  const page = await ctx.newPage();
  await page.goto(START_URL, { waitUntil: 'domcontentloaded' });

  await waitForSignal();

  const finalUrl     = page.url();
  const storageState = await ctx.storageState();
  fs.mkdirSync(RECORDING_DIR, { recursive: true });
  fs.writeFileSync(STORAGE_PATH,   JSON.stringify(storageState, null, 2));
  fs.writeFileSync(START_URL_PATH, finalUrl);

  await ctx.close();
  await browser.close();

  console.log(`\n✅ Setup complete`);
  console.log(`   Start URL     ${finalUrl}`);
  console.log(`   Storage state ${STORAGE_PATH}\n`);
})();
