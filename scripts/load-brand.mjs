#!/usr/bin/env node

/**
 * Load a hotel brand fixture set into an ApostropheCMS site.
 *
 * Usage:
 *   node scripts/load-brand.mjs --brand azure-coast [--base-url http://infraco.localhost:3000]
 *   node scripts/load-brand.mjs --brand metro-loft --base-url http://infraco.localhost:3000
 *
 * Flags:
 *   --brand <name>      Folder name in fixtures/brands/<name>
 *   --base-url <url>    ApostropheCMS base URL for the target site (default http://localhost:3000)
 *   --api-key <key>     API key (default "myapikey" or env APOS_API_KEY)
 *   --skip-home         Don't rewrite the site's home page content
 *   --help              Show usage
 *
 * What it does:
 *   - Fetches remote images referenced in fixtures, uploads them as attachments,
 *     and creates @apostrophecms/image pieces.
 *   - Creates room, offer, and testimonial pieces for the brand.
 *   - Ensures a /rooms landing page exists so room detail URLs resolve.
 *   - Replaces the home page main area with a brand-appropriate default layout
 *     (hero, booking CTA, featured rooms, amenities, offers, testimonials).
 *   - Updates the global siteTitle and companyName to the brand's name.
 */

import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomBytes } from 'node:crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const FIXTURES_ROOT = join(__dirname, '..', 'fixtures', 'brands');

function parseArgs(argv) {
  const args = { baseUrl: 'http://localhost:3000', apiKey: process.env.APOS_API_KEY || 'myapikey', skipHome: false, skipPieces: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--brand') args.brand = argv[++i];
    else if (a === '--base-url') args.baseUrl = argv[++i];
    else if (a === '--api-key') args.apiKey = argv[++i];
    else if (a === '--skip-home') args.skipHome = true;
    else if (a === '--skip-pieces') args.skipPieces = true;
    else if (a === '--help' || a === '-h') args.help = true;
  }
  return args;
}

function printHelp() {
  console.log(`
Usage: node scripts/load-brand.mjs --brand <name> [--base-url <url>]

Brands available (folders in fixtures/brands/):
  azure-coast   Luxury Mediterranean resort
  metro-loft    Urban boutique hotel

Examples:
  node scripts/load-brand.mjs --brand azure-coast
  node scripts/load-brand.mjs --brand metro-loft --base-url http://infraco.localhost:3000
`);
}

function generateId() {
  return `cl_${randomBytes(8).toString('hex')}`;
}

function plainFromHtml(html) {
  if (!html) return '';
  return String(html).replace(/<[^>]+>/g, '').trim();
}

function flattenTree(root) {
  if (!root) return [];
  if (Array.isArray(root)) {
    return root.flatMap(flattenTree);
  }
  const out = [ root ];
  for (const child of root._children || []) {
    out.push(...flattenTree(child));
  }
  return out;
}

