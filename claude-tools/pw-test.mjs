#!/usr/bin/env node
/**
 * Quick Playwright test: visits a URL, reports status, errors, screenshots.
 * Usage: node claude-tools/pw-test.mjs [URL] [--login] [--screenshot PATH]
 */
import { chromium } from 'playwright';

const args = process.argv.slice(2);
const doLogin = args.includes('--login');
const ssIdx = args.indexOf('--screenshot');
const ssPath = ssIdx !== -1 ? args[ssIdx + 1] : '/tmp/pw-test.png';
const url = args.find(a => a.startsWith('http')) || 'http://infraco.localhost:4321/';

const BACKEND = 'http://infraco.localhost:3000';

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
const page = await context.newPage();

const errors = [];
page.on('console', msg => { if (msg.type() === 'error') errors.push(`CONSOLE: ${msg.text()}`); });
page.on('pageerror', err => { errors.push(`PAGE: ${err.message}`); });

if (doLogin) {
  await page.goto(`${BACKEND}/login`, { waitUntil: 'load' });
  await page.waitForSelector('input[type="text"]', { timeout: 15000 });
  await (await page.$('input[type="text"]')).fill('admin');
  await (await page.$('input[type="password"]')).fill('tomtest1');
  await (await page.$('button[type="submit"], button')).click();
  await page.waitForTimeout(5000);
}

const resp = await page.goto(url, { waitUntil: 'load', timeout: 30000 }).catch(e => {
  console.log('Navigation error:', e.message);
  return null;
});

await page.waitForTimeout(2000);
console.log('URL:', page.url());
console.log('Status:', resp?.status());
console.log('Title:', await page.title());

const roomCount = await page.$$eval('.room-excerpt', els => els.length).catch(() => 0);
console.log('Room excerpts:', roomCount);

const bodyText = await page.textContent('body').catch(() => '');
if (bodyText.length < 200) {
  console.log('Body text:', bodyText.trim().substring(0, 500));
}

if (errors.length > 0) {
  console.log('\nErrors:');
  errors.forEach(e => console.log(' ', e));
}

await page.screenshot({ path: ssPath, fullPage: true });
console.log(`\nScreenshot: ${ssPath}`);

await browser.close();
