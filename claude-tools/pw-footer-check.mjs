#!/usr/bin/env node
/**
 * Hit the home page and inspect the rendered footer.
 */
import { chromium } from '/srv/workspace/apostrophecms/talent-acquisition-demo-multisite/node_modules/playwright/index.mjs';

const HOME = 'http://infraco.localhost:4321/';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.goto(HOME, { waitUntil: 'load' });
await page.waitForTimeout(1500);

const data = await page.evaluate(() => {
  const footer = document.querySelector('footer.footer');
  if (!footer) return { found: false };
  const headings = Array.from(footer.querySelectorAll('h1,h2,h3,h4,h5,h6')).map(h => h.textContent.trim());
  const links = Array.from(footer.querySelectorAll('a')).slice(0, 20).map(a => ({ href: a.getAttribute('href'), text: a.textContent.trim() }));
  const textSample = footer.textContent.replace(/\s+/g, ' ').trim().slice(0, 500);
  const layoutWidgets = footer.querySelectorAll('.apos-layout-widget, [data-layout-widget], [class*="apos-layout"]').length;
  return { found: true, headings, links, layoutWidgets, textSample };
});
console.log(JSON.stringify(data, null, 2));
await browser.close();
