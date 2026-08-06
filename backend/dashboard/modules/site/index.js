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
