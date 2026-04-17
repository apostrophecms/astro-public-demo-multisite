import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
const page = await context.newPage();

await page.goto('http://infraco.localhost:3000/login', { waitUntil: 'load' });
await page.waitForSelector('input[type="text"]', { timeout: 15000 });
await (await page.$('input[type="text"]')).fill('admin');
await (await page.$('input[type="password"]')).fill('tomtest1');
await (await page.$('button[type="submit"], button')).click();
await page.waitForTimeout(5000);

await page.goto('http://infraco.localhost:4321/', { waitUntil: 'load', timeout: 30000 });
await page.waitForTimeout(3000);

const editBtn = await page.$('button:has-text("Edit")');
if (editBtn) await editBtn.click();
await page.waitForTimeout(8000);

const info = await page.evaluate(() => ({
  ne: document.querySelectorAll('[data-apos-area-newly-editable]').length,
  init: document.querySelectorAll('[data-apos-area]').length,
}));
console.log('Index page after Edit:', JSON.stringify(info));

// Hover over the "More rich text" area to check for editing UI
const richText = await page.$('h2:has-text("More rich text")');
if (richText) {
  await richText.hover();
  await page.waitForTimeout(2000);
}

await page.screenshot({ path: '/tmp/index-edit-fixed.png', fullPage: true });
await browser.close();
