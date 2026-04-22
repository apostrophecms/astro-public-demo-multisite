#!/usr/bin/env node
/**
 * Log in, open the Styles modal via admin bar, and verify
 * the configured groups render.
 */
import { chromium } from '/srv/workspace/apostrophecms/talent-acquisition-demo-multisite/node_modules/playwright/index.mjs';

const BACKEND = 'http://infraco.localhost:3000';
const FRONTEND = 'http://infraco.localhost:4321/';

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext();
const page = await ctx.newPage();

const errors = [];
page.on('pageerror', (e) => errors.push(`PAGE: ${e.message}`));
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(`CONSOLE: ${msg.text()}`);
});

// Log in
await page.goto(`${BACKEND}/login`, { waitUntil: 'load' });
await page.fill('input[type="text"]', 'admin');
await page.fill('input[type="password"]', 'tomtest1');
await page.click('button[type="submit"], button');
await page.waitForTimeout(3000);

// Visit frontend in edit mode
await page.goto(FRONTEND, { waitUntil: 'load', timeout: 30000 });
await page.waitForTimeout(4000);

// Find the Styles palette context utility in the admin bar
const paletteButton = await page.$('[data-apos-icon="palette-icon"], [data-apos-test="context-util:@apostrophecms/styles"], button:has-text("Styles")');
console.log('Palette button visible:', !!paletteButton);

await page.screenshot({ path: '/tmp/styles-admin.png', fullPage: true });

if (paletteButton) {
  await paletteButton.click().catch(() => {});
  await page.waitForTimeout(1500);
  const modalText = await page.textContent('body').catch(() => '');
  const groups = [ 'Palette', 'Typography', 'Layout', 'Brand', 'Text', 'Surfaces', 'Navigation', 'Fonts', 'Rhythm' ];
  const seen = groups.filter((g) => modalText.includes(g));
  console.log('Groups seen in body after click:', seen);
  await page.screenshot({ path: '/tmp/styles-modal.png', fullPage: true });
}

if (errors.length) {
  console.log('\nErrors:');
  errors.forEach((e) => console.log(' ', e));
}

await browser.close();
