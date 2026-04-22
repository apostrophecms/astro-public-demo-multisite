#!/usr/bin/env node

/**
 * Populate the global doc's footer area with a 3-column layout widget
 * (brand column, Explore links, Legal links). Idempotent: running twice
 * overwrites the previous footer with a fresh copy.
 *
 * Usage:
 *   node scripts/populate-footer.mjs [--base-url http://infraco.localhost:3000]
 */

import { randomBytes } from 'node:crypto';

function parseArgs(argv) {
  const args = {
    baseUrl: 'http://infraco.localhost:3000',
    apiKey: process.env.APOS_API_KEY || 'myapikey'
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--base-url') args.baseUrl = argv[++i];
    else if (a === '--api-key') args.apiKey = argv[++i];
  }
  return args;
}

function id() {
  return `cl_${randomBytes(8).toString('hex')}`;
}

function rtWidget(html) {
  return {
    _id: id(),
    metaType: 'widget',
    type: '@apostrophecms/rich-text',
    content: html
  };
}

function area(items) {
  return {
    _id: id(),
    metaType: 'area',
    items
  };
}

function column(colstart, colspan, order, widgets) {
  return {
    _id: id(),
    metaType: 'widget',
    type: '@apostrophecms/layout-column',
    colstart,
    colspan,
    rowstart: 1,
    rowspan: 1,
    order,
    showTablet: true,
    showMobile: true,
    content: area(widgets)
  };
}

function layoutWidget(columns) {
  return {
    _id: id(),
    metaType: 'widget',
    type: '@apostrophecms/layout',
    columns: area(columns)
  };
}

async function request(baseUrl, apiKey, path, init = {}) {
  const res = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      Authorization: `ApiKey ${apiKey}`,
      'Content-Type': 'application/json',
      ...(init.headers || {})
    }
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`${init.method || 'GET'} ${path} → ${res.status}: ${body}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

async function main() {
  const { baseUrl, apiKey } = parseArgs(process.argv.slice(2));
  const base = baseUrl.replace(/\/$/, '');

  const global = await request(base, apiKey, '/api/v1/@apostrophecms/global');
  const doc = global?.results?.[0] || global;
  if (!doc?._id) throw new Error('Could not find the global doc');
  const companyName = doc.companyName || doc.siteTitle || 'Our Hotel';

  const footer = area([
    layoutWidget([
      column(1, 4, 0, [
        rtWidget(`<h4>${companyName}</h4><p>Stay longer. Rest easier. Let us take care of the details so your trip stays unforgettable.</p>`)
      ]),
      column(5, 4, 1, [
        rtWidget('<h4>Explore</h4><p><a href="/">Home</a></p><p><a href="/rooms">Rooms &amp; suites</a></p><p><a href="/">Offers</a></p><p><a href="/">Contact</a></p>')
      ]),
      column(9, 4, 2, [
        rtWidget('<h4>Visit</h4><p>123 Seaside Boulevard<br>Reservations: +1 555 0199<br><a href="mailto:hello@example.com">hello@example.com</a></p>')
      ])
    ])
  ]);

  const draftId = doc._id.replace(/:published$/, ':draft');
  await request(base, apiKey, `/api/v1/@apostrophecms/global/${draftId}`, {
    method: 'PATCH',
    body: JSON.stringify({ footer })
  });
  await request(base, apiKey, `/api/v1/@apostrophecms/global/${draftId}/publish`, {
    method: 'POST',
    body: JSON.stringify({})
  });
  console.log(`Footer populated for ${companyName} at ${base}`);
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
