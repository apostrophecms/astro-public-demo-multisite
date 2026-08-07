// fitness-seed — fills a Northstar brand's home page using the built-in
// widgets of the astro-public-demo-multisite (main) starter.
//
// Install:
//   1. cp -r fitness-seed <repo>/backend/sites/modules/fitness-seed
//   2. add  'fitness-seed': {}  to the modules list in backend/sites/index.js
//   3. (optional, for logos) copy the SVGs somewhere readable, e.g.
//      <repo>/assembly-demo/logos/*.svg
//
// Two separate tasks, on purpose:
//
//   node app fitness-seed:branding --site=cadence.localhost --brand=cadence
//   node app fitness-seed:branding --site=cadence.localhost --brand=cadence --logoDir=/abs/path/to/logos
//   node app fitness-seed:branding --site=cadence.localhost --brand=cadence --no-logo
//
//     Sets ONLY the global doc: site title, logo, accent/link color, heading/body
//     font. Safe to re-run any time you swap a logo or tweak a theme color —
//     it never touches page content, so it won't clobber layout work done in
//     the editor.
//
//   node app fitness-seed:home --site=cadence.localhost --brand=cadence
//
//     Rewrites the home page's main area (hero, class cards, pricing cards,
//     closing note) from scratch and publishes it. This IS destructive to
//     anything built in the editor since the last run — use it once per site
//     to lay down the initial content, not as a way to touch branding.

import { brandProfiles, inferBrandKey } from '../../lib/brandProfiles.js';

