import themes from '../../../themes.js';
import baseUrlDomains from '../../../domains.js';

const logos = {
  northstar: { file: 'northstar-fitness-collective.png', title: 'Northstar Fitness Collective logo' },
  cadence: { file: 'cadence.png', title: 'Cadence logo' },
  emberflow: { file: 'emberflow.png', title: 'Emberflow logo' },
  ironhaus: { file: 'ironhaus.png', title: 'Ironhaus logo' },
  southpaw: { file: 'southpaw.png', title: 'Southpaw logo' },
  reformroom: { file: 'reform-room.png', title: 'Reform Room logo' },
  gritlab: { file: 'grit-lab.png', title: 'Grit Lab logo' },
  barretheory: { file: 'barre-theory.png', title: 'Barre Theory logo' },
  unwind: { file: 'unwind.png', title: 'Unwind logo' },
  wake: { file: 'wake.png', title: 'Wake logo' }
};

export default {
  options: {
    themes,
    baseUrlDomains
  },
  fields: {
    add: {
      // Our brand logos are all square (1024x1024). The vendor default
      // (aspectRatio: [115, 66], minSize: [460, 264]) is a wide rectangle,
      // which forces a bad center-crop of a square logo. Match the field's
      // crop constraint to what we actually have.
      logo: {
        label: 'aposMultisiteDashboard:logoLabel',
        type: 'area',
        options: {
          widgets: {
            '@apostrophecms/image': {
              aspectRatio: [ 1, 1 ],
              minSize: [ 400, 400 ],
              max: 1
            }
          },
          max: 1
        }
      }
    }
  },
  init(self) {
    // The site-list logo thumbnail and row alignment come from
    // @apostrophecms-pro/multisite-dashboard's own Vue `scoped` styles,
    // which aren't reachable via a project ui/apos build override (that
    // pipeline is only for admin UI JS/Vue/scss entrypoints, not for
    // patching another module's already-bundled component CSS). Injecting
    // a plain <style> into the admin page's <head> at render time sidesteps
    // that entirely and is the same technique apostrophe core itself uses
    // (see @apostrophecms/module's prependNodes/appendNodes).
    self.prependNodes('head', 'addDashboardListFix');
  },
  methods(self) {
    return {
      addDashboardListFix() {
        return [
          {
            name: 'style',
            body: [
              {
                raw: `
                  /* Our brand logos are square (1024x1024); the vendor
                     default is a wide 115x66 box that badly center-crops
                     them. !important is required to beat the vendor's
                     Vue-scoped [data-v-xxxx] selector specificity. */
                  /* Our own ImageWidget.astro markup wraps <img> in an <a>
                     and <figure> that are all height:auto, so percentage
                     heights can't flow down that chain. Absolute-position
                     the image against this box instead of fighting it. */
                  .apos-dashboard-list__preview-img {
                    position: relative !important;
                    width: 70px !important;
                    height: 70px !important;
                    overflow: hidden !important;
                  }
                  .apos-dashboard-list__preview-img img {
                    position: absolute !important;
                    inset: 0 !important;
                    width: 100% !important;
                    height: 100% !important;
                    object-fit: contain !important;
                  }
                  /* The 70px square logo now sets the row height. Top-aligning
                     the other cells left the single-line Name/Links/Updated
                     text stranded near the top of a much taller row, next to
                     a logo that fills the whole height — reads as unbalanced.
                     Center everything against the logo instead. */
                  .apos-dashboard-list__cell {
                    vertical-align: middle !important;
                  }
                  /* This vendor rule nudges the links down 7px, tuned for
                     the old bottom-aligned layout. With middle-align it's the
                     one thing left out of step with Name/Updated/menu. */
                  .apos-dashboard-list__links-container {
                    transform: translate(-5px, 0) !important;
                  }
                `
              }
            ]
          }
        ];
      }
    };
  },
  tasks(self) {
    return {
      'import-logos': {
        usage: 'Import brand logos into the dashboard media library and set each site piece\'s logo field. Options: --logoDir=<path> --only=shortName1,shortName2',
        task: async (argv) => {
          const path = await import('node:path');
          const dir = argv.logoDir || path.resolve(process.cwd(), '../assembly-demo/logos');
          const req = self.apos.task.getReq({ mode: 'draft' });
          const gen = () => self.apos.util.generateId();
          const only = argv.only ? argv.only.split(',') : null;
          const entries = only
            ? Object.entries(logos).filter(([ shortName ]) => only.includes(shortName))
            : Object.entries(logos);

          for (const [ shortName, info ] of entries) {
            try {
              const site = await self.find(req, { shortName }).toObject();
              if (!site) {
                self.apos.util.warn(`import-logos: no site piece found for shortName "${shortName}", skipping.`);
                continue;
              }

              const attachment = await self.apos.attachment.insert(req, {
                name: info.file,
                path: path.join(dir, info.file)
              });
              let image = self.apos.image.newInstance();
              image.title = info.title;
              image.attachment = attachment;
              image = await self.apos.image.insert(req, image);
              await self.apos.image.publish(req, image);

              site.logo = {
                _id: gen(),
                metaType: 'area',
                items: [
                  {
                    _id: gen(),
                    metaType: 'widget',
                    type: '@apostrophecms/image',
                    _image: [ image ]
                  }
                ]
              };
              await self.update(req, site);
              self.apos.util.log(`import-logos: set logo for ${shortName}`);
            } catch (e) {
              self.apos.util.warn(`import-logos: failed for ${shortName} (${e.message})`);
            }
          }
        }
      }
    };
  }
};
