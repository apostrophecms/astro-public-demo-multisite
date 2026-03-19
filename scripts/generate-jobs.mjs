#!/usr/bin/env node

/**
 * Load job fixtures into ApostropheCMS via the REST API.
 *
 * Usage: node scripts/generate-jobs.mjs [APOS_BASE_URL]
 *
 * Reads JSON files from fixtures/jobs/ and POSTs each to the job piece API.
 * The ApostropheCMS API key defaults to 'myapikey' (from @apostrophecms/express config).
 */

import { readdir, readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const FIXTURES_DIR = join(__dirname, '..', 'fixtures', 'jobs');
const APOS_BASE = process.argv[2] || process.env.APOS_BASE_URL || 'http://localhost:3000';
const APOS_API_KEY = process.env.APOS_API_KEY || 'myapikey';

async function createJob(job) {
  const response = await fetch(`${APOS_BASE}/api/v1/job`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `ApiKey ${APOS_API_KEY}`
    },
    body: JSON.stringify(job)
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`API error ${response.status}: ${text}`);
  }

  return response.json();
}

async function main() {
  const files = (await readdir(FIXTURES_DIR))
    .filter(f => f.endsWith('.json'))
    .sort();

  console.log(`Loading ${files.length} job fixtures into ${APOS_BASE}...`);

  let created = 0;
  for (const file of files) {
    const job = JSON.parse(await readFile(join(FIXTURES_DIR, file), 'utf-8'));

    try {
      const result = await createJob(job);
      created++;
      console.log(`  [${created}/${files.length}] ${job.title} (${result.slug})`);
    } catch (err) {
      console.error(`  Failed "${job.title}" (${file}): ${err.message}`);
    }
  }

  console.log(`\nDone! Created ${created} of ${files.length} jobs.`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