export default {
  tasks(self) {
    return {
      branding: {
        usage: 'Set only the site title, logo, and theme (colors/fonts) on the Global doc. ' +
          'Options: --brand=<key> [--logoDir=<path>] [--no-logo]',
        task: async (argv) => {
          const key = (argv.brand || inferBrandKey(self.apos.shortName)).toLowerCase();
          const brand = brands[key];
          if (!brand) {
            throw new Error(`Unknown brand "${key}". Valid: ${Object.keys(brands).join(', ')}`);
          }

          const req = self.apos.task.getReq({ mode: 'draft' });

          let logoImage = null;
          if (argv.logo !== false) {
            try {
              const path = await import('node:path');
              const dir = argv.logoDir || path.resolve(process.cwd(), '../assembly-demo/logos');
              const attachment = await self.apos.attachment.insert(req, {
                name: brand.logo,
                path: path.join(dir, brand.logo)
              });
              let image = self.apos.image.newInstance();
              image.title = `${brand.name} logo`;
              image.attachment = attachment;
              image = await self.apos.image.insert(req, image);
              await self.apos.image.publish(req, image);
              logoImage = image;
              self.apos.util.log(`fitness-seed: logo set for ${brand.name}`);
            } catch (e) {
              self.apos.util.warn(`fitness-seed: logo skipped for ${brand.name} (${e.message}). Add it in Global settings by hand.`);
            }
          }

          const g = await self.apos.global.findGlobal(req);
          g.siteTitle = brand.name;
          if (logoImage) {
            // Must set the relationship field itself (not siteLogoIds
            // directly) — apos derives siteLogoIds from _siteLogo on
            // save, so setting siteLogoIds alone gets clobbered back to
            // whatever the (stale, empty) _siteLogo already was.
            g._siteLogo = [ logoImage ];
          }
          const th = brandProfiles[key];
          if (th) {
            g.accentColor = th.accent;
            g.linkColor = th.link;
            g.headingFont = th.heading;
            g.bodyFont = th.body;
          }
          const updated = await self.apos.global.update(req, g);
          await self.apos.global.publish(req, updated);

          self.apos.util.log(`fitness-seed: branding set for ${brand.name} (${key}).`);
        }
      },
      home: {
        usage: 'Rewrite the home page content (hero, cards, pricing, closing) from scratch and ' +
          'publish it. Destructive to editor changes — use once per site, not for branding tweaks. ' +
          'Options: --brand=<key>',
        task: async (argv) => {
          const key = (argv.brand || inferBrandKey(self.apos.shortName)).toLowerCase();
          const brand = brands[key];
          if (!brand) {
            throw new Error(`Unknown brand "${key}". Valid: ${Object.keys(brands).join(', ')}`);
          }

          const req = self.apos.task.getReq({ mode: 'draft' });
          const gen = () => self.apos.util.generateId();
          const area = (items) => ({ _id: gen(), metaType: 'area', items });
          const rt = (html) => ({ _id: gen(), metaType: 'widget', type: '@apostrophecms/rich-text', content: html });

          const link = (text, style = 'primary') => ({
            _id: gen(),
            linkText: text,
            linkType: 'custom',
            linkUrl: '#',
            linkTarget: [],
            style
          });

          const hero = (title, sub, ctas) => ({
            _id: gen(),
            metaType: 'widget',
            type: 'hero',
            content: area([ rt(`<h2>${title}</h2><p>${sub}</p>`) ]),
            links: ctas
          });

          const card = ({ icon, title, text }) => ({
            _id: gen(),
            metaType: 'widget',
            type: 'card',
            bg: true,
            orientation: 'vertical',
            icon,
            titleRT: area([ {
              _id: gen(), metaType: 'widget', type: 'card-title-rt',
              content: `<h3 class="card__title">${title}</h3>`
            } ]),
            contentRT: area([ {
              _id: gen(), metaType: 'widget', type: 'card-content-rt',
              content: `<p class="card__text">${text}</p>`
            } ]),
            linkText: 'View classes',
            linkType: 'custom',
            linkUrl: '#',
            style: 'outline'
          });

          const priceCard = (t) => ({
            _id: gen(),
            metaType: 'widget',
            type: 'price-card',
            title: t.title,
            content: t.content || '',
            featured: !!t.featured,
            badge: !!t.featured,
            badgeIcon: t.featured ? 'trophy' : undefined,
            badgeLabel: t.featured ? 'Most popular' : undefined,
            priceText: t.price,
            priceTextUnit: t.unit,
            priceDetail: t.detail || '',
            features: (t.features || []).map((item) => ({ _id: gen(), item })),
            linkText: t.cta || 'Choose plan',
            linkType: 'custom',
            linkUrl: '#'
          });

          const items = [
            hero(brand.heroTitle, brand.heroSub, [ link(brand.ctaPrimary, 'primary'), link(brand.ctaSecondary, 'outline') ]),
            rt('<h2>Classes</h2>'),
            ...brand.cards.map(card),
            rt('<h2>Membership</h2>'),
            ...tiers(brand.unit, brand.prices).map(priceCard),
            rt(`<h2>${brand.closing.title}</h2><p>${brand.closing.body}</p>`)
          ];

          const home = await self.apos.page.find(req, { slug: '/' }).toObject();
          if (!home) {
            throw new Error('Home page (slug "/") not found for this site.');
          }
          home.title = brand.name;
          home.main = area(items);
          await self.apos.page.update(req, home);
          await self.apos.page.publish(req, home);

          self.apos.util.log(`fitness-seed: seeded + published home for ${brand.name} (${key}).`);
        }
      },
      booking: {
        usage: 'Insert a "Book a class" booking-widget under the pricing cards on the home page, with ' +
          'the class type set to match the brand\'s discipline. Skips (does not duplicate) if a booking ' +
          'widget is already present. Options: --brand=<key>',
        task: async (argv) => {
          const key = (argv.brand || inferBrandKey(self.apos.shortName)).toLowerCase();
          const brand = brands[key];
          const info = bookingInfo[key];
          if (!brand || !info) {
            throw new Error(`Unknown brand "${key}". Valid: ${Object.keys(bookingInfo).join(', ')}`);
          }

          const req = self.apos.task.getReq({ mode: 'draft' });
          const gen = () => self.apos.util.generateId();

          const home = await self.apos.page.find(req, { slug: '/' }).toObject();
          if (!home) {
            throw new Error('Home page (slug "/") not found for this site.');
          }

          const items = (home.main && home.main.items) || [];
          if (items.some((item) => item.type === 'booking')) {
            self.apos.util.log(`fitness-seed: booking widget already present for ${brand.name}, skipping.`);
            return;
          }

          const widget = {
            _id: gen(),
            metaType: 'widget',
            type: 'booking',
            heading: info.heading,
            intro: info.intro,
            classType: info.classType
          };

          // Insert right after the last pricing card, same placement used on Cadence.
          let insertAt = items.length;
          for (let i = items.length - 1; i >= 0; i--) {
            if (items[i].type === 'price-card') {
              insertAt = i + 1;
              break;
            }
          }
          items.splice(insertAt, 0, widget);
          home.main.items = items;

          await self.apos.page.update(req, home);
          await self.apos.page.publish(req, home);

          self.apos.util.log(`fitness-seed: booking widget added for ${brand.name} (${key}).`);
        }
      },
      layoutMembership: {
        usage: 'Wrap the three top-level pricing cards under "Membership" in a 3-equal-column ' +
          '@apostrophecms/layout widget, in place. Skips if a layout widget is already present ' +
          'in main. Options: --brand=<key>',
        task: async (argv) => {
          const key = (argv.brand || inferBrandKey(self.apos.shortName)).toLowerCase();
          const brand = brands[key];
          if (!brand) {
            throw new Error(`Unknown brand "${key}". Valid: ${Object.keys(brands).join(', ')}`);
          }

          const req = self.apos.task.getReq({ mode: 'draft' });
          const gen = () => self.apos.util.generateId();
          const area = (items) => ({ _id: gen(), metaType: 'area', items });

          const home = await self.apos.page.find(req, { slug: '/' }).toObject();
          if (!home) {
            throw new Error('Home page (slug "/") not found for this site.');
          }

          const items = (home.main && home.main.items) || [];
          if (items.some((item) => item.type === '@apostrophecms/layout')) {
            self.apos.util.log(`fitness-seed: pricing cards already laid out for ${brand.name}, skipping.`);
            return;
          }

          const cardIndexes = items
            .map((item, i) => [ item, i ])
            .filter(([ item ]) => item.type === 'price-card')
            .map(([ , i ]) => i);

          if (!cardIndexes.length) {
            self.apos.util.warn(`fitness-seed: no price-card widgets found for ${brand.name}, skipping.`);
            return;
          }

          const firstIndex = cardIndexes[0];
          const cards = cardIndexes.map((i) => items[i]);
          const colspan = Math.floor(12 / cards.length);

          const columns = cards.map((card, i) => ({
            _id: gen(),
            metaType: 'widget',
            type: '@apostrophecms/layout-column',
            colstart: i * colspan + 1,
            colspan,
            rowstart: 1,
            rowspan: 1,
            order: i,
            content: area([ card ])
          }));

          const layoutWidget = {
            _id: gen(),
            metaType: 'widget',
            type: '@apostrophecms/layout',
            columns: area(columns)
          };

          // Cards are contiguous (all seeded together by the `home` task), so
          // removing them and inserting the layout widget at the first card's
          // old index preserves the position of everything else.
          const newItems = items.filter((_, i) => !cardIndexes.includes(i));
          newItems.splice(firstIndex, 0, layoutWidget);
          home.main.items = newItems;

          await self.apos.page.update(req, home);
          await self.apos.page.publish(req, home);

          self.apos.util.log(`fitness-seed: wrapped ${cards.length} pricing cards in a layout for ${brand.name} (${key}).`);
        }
      }
    };
  }
};

