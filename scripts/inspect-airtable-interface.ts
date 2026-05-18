// One-off probe: load the Airtable interface with saved storage state, dump
// the structure of visible filter / input / dropdown controls so we can write
// a deterministic recording script.
import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

const SLUG = 'airtable-interface-filters';
const DIR  = path.join('public', 'recordings', SLUG);
const STORAGE = path.join(DIR, 'storage-state.json');
const START   = fs.readFileSync(path.join(DIR, 'start-url.txt'), 'utf8').trim();

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    viewport: { width: 1600, height: 900 },
    storageState: STORAGE,
  });
  const page = await ctx.newPage();
  await page.goto(START, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(5000); // let interface render

  // Take a screenshot for visual reference
  await page.screenshot({ path: path.join(DIR, 'inspect-initial.png'), fullPage: false });

  // Dump everything that looks like an input / button / dropdown / filter trigger
  const candidates = await page.evaluate(() => {
    const out: { tag: string; role: string | null; text: string; aria: string | null; ph: string | null; testid: string | null; rect: { x: number; y: number; w: number; h: number } }[] = [];
    const selector = 'button, input, select, [role="button"], [role="combobox"], [role="listbox"], [role="textbox"], [role="searchbox"], [role="menuitem"], [data-testid]';
    document.querySelectorAll<HTMLElement>(selector).forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      if (r.bottom < 0 || r.top > 900) return;
      const text = (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 60);
      out.push({
        tag: el.tagName.toLowerCase(),
        role: el.getAttribute('role'),
        text,
        aria: el.getAttribute('aria-label'),
        ph: el.getAttribute('placeholder'),
        testid: el.getAttribute('data-testid'),
        rect: { x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) },
      });
    });
    return out;
  });

  fs.writeFileSync(path.join(DIR, 'inspect-candidates.json'), JSON.stringify(candidates, null, 2));
  console.log(`Found ${candidates.length} interactive candidates`);
  console.log(`Screenshot → ${path.join(DIR, 'inspect-initial.png')}`);
  console.log(`Candidates → ${path.join(DIR, 'inspect-candidates.json')}`);

  await ctx.close();
  await browser.close();
})();
