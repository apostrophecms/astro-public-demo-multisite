import { chromium } from 'playwright';

const BASE = 'http://infraco.localhost:4321';
const BACKEND = 'http://infraco.localhost:3000';

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
const page = await context.newPage();

// Log in
console.log('Logging in...');
await page.goto(`${BACKEND}/login`, { waitUntil: 'load' });
await page.waitForSelector('input[type="text"]', { timeout: 15000 });
await (await page.$('input[type="text"]')).fill('admin');
await (await page.$('input[type="password"]')).fill('tomtest1');
await (await page.$('button[type="submit"], button')).click();
await page.waitForTimeout(5000);

// Visit homepage
console.log('Loading job board...');
await page.goto(BASE, { waitUntil: 'load', timeout: 30000 });
await page.waitForTimeout(3000);

const htmxLoaded = await page.evaluate(() => typeof window.htmx !== 'undefined');
console.log('HTMX loaded:', htmxLoaded);

// Mark the DOM to detect full-page reload
await page.evaluate(() => {
  document.body.setAttribute('data-htmx-test', 'alive');
});

// Listen for HTMX events
await page.evaluate(() => {
  window._htmxEvents = [];
  document.body.addEventListener('htmx:beforeRequest', () => window._htmxEvents.push('beforeRequest'));
  document.body.addEventListener('htmx:afterSwap', () => window._htmxEvents.push('afterSwap'));
  document.body.addEventListener('htmx:swapError', (e) => window._htmxEvents.push('swapError: ' + e.detail?.error));
  document.body.addEventListener('htmx:responseError', (e) => window._htmxEvents.push('responseError: ' + e.detail?.xhr?.status));
});

// Click the "Engineering" filter chip
console.log('\n--- Clicking Engineering filter ---');
const chip = await page.$('a.job-filter-chip:has-text("Engineering")');
if (chip) {
  // Check its htmx attributes
  const attrs = await chip.evaluate(el => ({
    hxGet: el.getAttribute('hx-get'),
    hxTarget: el.getAttribute('hx-target'),
    hxSelect: el.getAttribute('hx-select'),
    hxSwap: el.getAttribute('hx-swap'),
    hxPushUrl: el.getAttribute('hx-push-url'),
    href: el.getAttribute('href')
  }));
  console.log('Chip attributes:', JSON.stringify(attrs, null, 2));

  await chip.click();
  await page.waitForTimeout(3000);

  // Check if our marker survived (= no full reload)
  const markerAlive = await page.evaluate(() => document.body.getAttribute('data-htmx-test') === 'alive');
  console.log('DOM marker survived (no full reload):', markerAlive);

  // Check htmx events
  const events = await page.evaluate(() => window._htmxEvents || []);
  console.log('HTMX events:', events);

  const url = page.url();
  console.log('Current URL:', url);

  const jobs = await page.$$eval('.job-excerpt-title a', els => els.map(e => e.textContent.trim()));
  console.log(`Jobs after filter: ${jobs.length}`);

  await page.screenshot({ path: '/tmp/htmx-test.png', fullPage: true });
}

await browser.close();
console.log('\nDone.');
