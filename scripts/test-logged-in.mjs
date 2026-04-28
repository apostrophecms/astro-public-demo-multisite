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

// Visit homepage, then rooms index
console.log('Loading rooms page...');
await page.goto(`${BASE}/rooms`, { waitUntil: 'load', timeout: 30000 });
await page.waitForTimeout(3000);

const htmxLoaded = await page.evaluate(() => typeof window.htmx !== 'undefined');
console.log('HTMX loaded:', htmxLoaded);

await page.evaluate(() => {
  document.body.setAttribute('data-htmx-test', 'alive');
});

await page.evaluate(() => {
  window._htmxEvents = [];
  document.body.addEventListener('htmx:beforeRequest', () => window._htmxEvents.push('beforeRequest'));
  document.body.addEventListener('htmx:afterSwap', () => window._htmxEvents.push('afterSwap'));
  document.body.addEventListener('htmx:swapError', (e) => window._htmxEvents.push('swapError: ' + e.detail?.error));
  document.body.addEventListener('htmx:responseError', (e) => window._htmxEvents.push('responseError: ' + e.detail?.xhr?.status));
});

// Click the first room-type filter chip that isn't "All"
console.log('\n--- Clicking a room-type filter ---');
const chip = await page.$('.room-filter:has(.room-filter-label:has-text("Room Type")) .room-filter-chip:not(.active)');
if (chip) {
  const attrs = await chip.evaluate((el) => ({
    hxGet: el.getAttribute('hx-get'),
    hxTarget: el.getAttribute('hx-target'),
    hxSelect: el.getAttribute('hx-select'),
    hxSwap: el.getAttribute('hx-swap'),
    hxPushUrl: el.getAttribute('hx-push-url'),
    href: el.getAttribute('href'),
    text: el.textContent.trim()
  }));
  console.log('Chip attributes:', JSON.stringify(attrs, null, 2));

  await chip.click();
  await page.waitForTimeout(3000);

  const markerAlive = await page.evaluate(() => document.body.getAttribute('data-htmx-test') === 'alive');
  console.log('DOM marker survived (no full reload):', markerAlive);

  const events = await page.evaluate(() => window._htmxEvents || []);
  console.log('HTMX events:', events);

  const url = page.url();
  console.log('Current URL:', url);

  const rooms = await page.$$eval('.room-excerpt__title a', (els) => els.map((e) => e.textContent.trim()));
  console.log(`Rooms after filter: ${rooms.length}`);

  await page.screenshot({ path: '/tmp/htmx-test.png', fullPage: true });
}

await browser.close();
console.log('\nDone.');