// Standard 3-tier membership, flavored by the class-noun (ride/class/row...).
function tiers(unit, prices = {}) {
  const p = { drop: '$24', pack: '$190', unlimited: '$159', ...prices };
  const U = unit.charAt(0).toUpperCase() + unit.slice(1);
  return [
    { title: 'Drop-In', price: p.drop, unit: `/ ${unit}`, detail: 'No commitment',
      features: [ `One ${unit}`, 'Book anytime', 'Great for a first visit' ], cta: 'Book a ' + unit },
    { title: `10-${U} Pack`, price: p.pack, unit: `/ 10 ${unit}s`, detail: 'Best for regulars',
      features: [ `10 ${unit}s`, 'Save vs. drop-in', 'Shareable with a friend' ], cta: 'Buy a pack' },
    { title: 'Unlimited', price: p.unlimited, unit: '/ month', detail: 'The whole collective', featured: true,
      features: [ `Unlimited ${unit}s`, 'Access every Northstar studio', 'Guest passes each month' ], cta: 'Go unlimited' }
  ];
}

// Per-brand booking-widget config, matching each studio's real discipline
// (see booking-widget's classType choices) and voice (see brand.unit above).
const bookingInfo = {
  cadence: { classType: 'cycling', heading: 'Book a ride', intro: 'Reserve your spot in a live Cadence class.' },
  emberflow: { classType: 'yoga', heading: 'Book a class', intro: 'Reserve your mat for the next heated flow or restorative session.' },
  ironhaus: { classType: 'strength', heading: 'Book a session', intro: 'Reserve your spot on the floor for a coached session.' },
  southpaw: { classType: 'boxing', heading: 'Book a class', intro: 'Get in the ring — reserve your spot in a live class.' },
  reformroom: { classType: 'pilates', heading: 'Book a class', intro: 'Reserve your spot on the reformer.' },
  gritlab: { classType: 'hiit', heading: 'Book a session', intro: 'Reserve your spot in the next coached session.' },
  barretheory: { classType: 'barre', heading: 'Book a class', intro: 'Reserve your spot at the barre.' },
  unwind: { classType: 'recovery', heading: 'Book a session', intro: 'Reserve your spot for stretch, mobility, or recovery.' },
  wake: { classType: 'rowing', heading: 'Book a row', intro: 'Reserve your spot on the erg.' }
};

