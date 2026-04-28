#!/usr/bin/env node
/**
 * Compare computed heading font-family when logged in vs logged out.
 */
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
  await page.waitForTimeout(3000);

  const result = await page.evaluate(() => {
    const h2 = document.querySelector('.hero-widget__content h2');
    const h3 = document.querySelector('.hero-widget__content h3');
    const h1 = document.querySelector('h1');
    const rootStyle = getComputedStyle(document.documentElement);
    const bodyStyle = getComputedStyle(document.body);
    return {
      heroH2Font: h2 ? getComputedStyle(h2).fontFamily : null,
      heroH2Class: h2 ? h2.className : null,
      heroH2Tag: h2 ? h2.outerHTML.slice(0, 120) : null,
      heroH3Font: h3 ? getComputedStyle(h3).fontFamily : null,
      firstH1Font: h1 ? getComputedStyle(h1).fontFamily : null,
      firstH1Class: h1 ? h1.className : null,
      rootHeadingFontVar: rootStyle.getPropertyValue('--heading-font'),
      bodyFont: bodyStyle.fontFamily
    };
  });
  await page.close();
  return result;
}

const browser = await chromium.launch({ headless: true });
const ctxOut = await browser.newContext();
const ctxIn = await browser.newContext();

const outResult = await capture(ctxOut, false);
const inResult = await capture(ctxIn, true);

console.log('Logged OUT:', JSON.stringify(outResult, null, 2));
console.log('Logged IN: ', JSON.stringify(inResult, null, 2));

await browser.close();
