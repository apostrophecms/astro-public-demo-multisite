#!/usr/bin/env node
import { chromium } from '/srv/workspace/apostrophecms/talent-acquisition-demo-multisite/node_modules/playwright/index.mjs';

const BACKEND = 'http://infraco.localhost:3000';
const HOME = 'http://infraco.localhost:4321/';

async function capture(ctx, loggedIn) {
  const page = await ctx.newPage();
  if (loggedIn) {
    await page.goto(`${BACKEND}/login`, { waitUntil: 'load' });
    await page.fill('input[type="text"]', 'admin');
    await page.fill('input[type="password"]', 'tomtest1');
    await page.click('button[type="submit"], button');
    await page.waitForTimeout(3000);
  }
  await page.goto(HOME, { waitUntil: 'load', timeout: 30000 });
  await page.waitForTimeout(2000);

  const out = await page.evaluate(() => {
    const style = document.getElementById('apos-styles-stylesheet');
    const linkTags = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
      .map(l => l.href);
    return {
      styleContent: style ? style.textContent.slice(0, 800) : null,
      styleInnerHTML: style ? style.innerHTML.slice(0, 800) : null,
      linkTags: linkTags.filter(h => h.includes('stylesheet') || h.includes('apos'))
    };
  });
  await page.close();
  return out;
}

const browser = await chromium.launch({ headless: true });
const ctxOut = await browser.newContext();
const ctxIn = await browser.newContext();

const outView = await capture(ctxOut, false);
const inView = await capture(ctxIn, true);

console.log('LOGGED OUT =====');
console.log(JSON.stringify(outView, null, 2));
console.log('\nLOGGED IN ======');
console.log(JSON.stringify(inView, null, 2));

await browser.close();
