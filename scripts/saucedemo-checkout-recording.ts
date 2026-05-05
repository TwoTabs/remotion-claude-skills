// Run with: npx tsx scripts/saucedemo-checkout-recording.ts
import { chromium } from 'playwright';
import { TutorialCaptureRecording } from './playwright-capture';
import * as fs from 'fs';
import * as path from 'path';

const FLOW_SLUG = 'saucedemo-checkout';
const APP_URL   = 'https://www.saucedemo.com';

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
  await page.waitForSelector('[data-test="username"]', { timeout: 10000 });
  await page.waitForTimeout(1000);

  capture.start();

  // ── Step 1: orientation ─────────────────────────────────────────────
  await capture.mark(
    'Login screen',
    'Sauce Demo — a sample e-commerce site. Let’s log in and place an order.',
    '[data-test="login-container"]',
  );
  await page.waitForTimeout(3500);

  // ── Step 2: type username ───────────────────────────────────────────
  await page.locator('[data-test="username"]').focus();
  await capture.fill(
    '[data-test="username"]',
    'standard_user',
    'Username',
    'Enter the standard user — the demo lists every test account on the page.',
  );
  await page.waitForTimeout(2200);

  // ── Step 3: type password ───────────────────────────────────────────
  await capture.fill(
    '[data-test="password"]',
    'secret_sauce',
    'Password',
    'And the shared password.',
  );
  await page.waitForTimeout(2000);

  // ── Step 4: submit login ────────────────────────────────────────────
  await capture.click(
    '[data-test="login-button"]',
    'Submit login',
    'Click Login to enter the store.',
  );
  await page.waitForLoadState('domcontentloaded');
  await page.waitForSelector('[data-test="inventory-list"]', { timeout: 10000 });
  await page.waitForTimeout(1800);

  // ── Step 5: inventory landing ───────────────────────────────────────
  await capture.mark(
    'Inventory page',
    'Six products. They’re sorted A-Z by default.',
    '[data-test="inventory-list"]',
  );
  await page.waitForTimeout(3200);

  // ── Step 6: sort price low→high ─────────────────────────────────────
  await capture.select(
    '[data-test="product-sort-container"]',
    'lohi',
    'Sort price low→high',
    'Re-sort by price, lowest first.',
  );
  await page.waitForTimeout(1800);

  // ── Step 7: show sorted result ──────────────────────────────────────
  await capture.mark(
    'Sorted result',
    'The Onesie at $7.99 is now the cheapest item.',
    '[data-test="inventory-item"]',
    0,
  );
  await page.waitForTimeout(3000);

  // ── Step 8: add cheapest to cart ────────────────────────────────────
  await capture.click(
    '[data-test="add-to-cart-sauce-labs-onesie"]',
    'Add Onesie',
    'Add the cheapest item to the cart.',
  );
  await page.waitForTimeout(2000);

  // ── Step 9: add second item ─────────────────────────────────────────
  await capture.click(
    '[data-test="add-to-cart-sauce-labs-bike-light"]',
    'Add Bike Light',
    'Add a second item — the cart badge updates to 2.',
  );
  await page.waitForTimeout(2400);

  // ── Step 10: open the cart ──────────────────────────────────────────
  await capture.click(
    '[data-test="shopping-cart-link"]',
    'Open cart',
    'Click the cart icon to review the order.',
  );
  await page.waitForLoadState('domcontentloaded');
  await page.waitForSelector('[data-test="cart-list"]', { timeout: 10000 });
  await page.waitForTimeout(2000);

  // ── Step 11: cart contents ──────────────────────────────────────────
  await capture.mark(
    'Cart contents',
    'Both items are here. Time to check out.',
    '[data-test="cart-list"]',
  );
  await page.waitForTimeout(3000);

  // ── Step 12: checkout button ────────────────────────────────────────
  await capture.click(
    '[data-test="checkout"]',
    'Checkout',
    'Click Checkout to enter shipping details.',
  );
  await page.waitForLoadState('domcontentloaded');
  await page.waitForSelector('[data-test="firstName"]', { timeout: 10000 });
  await page.waitForTimeout(1500);

  // ── Step 13: fill first name ────────────────────────────────────────
  await capture.fill(
    '[data-test="firstName"]',
    'Wyn',
    'First name',
    'Fill in shipping details — first name…',
  );
  await page.waitForTimeout(1400);

  // ── Step 14: fill last name ─────────────────────────────────────────
  await capture.fill(
    '[data-test="lastName"]',
    'Tester',
    'Last name',
    '…last name…',
  );
  await page.waitForTimeout(1300);

  // ── Step 15: fill postal code ───────────────────────────────────────
  await capture.fill(
    '[data-test="postalCode"]',
    '94103',
    'Postal code',
    '…and zip.',
  );
  await page.waitForTimeout(1800);

  // ── Step 16: continue to overview ───────────────────────────────────
  await capture.click(
    '[data-test="continue"]',
    'Continue',
    'Continue to the order overview.',
  );
  await page.waitForLoadState('domcontentloaded');
  await page.waitForSelector('[data-test="finish"]', { timeout: 10000 });
  await page.waitForTimeout(2200);

  // ── Step 17: review totals ──────────────────────────────────────────
  await capture.mark(
    'Order summary',
    'Subtotal, tax and total appear before you confirm.',
    '[data-test="summary-info"]',
  );
  await page.waitForTimeout(3500);

  // ── Step 18: finish ─────────────────────────────────────────────────
  await capture.click(
    '[data-test="finish"]',
    'Finish order',
    'Click Finish to place the order.',
  );
  await page.waitForLoadState('domcontentloaded');
  await page.waitForSelector('[data-test="complete-header"]', { timeout: 10000 });
  await page.waitForTimeout(1800);

  // ── Step 19: order complete ─────────────────────────────────────────
  await capture.mark(
    'Order complete',
    'Thank you for your order — flow done.',
    '[data-test="complete-header"]',
  );
  await page.waitForTimeout(3500);

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
