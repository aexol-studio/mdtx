import { readConfig } from '@/config.js';
import { isMd, isStaticFile } from '@/fsAddons.js';
import { pathIn } from '@/paths.js';
import { copyStaticFiles, transformFiles } from '@/transform.js';
import chokidar from 'chokidar';
import fs from 'fs';

export const watch = async () => {
  let block = true;
  const config = readConfig('./mdtx.json');
  await copyStaticFiles(config);
  await transformFiles({
    config,
  });
  chokidar
    .watch(pathIn(config)(`**/*.md`), {
      interval: 0, // No delay
      ignoreInitial: true,
    })
    .on('all', async (event, p) => {
      if (event !== 'add' && event !== 'change') {
        return;
      }
      if (isMd(p)) {
        if (block) {
          return;
        }

        if (fs.existsSync(p)) {
          block = true;
          await transformFiles({
            config,
          });
          block = false;
        }
        return;
      }
      if (isStaticFile(p)) {
        await copyStaticFiles(config);
      }
    });
  block = false;
  // `liveServer` local server for hot reload.
};