// ---------------------------------------------------------------------------
// Brand content. Copy mirrors page-content.md. Icons are valid values from
// backend/sites/lib/iconChoices.js.
// ---------------------------------------------------------------------------
const brands = {
  northstar: {
    name: 'Northstar Fitness Collective', logo: 'northstar-fitness-collective.png', unit: 'visit',
    prices: { drop: '$28', pack: '$240', unlimited: '$189' },
    heroTitle: 'Nine ways to move. One collective.',
    heroSub: 'Specialized studio brands, each obsessed with one thing done exceptionally well — on one platform.',
    ctaPrimary: 'Find a studio', ctaSecondary: 'Franchise with us',
    cards: [
      { icon: 'people', title: 'For members', text: 'One membership, nine concepts, one app. Cross-train across the whole collective.' },
      { icon: 'rocket', title: 'For operators', text: 'Proven concepts, playbooks, and a platform that runs the day-to-day.' },
      { icon: 'trophy', title: 'For the curious', text: 'New to us? Book a free intro class at any studio in the collective.' }
    ],
    closing: { title: 'Bring a Northstar concept to your city', body: 'We’re opening new territories now. If you know your market, we’ll bring the playbook.' }
  },
  cadence: {
    name: 'Cadence', logo: 'cadence.png', unit: 'ride',
    prices: { drop: '$26', pack: '$220', unlimited: '$169' },
    heroTitle: 'Ride in rhythm.',
    heroSub: '45 minutes, one room, a wall of sound, and a ride built beat by beat.',
    ctaPrimary: 'Book your first ride', ctaSecondary: 'See the schedule',
    cards: [
      { icon: 'clock', title: 'Cadence 45', text: 'The signature ride — climbs, sprints, and a beat that never quits.' },
      { icon: 'trophy', title: 'Rhythm + Ride', text: 'Cycling on the bike, light weights off it, big finish.' },
      { icon: 'rocket', title: 'Sunrise 30', text: 'A fast, bright 30-minute ride to start the day.' }
    ],
    closing: { title: 'Ride more, pay less', body: 'Class packs and unlimited memberships, plus access to every Northstar studio.' }
  },
  emberflow: {
    name: 'Emberflow', logo: 'emberflow.png', unit: 'class',
    heroTitle: 'Breath. Heat. Flow.',
    heroSub: 'Heated vinyasa and deep stillness in a room built for both.',
    ctaPrimary: 'Book a class', ctaSecondary: 'New student offer',
    cards: [
      { icon: 'earth', title: 'Ember Flow (105°)', text: 'A strong, sweaty vinyasa in full heat.' },
      { icon: 'people', title: 'Warm Slow (90°)', text: 'Longer holds, gentler pace, deeper stretch.' },
      { icon: 'clock', title: 'Cool Restore', text: 'Quiet, unheated, all recovery.' }
    ],
    closing: { title: 'Practice on your terms', body: 'Drop in, buy a pack, or go unlimited across the whole collective.' }
  },
  ironhaus: {
    name: 'Ironhaus', logo: 'ironhaus.png', unit: 'session',
    prices: { drop: '$30', pack: '$260', unlimited: '$179' },
    heroTitle: 'Built under load.',
    heroSub: 'A barbell club for people who want to get measurably stronger.',
    ctaPrimary: 'Book a free assessment', ctaSecondary: 'See programs',
    cards: [
      { icon: 'trophy', title: 'Barbell 101', text: 'Six weeks to a confident squat, bench, deadlift, and press.' },
      { icon: 'people', title: 'Strength Club', text: 'Ongoing coached small-group training on a structured cycle.' },
      { icon: 'clock', title: 'Open Gym', text: 'Full rack access, your program, our floor.' }
    ],
    closing: { title: 'Memberships built to progress', body: 'Coached programming plus open-gym access, and every other Northstar studio.' }
  },
  southpaw: {
    name: 'Southpaw', logo: 'southpaw.png', unit: 'class',
    heroTitle: 'Lead with your off hand.',
    heroSub: 'Technical boxing and kickboxing that trains you like a fighter — no experience required.',
    ctaPrimary: 'Book your first class', ctaSecondary: 'See the schedule',
    cards: [
      { icon: 'trophy', title: 'Boxing Basics', text: 'Stance, jab, cross, and the footwork that makes it all work.' },
      { icon: 'rocket', title: 'Bag + Burn', text: 'Rounds on the bag with conditioning between.' },
      { icon: 'people', title: 'Mitt Work', text: 'Pad rounds with a coach reading your every move.' }
    ],
    closing: { title: 'Train like it matters', body: 'Class packs and unlimited memberships across the collective.' }
  },
  reformroom: {
    name: 'Reform Room', logo: 'reform-room.png', unit: 'class',
    prices: { drop: '$32', pack: '$280', unlimited: '$199' },
    heroTitle: 'Small moves. Big change.',
    heroSub: 'Precision reformer Pilates in small classes with hands-on coaching.',
    ctaPrimary: 'Book a class', ctaSecondary: 'Intro offer',
    cards: [
      { icon: 'trophy', title: 'Reformer Foundations', text: 'Learn the machine and the method, step by step.' },
      { icon: 'people', title: 'Full-Body Flow', text: 'A balanced, all-levels reformer class.' },
      { icon: 'earth', title: 'Core + Control', text: 'Slower, deeper, focused on the center.' }
    ],
    closing: { title: 'Consistency, made easy', body: 'Packs and unlimited memberships, plus access to the whole collective.' }
  },
  gritlab: {
    name: 'Grit Lab', logo: 'grit-lab.png', unit: 'session',
    heroTitle: 'Show up. Work.',
    heroSub: 'Coached HIIT and bootcamp with a timer, a whiteboard, and no excuses.',
    ctaPrimary: 'Book a session', ctaSecondary: 'See the schedule',
    cards: [
      { icon: 'rocket', title: 'Grit 45', text: 'The signature mix of strength and conditioning.' },
      { icon: 'chart', title: 'Engine', text: 'Interval work to build your base.' },
      { icon: 'trophy', title: 'Grind', text: 'Heavier strength focus, still moving fast.' }
    ],
    closing: { title: 'Effort, on a schedule', body: 'Packs and unlimited access, plus every other Northstar studio.' }
  },
  barretheory: {
    name: 'Barre Theory', logo: 'barre-theory.png', unit: 'class',
    heroTitle: 'Poise is a practice.',
    heroSub: 'Ballet-inspired barre that builds long, controlled strength — with a little grace.',
    ctaPrimary: 'Book a class', ctaSecondary: 'New client offer',
    cards: [
      { icon: 'trophy', title: 'Barre Foundations', text: 'Posture, position, and control.' },
      { icon: 'people', title: 'Barre Flow', text: 'A full-body class that keeps moving.' },
      { icon: 'earth', title: 'Barre + Stretch', text: 'Strength first, a long stretch to finish.' }
    ],
    closing: { title: 'Grace takes repetition', body: 'Packs and unlimited memberships across the collective.' }
  },
  unwind: {
    name: 'Unwind', logo: 'unwind.png', unit: 'session',
    prices: { drop: '$35', pack: '$300', unlimited: '$149' },
    heroTitle: 'Recovery is training too.',
    heroSub: 'Assisted stretch, mobility work, and recovery sessions to keep you moving well.',
    ctaPrimary: 'Book a session', ctaSecondary: 'See services',
    cards: [
      { icon: 'people', title: 'Assisted Stretch', text: 'A practitioner moves you deeper than you can alone.' },
      { icon: 'earth', title: 'Mobility Class', text: 'Unlock stiff hips, backs, and shoulders.' },
      { icon: 'clock', title: 'Recovery Lounge', text: 'Compression, heat, and quiet.' }
    ],
    closing: { title: 'Make recovery a habit', body: 'Recovery packs and memberships, plus access to the whole collective.' }
  },
  wake: {
    name: 'Wake', logo: 'wake.png', unit: 'row',
    heroTitle: 'Every meter counts.',
    heroSub: 'Full-body rowing classes that build serious endurance — and go easy on your joints.',
    ctaPrimary: 'Book your first row', ctaSecondary: 'See the schedule',
    cards: [
      { icon: 'trophy', title: 'Row 101', text: 'Learn the stroke and the machine before you push the pace.' },
      { icon: 'rocket', title: 'Row + Strength', text: 'Intervals on the rower, strength work on the floor.' },
      { icon: 'chart', title: 'Endurance Row', text: 'Longer, steadier pieces to build your base.' }
    ],
    closing: { title: 'Go the distance', body: 'Packs and unlimited memberships across every Northstar studio.' }
  }
};
