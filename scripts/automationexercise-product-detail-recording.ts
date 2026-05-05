// Run with: npx tsx scripts/automationexercise-product-detail-recording.ts
import { chromium } from 'playwright';
import { TutorialCaptureRecording } from './playwright-capture';
import * as fs from 'fs';
import * as path from 'path';

const FLOW_SLUG = 'automationexercise-product-detail';
const APP_URL   = 'https://automationexercise.com/';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: {
      dir: `public/recordings/${FLOW_SLUG}/`,
      size: { width: 1920, height: 1080 },
    },
  });

  // Block ad / analytics iframes — they cover real elements and steal clicks.
  await context.route('**/*', (route) => {
    const u = route.request().url();
    if (
      u.includes('googlesyndication') ||
      u.includes('googletagmanager') ||
      u.includes('google-analytics') ||
      u.includes('doubleclick') ||
      u.includes('adsystem') ||
      u.includes('adservice')
    ) return route.abort();
    return route.continue();
  });

  const page    = await context.newPage();
  const capture = new TutorialCaptureRecording(page, FLOW_SLUG);

  await page.goto(APP_URL);
  await page.waitForLoadState('domcontentloaded');
  await page.waitForSelector('header#header', { timeout: 15000 });
  // Wait for hero carousel image to render so the home page screenshot is settled.
  await page.waitForSelector('#slider-carousel', { timeout: 15000 });
  await page.waitForTimeout(1500);

  capture.start();

  // ── Step 1: home page orientation ───────────────────────────────────
  await capture.mark(
    'Home page',
    'AutomationExercise — let’s open the catalog and inspect a product.',
    '#slider-carousel',
  );
  await page.waitForTimeout(3500);

  // ── Step 2: highlight Products nav before click ─────────────────────
  await capture.mark(
    'Products nav link',
    'The top nav links to every section of the site.',
    'header a[href="/products"]',
  );
  await page.waitForTimeout(2800);

  // ── Step 3: click Products ──────────────────────────────────────────
  await capture.click(
    'header a[href="/products"]',
    'Open Products',
    'Click Products to see the full catalog.',
  );
  await page.waitForLoadState('domcontentloaded');
  await page.waitForSelector('.features_items', { timeout: 15000 });
  await page.waitForTimeout(1800);

  // ── Step 4: All Products page header ────────────────────────────────
  await capture.mark(
    'All Products page',
    'You’re on the All Products page — every item in the catalog.',
    '.features_items .title',
  );
  await page.waitForTimeout(3200);

  // ── Step 5: products grid ───────────────────────────────────────────
  await capture.mark(
    'Products list',
    'Each card shows a thumbnail, name, and price.',
    '.features_items .product-image-wrapper',
  );
  await page.waitForTimeout(3200);

  // ── Step 6: click View Product on the first item ────────────────────
  await capture.click(
    'a:has-text("View Product")',
    'View first product',
    'Click "View Product" on the first item.',
  );
  await page.waitForLoadState('domcontentloaded');
  await page.waitForSelector('.product-information', { timeout: 15000 });
  await page.waitForTimeout(2000);

  // ── Step 7: product detail overview ─────────────────────────────────
  await capture.mark(
    'Product detail page',
    'You’re now on the product detail page.',
    '.product-information',
  );
  await page.waitForTimeout(3200);

  // ── Step 8: product name ────────────────────────────────────────────
  await capture.mark(
    'Product name',
    'Name appears as the page heading.',
    '.product-information h2',
  );
  await page.waitForTimeout(2800);

  // ── Step 9: category ────────────────────────────────────────────────
  await capture.mark(
    'Category',
    'Category — e.g. Women › Tops.',
    '.product-information p:has-text("Category")',
  );
  await page.waitForTimeout(2800);

  // ── Step 10: price ──────────────────────────────────────────────────
  await capture.mark(
    'Price',
    'Price in rupees, just below the name.',
    '.product-information span span',
  );
  await page.waitForTimeout(2800);

  // ── Step 11: availability ───────────────────────────────────────────
  await capture.mark(
    'Availability',
    'Availability — In Stock when ready to ship.',
    '.product-information p:has-text("Availability")',
  );
  await page.waitForTimeout(2800);

  // ── Step 12: condition ──────────────────────────────────────────────
  await capture.mark(
    'Condition',
    'Condition tells you New vs. Used.',
    '.product-information p:has-text("Condition")',
  );
  await page.waitForTimeout(2800);

  // ── Step 13: brand ──────────────────────────────────────────────────
  await capture.mark(
    'Brand',
    'And finally, the brand.',
    '.product-information p:has-text("Brand")',
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
