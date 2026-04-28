import { chromium } from '/srv/workspace/apostrophecms/talent-acquisition-demo-multisite/node_modules/playwright/index.mjs';
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
const page = await context.newPage();

const timings = [];
page.on('response', (r) => {
  if (r.url().includes('/rooms')) timings.push({ url: r.url(), status: r.status(), timing: r.timing?.() });
});

// Warm up
await page.goto('http://infraco.localhost:4321/rooms', { waitUntil: 'networkidle', timeout: 30000 });

// Now click filter chips and measure HTMX request response times
const results = [];
const chipSelectors = [
  ['roomType', 'villa'],
  ['roomType', 'suite'],
  ['view', 'ocean'],
  ['bedConfiguration', 'king']
];
for (const [name, value] of chipSelectors) {
  const pending = page.waitForResponse((r) => r.url().includes(`?${name}=${value}`) || r.url().endsWith(`${name}=${value}`));
  await page.evaluate(([n, v]) => {
    const chip = Array.from(document.querySelectorAll('.room-filter-chip')).find(
      (el) => el.getAttribute('hx-get')?.includes(`${n}=${v}`)
    );
    if (chip) chip.click();
  }, [name, value]);
  const resp = await pending;
  const t = resp.request().timing();
  results.push({ filter: `${name}=${value}`, url: resp.url().split('/').slice(-1)[0], ttfb_ms: (t.responseStart - t.requestStart).toFixed(1), total_ms: (t.responseEnd - t.requestStart).toFixed(1) });
  // Reset
  await page.evaluate(() => {
    const chip = Array.from(document.querySelectorAll('.room-filter-chip')).find((el) => el.textContent.trim() === 'All');
    if (chip) chip.click();
  });
  await page.waitForTimeout(300);
}
console.log(JSON.stringify(results, null, 2));
await browser.close();
