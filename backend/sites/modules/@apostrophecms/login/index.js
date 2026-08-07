import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

// Core apostrophe shows the login screen's "name" as process.env.npm_package_name
// (the same for every tenant, since they all share one backend codebase/
// package.json — "Astro Public Demo Multisite Backend"). This replaces
// @apostrophecms/login's getContext method (copied from apostrophe core,
// see node_modules/apostrophe/modules/@apostrophecms/login/index.js) to use
// the tenant's own site title instead, so each site's login page reads
// e.g. "Cadence" or "Wake Rowing Gym".
//
// Note: extendMethods()/_super did not actually intercept this method in
// this project's setup (verified: the wrapped method never ran), so this
// is a full replacement rather than a super-call wrapper.
export default {
  methods(self) {
    return {
      async getContext(req) {
        const requirementProps = {};
        for (const [ name, requirement ] of Object.entries(self.requirements)) {
          if ((requirement.phase !== 'afterPasswordVerified') && requirement.props) {
            try {
              requirementProps[name] = await requirement.props(req);
            } catch (e) {
              if (e.body && e.body.data) {
                e.body.data.requirement = name;
              }
              throw e;
            }
          }
        }

        let name = (process.env.npm_package_name && process.env.npm_package_name.replace(/-/g, ' ')) || 'Apostrophe';
        try {
          const global = await self.apos.global.findGlobal(req);
          if (global?.siteTitle) {
            name = global.siteTitle;
          }
        } catch (e) {
          // Global doc unavailable for some reason — keep the default name
          // rather than let the login page fail to render.
        }

        let version = '3';
        try {
          version = require('apostrophe/package.json').version || version;
        } catch (e) {
          // ignore, keep fallback
        }

        return {
          env: process.env.APOS_ENV_LABEL || self.options.environmentLabel || process.env.NODE_ENV || 'development',
          name,
          version,
          requirementProps
        };
      }
    };
  }
};
