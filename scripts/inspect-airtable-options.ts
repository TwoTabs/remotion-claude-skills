// Open each combobox and dump the visible options so we can pick deterministic
// values for the recording flow.
import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

const SLUG = 'airtable-interface-filters';
const DIR  = path.join('public', 'recordings', SLUG);
const STORAGE = path.join(DIR, 'storage-state.json');
const START   = fs.readFileSync(path.join(DIR, 'start-url.txt'), 'utf8').trim();

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1600, height: 900 }, storageState: STORAGE });
  const page = await ctx.newPage();
  await page.goto(START, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(5000);

  const filters = ['Status', 'Urgency Level', 'Assigned Technician'];
  const result: Record<string, { x: number; y: number; w: number; h: number; options: string[] }> = {};

  for (const name of filters) {
    const trigger = page.locator(`button[role="combobox"][aria-label="${name}"]`).first();
    const box = await trigger.boundingBox();
    if (!box) { console.log(`No box for ${name}`); continue; }
    await trigger.click();
    await page.waitForTimeout(800);

    const options = await page.evaluate(() => {
      const out: string[] = [];
      // Look for any visible role=option or list items in popover
      document.querySelectorAll<HTMLElement>('[role="option"], [role="menuitem"], [role="listbox"] li, [role="dialog"] [role="checkbox"], [role="dialog"] li').forEach(el => {
        const t = (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim();
        if (t && t.length < 80) out.push(t);
      });
      return [...new Set(out)];
    });

    const screenshotPath = path.join(DIR, `inspect-options-${name.toLowerCase().replace(/\s+/g, '-')}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: false });

    result[name] = {
      x: Math.round(box.x), y: Math.round(box.y),
      w: Math.round(box.width), h: Math.round(box.height),
      options,
    };
    console.log(`\n${name} @[${result[name].x},${result[name].y} ${result[name].w}x${result[name].h}]`);
    options.forEach(o => console.log(`  - ${o}`));

    // close dropdown
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);
  }

  fs.writeFileSync(path.join(DIR, 'inspect-options.json'), JSON.stringify(result, null, 2));

  await ctx.close();
  await browser.close();
})();
