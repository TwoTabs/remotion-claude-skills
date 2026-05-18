// Probe just the Assigned Technician dropdown — selector by visible text.
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

  const trigger = page.locator('button[role="combobox"]').nth(2);
  const box = await trigger.boundingBox();
  await trigger.click();
  await page.waitForTimeout(800);

  const options = await page.evaluate(() => {
    const out: string[] = [];
    document.querySelectorAll<HTMLElement>('[role="option"], [role="menuitem"], [role="listbox"] li, [role="dialog"] li').forEach(el => {
      const t = (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim();
      if (t && t.length < 80) out.push(t);
    });
    return [...new Set(out)];
  });

  console.log(`Assigned Technician @[${Math.round(box!.x)},${Math.round(box!.y)} ${Math.round(box!.width)}x${Math.round(box!.height)}]`);
  options.forEach(o => console.log(`  - ${o}`));

  await page.screenshot({ path: path.join(DIR, 'inspect-options-tech.png') });
  await ctx.close();
  await browser.close();
})();
