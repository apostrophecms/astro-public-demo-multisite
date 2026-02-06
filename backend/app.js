import multisite from '@apostrophecms-pro/multisite';
import sites from './sites/index.js';
import dashboard from './dashboard/index.js';

export default await multisite({
  root: import.meta,

  // Port to listen on, or set the `PORT` env var (which Heroku will do for you)
  port: 3000,

  // Change to a fallback prefix more appropriate so you can have multiple unrelated
  // multisite projects
  shortNamePrefix: process.env.SHORTNAME_PREFIX || 'astro-public-demo-multisite-',

  // MongoDB URL for database connection. If you have multiple physical
  // servers then you MUST configure this to a SHARED server (which
  // may be a replica set). Can be set via MONGODB_URL env var
  mongodbUrl: process.env.APOS_MONGODB_URI || 'mongodb://localhost:27017',

  // Session secret. Please use a unique string.
  sessionSecret: 'CHANGEME',

  // This is our default HTTP Keep-Alive time, in ms, for reuse of
  // connections. Should be longer than that of the reverse proxy
  // (nginx: 75 seconds, AWS ELB: 60 seconds, etc)
  keepAliveTimeout: 100 * 1000,

  // Set to true to proactively initialize all site instances during startup,
  // before the server begins listening for traffic. Can also be an array
  // of site IDs or shortNames to prewarm only specific sites.
  // Reduces initial request latency for prewarmed sites. Defaults to false.
  prewarmSites: false,

  // Grace period (in milliseconds) before destroying an old site instance
  // after a zero-downtime reload completes. Defaults to 60000 (1 minute).
  oldInstanceGracePeriod: 60000,

  orphan(req, res) {
    console.error(`method: ${req.method} url: ${req.url} host: ${req.host} host header: ${req.headers.host}`);
    return res.status(404).send('not found');
  },
  sites,
  dashboard
});
