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

// Screenshot unfiltered
console.log('Testing unfiltered page...');
await page.goto(BASE, { waitUntil: 'load', timeout: 30000 });
await page.waitForTimeout(2000);
await page.screenshot({ path: '/tmp/jobs-unfiltered.png', fullPage: true });

// Screenshot filtered
console.log('Testing filtered page (Engineering + Remote)...');
await page.goto(`${BASE}/?team=Engineering&locationType=remote`, { waitUntil: 'load', timeout: 30000 });
await page.waitForTimeout(2000);
await page.screenshot({ path: '/tmp/jobs-filtered.png', fullPage: true });

await browser.close();
console.log('Done. Screenshots: /tmp/jobs-unfiltered.png, /tmp/jobs-filtered.png');
