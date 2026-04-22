#!/usr/bin/env node
/**
 * Set --background-color via DevTools at :root and see what the body
 * computed background-color reports. This confirms whether the CSS var
 * cascade actually reaches body on the logged-out home page.
 */
import { chromium } from '/srv/workspace/apostrophecms/talent-acquisition-demo-multisite/node_modules/playwright/index.mjs';

const HOME = 'http://infraco.localhost:4321/';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.goto(HOME, { waitUntil: 'load' });
await page.waitForTimeout(1000);

const result = await page.evaluate(() => {
  const bodyBg = () => getComputedStyle(document.body).backgroundColor;
  const rootBg = () => getComputedStyle(document.documentElement).getPropertyValue('--background-color');
  const out = { default: { body: bodyBg(), rootVar: rootBg() } };
  document.documentElement.style.setProperty('--background-color', 'lime');
  out.afterLimeAtRoot = { body: bodyBg(), rootVar: rootBg() };
  document.documentElement.style.removeProperty('--background-color');

  // Is there any element with its own background beating the body?
  const all = Array.from(document.querySelectorAll('body *'));
  const whiteBgs = all
    .filter(el => {
      const s = getComputedStyle(el);
      return /rgb\(255,\s*255,\s*255\)|rgba\(255,\s*255,\s*255,\s*1\)/.test(s.backgroundColor);
    })
    .slice(0, 10)
    .map(el => `${el.tagName}.${el.className}`.slice(0, 80));
  out.whiteElements = whiteBgs;
  return out;
});
console.log(JSON.stringify(result, null, 2));
await browser.close();