class BrandLoader {
  constructor({ baseUrl, apiKey, brandDir, brand }) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.apiKey = apiKey;
    this.brandDir = brandDir;
    this.brand = brand;
    this.imageCache = new Map();
  }

  async request(path, { method = 'GET', body, headers = {}, raw } = {}) {
    const url = `${this.baseUrl}${path}`;
    const init = {
      method,
      headers: {
        Authorization: `ApiKey ${this.apiKey}`,
        ...headers
      }
    };
    if (body !== undefined) {
      if (raw) {
        init.body = body;
      } else {
        init.headers['Content-Type'] = 'application/json';
        init.body = JSON.stringify(body);
      }
    }
    const response = await fetch(url, init);
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`${method} ${url} → ${response.status}: ${text}`);
    }
    if (response.status === 204) return null;
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) return response.json();
    return response.text();
  }

  async ensureImage(url, title) {
    if (!url) return null;
    if (this.imageCache.has(url)) return this.imageCache.get(url);

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`GET image ${url} → ${res.status}`);
      const buffer = Buffer.from(await res.arrayBuffer());
      const contentType = res.headers.get('content-type') || 'image/jpeg';
      const ext = contentType.includes('png') ? 'png' : contentType.includes('webp') ? 'webp' : 'jpg';
      const filename = `${(title || 'image').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40)}-${randomBytes(3).toString('hex')}.${ext}`;

      const form = new FormData();
      const blob = new Blob([ buffer ], { type: contentType });
      form.append('file', blob, filename);

      const attachment = await this.request('/api/v1/@apostrophecms/attachment/upload', {
        method: 'POST',
        body: form,
        raw: true
      });

      const image = await this.request('/api/v1/@apostrophecms/image', {
        method: 'POST',
        body: {
          title: title || filename,
          attachment
        }
      });

      this.imageCache.set(url, image);
      return image;
    } catch (err) {
      console.warn(`    ⚠ Image fetch failed (${url}): ${err.message}`);
      this.imageCache.set(url, null);
      return null;
    }
  }

  makeImageWidget(image) {
    if (!image) return null;
    return {
      _id: generateId(),
      metaType: 'widget',
      type: '@apostrophecms/image',
      imageIds: [ image.aposDocId || image._id ],
      imageFields: {},
      _image: [ image ]
    };
  }

  makeRichTextWidget(html) {
    return {
      _id: generateId(),
      metaType: 'widget',
      type: '@apostrophecms/rich-text',
      content: html
    };
  }

  areaFromWidgets(widgets) {
    return {
      _id: generateId(),
      metaType: 'area',
      items: widgets.filter(Boolean)
    };
  }

  async loadJsonDir(sub) {
    const dir = join(this.brandDir, sub);
    let files;
    try {
      files = await readdir(dir);
    } catch {
      return [];
    }
    const items = [];
    for (const file of files.filter((f) => f.endsWith('.json')).sort()) {
      items.push({
        file,
        data: JSON.parse(await readFile(join(dir, file), 'utf8'))
      });
    }
    return items;
  }

  async createRooms() {
    const entries = await this.loadJsonDir('rooms');
    console.log(`\n▸ Rooms (${entries.length})`);
    const created = [];
    for (const { file, data } of entries) {
      const featured = await this.ensureImage(data.featuredImage, `${data.title} featured`);
      const galleryImages = [];
      for (const galleryUrl of data.gallery || []) {
        const img = await this.ensureImage(galleryUrl, `${data.title} gallery`);
        if (img) galleryImages.push(img);
      }

      const body = {
        title: data.title,
        roomType: data.roomType,
        bedConfiguration: data.bedConfiguration,
        view: data.view,
        maxOccupancy: data.maxOccupancy,
        bedroomCount: data.bedroomCount,
        squareFeet: data.squareFeet,
        amenities: data.amenities || [],
        nightlyRate: data.nightlyRate,
        rateCurrency: data.rateCurrency || 'USD',
        visibility: data.visibility || 'public',
        description: this.areaFromWidgets([
          this.makeRichTextWidget(data.description || '<p></p>')
        ])
      };

      if (featured) {
        body.featuredImageIds = [ featured.aposDocId || featured._id ];
        body.featuredImageFields = {};
      }

      if (galleryImages.length > 0) {
        body.gallery = this.areaFromWidgets(galleryImages.map((img) => this.makeImageWidget(img)));
      } else {
        body.gallery = this.areaFromWidgets([]);
      }

      try {
        const piece = await this.request('/api/v1/room', { method: 'POST', body });
        console.log(`  ✓ ${data.title} (${piece.slug})`);
        created.push(piece);
      } catch (err) {
        console.error(`  ✗ ${data.title} (${file}): ${err.message}`);
      }
    }
    return created;
  }

  async createOffers() {
    const entries = await this.loadJsonDir('offers');
    console.log(`\n▸ Offers (${entries.length})`);
    const created = [];
    for (const { file, data } of entries) {
      const hero = await this.ensureImage(data.heroImage, `${data.title} hero`);

      const body = {
        title: data.title,
        subtitle: data.subtitle,
        tagline: data.tagline,
        fromPrice: data.fromPrice,
        priceCurrency: data.priceCurrency || 'USD',
        priceUnit: data.priceUnit,
        validFrom: data.validFrom,
        validTo: data.validTo,
        promoCode: data.promoCode,
        highlights: (data.highlights || []).map((h) => ({ _id: generateId(), ...h })),
        ctaText: data.ctaText,
        ctaUrl: data.ctaUrl,
        visibility: 'public',
        description: this.areaFromWidgets([
          this.makeRichTextWidget(data.description || '<p></p>')
        ])
      };

      if (hero) {
        body.heroImageIds = [ hero.aposDocId || hero._id ];
        body.heroImageFields = {};
      }

      try {
        const piece = await this.request('/api/v1/offer', { method: 'POST', body });
        console.log(`  ✓ ${data.title} (${piece.slug})`);
        created.push(piece);
      } catch (err) {
        console.error(`  ✗ ${data.title} (${file}): ${err.message}`);
      }
    }
    return created;
  }

  async createTestimonials() {
    const entries = await this.loadJsonDir('testimonials');
    console.log(`\n▸ Testimonials (${entries.length})`);
    const created = [];
    for (const { file, data } of entries) {
      const photo = await this.ensureImage(data.photo, `${data.guestName || 'Guest'} photo`);
      const photoArea = photo
        ? this.areaFromWidgets([ this.makeImageWidget(photo) ])
        : this.areaFromWidgets([]);

      const body = {
        title: data.title,
        guestName: data.guestName,
        guestLocation: data.guestLocation,
        rating: data.rating,
        stayDate: data.stayDate,
        tripType: data.tripType || 'leisure',
        visibility: 'public',
        quote: this.areaFromWidgets([
          this.makeRichTextWidget(data.quote || '<p></p>')
        ]),
        photo: photoArea
      };

      try {
        const piece = await this.request('/api/v1/testimonial', { method: 'POST', body });
        console.log(`  ✓ ${data.title} (${piece.slug})`);
        created.push(piece);
      } catch (err) {
        console.error(`  ✗ ${data.title} (${file}): ${err.message}`);
      }
    }
    return created;
  }

  async ensureRoomsPage() {
    console.log('\n▸ Rooms landing page');
    const root = await this.request('/api/v1/@apostrophecms/page?all=1');
    const all = flattenTree(root);
    const existing = all.find((p) => p.slug === '/rooms' || p.type === 'room-page');
    if (existing) {
      console.log(`  · Already exists: ${existing.slug}`);
      return existing;
    }

    const home = all.find((p) => p.slug === '/');
    if (!home) {
      console.warn('  ⚠ Home page not found — cannot attach /rooms');
      return null;
    }

    const body = {
      title: 'Rooms & Suites',
      type: 'room-page',
      slug: '/rooms',
      visibility: 'public',
      _targetId: home._id,
      _position: 'lastChild'
    };

    try {
      const page = await this.request('/api/v1/@apostrophecms/page', { method: 'POST', body });
      console.log(`  ✓ Created /rooms`);
      return page;
    } catch (err) {
      console.error(`  ✗ Could not create /rooms: ${err.message}`);
      return null;
    }
  }

  async updateHomePage(brandManifest) {
    console.log('\n▸ Home page content');
    const root = await this.request('/api/v1/@apostrophecms/page?all=1');
    const all = flattenTree(root);
    const home = all.find((p) => p.slug === '/');
    if (!home) {
      console.warn('  ⚠ Home page not found — skipping');
      return;
    }

    const heroImage = await this.ensureImage(brandManifest.home?.heroImage, `${brandManifest.name} hero`);
    const bookingBg = await this.ensureImage(brandManifest.home?.bookingImage, `${brandManifest.name} booking`);

    const widgets = [];

    // Hero
    widgets.push({
      _id: generateId(),
      metaType: 'widget',
      type: 'hero',
      content: this.areaFromWidgets([
        this.makeRichTextWidget(`<h2>${brandManifest.home?.heroHeadline || brandManifest.tagline}</h2><p>${brandManifest.home?.heroSubhead || brandManifest.description}</p>`)
      ]),
      links: [
        {
          _id: generateId(),
          linkText: 'Explore our rooms',
          linkType: 'custom',
          linkUrl: '/rooms',
          style: 'primary'
        }
      ]
    });

    // Booking CTA
    widgets.push({
      _id: generateId(),
      metaType: 'widget',
      type: 'booking-cta',
      headline: brandManifest.home?.bookingHeadline || 'Reserve Your Stay',
      subhead: this.areaFromWidgets([
        this.makeRichTextWidget(`<p>${brandManifest.home?.bookingSubhead || 'Live availability on every room.'}</p>`)
      ]),
      background: bookingBg
        ? this.areaFromWidgets([ this.makeImageWidget(bookingBg) ])
        : this.areaFromWidgets([]),
      style: 'dark',
      showGuests: true,
      showPromoCode: false,
      buttonLabel: 'Check Availability'
    });

    // Featured rooms
    widgets.push({
      _id: generateId(),
      metaType: 'widget',
      type: 'room',
      heading: 'Featured Rooms & Suites',
      layout: 'grid',
      roomType: '',
      limit: 3
    });

    // Amenities
    if (brandManifest.amenities?.items?.length) {
      widgets.push({
        _id: generateId(),
        metaType: 'widget',
        type: 'amenities',
        heading: brandManifest.amenities.heading || 'Amenities',
        intro: this.areaFromWidgets([
          this.makeRichTextWidget(`<p>${brandManifest.amenities.intro || ''}</p>`)
        ]),
        columns: brandManifest.amenities.columns || '4',
        amenities: brandManifest.amenities.items.map((item) => ({ _id: generateId(), ...item }))
      });
    }

    // Offers
    widgets.push({
      _id: generateId(),
      metaType: 'widget',
      type: 'offer',
      heading: 'Special Offers',
      layout: 'cards',
      limit: 3,
      offersIds: [],
      offersFields: {}
    });

    // Testimonials
    widgets.push({
      _id: generateId(),
      metaType: 'widget',
      type: 'testimonial',
      heading: 'What Our Guests Say',
      layout: 'grid',
      minRating: 4,
      limit: 3
    });

    const main = this.areaFromWidgets(widgets);
    const draftId = home._id.replace(/:published$/, ':draft');

    try {
      await this.request(`/api/v1/@apostrophecms/page/${draftId}`, {
        method: 'PATCH',
        body: { title: brandManifest.name, main }
      });
      await this.request(`/api/v1/@apostrophecms/page/${draftId}/publish`, {
        method: 'POST',
        body: {}
      });
      console.log(`  ✓ Updated home page with brand layout (draft + published)`);
    } catch (err) {
      console.error(`  ✗ Home page update failed: ${err.message}`);
    }
  }

  async updateGlobal(brandManifest) {
    console.log('\n▸ Global settings');
    try {
      const global = await this.request('/api/v1/@apostrophecms/global');
      const doc = global?.results?.[0] || global;
      if (!doc?._id) {
        console.warn('  ⚠ Could not locate global doc');
        return;
      }
      const draftId = doc._id.replace(/:published$/, ':draft');
      await this.request(`/api/v1/@apostrophecms/global/${draftId}`, {
        method: 'PATCH',
        body: {
          siteTitle: brandManifest.name,
          companyName: brandManifest.name
        }
      });
      await this.request(`/api/v1/@apostrophecms/global/${draftId}/publish`, {
        method: 'POST',
        body: {}
      });
      console.log(`  ✓ siteTitle + companyName → ${brandManifest.name}`);
    } catch (err) {
      console.error(`  ✗ Global update failed: ${err.message}`);
    }
  }

  async run({ skipHome, skipPieces }) {
    const brandManifestPath = join(this.brandDir, 'brand.json');
    const brandManifest = JSON.parse(await readFile(brandManifestPath, 'utf8'));
    console.log(`\nLoading "${brandManifest.name}" into ${this.baseUrl}\n`);

    if (!skipPieces) {
      await this.createRooms();
      await this.createOffers();
      await this.createTestimonials();
      await this.ensureRoomsPage();
    }

    if (!skipHome) {
      await this.updateHomePage(brandManifest);
      await this.updateGlobal(brandManifest);
    }

    console.log(`\nDone. Brand "${brandManifest.name}" loaded.\n`);
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help || !args.brand) {
    printHelp();
    process.exit(args.help ? 0 : 1);
  }

  const brandDir = join(FIXTURES_ROOT, args.brand);
  try {
    await readFile(join(brandDir, 'brand.json'), 'utf8');
  } catch {
    console.error(`Brand "${args.brand}" not found at ${brandDir}`);
    process.exit(1);
  }

  const loader = new BrandLoader({
    baseUrl: args.baseUrl,
    apiKey: args.apiKey,
    brandDir,
    brand: args.brand
  });
  await loader.run({ skipHome: args.skipHome, skipPieces: args.skipPieces });
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
