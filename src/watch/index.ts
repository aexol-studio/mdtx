import { preBuild } from '@/build';
import { readConfig } from '@/config';
import { isMd, isStaticFile } from '@/fsAddons';
import { pathIn } from '@/paths';
import { copyStaticFiles, transformFiles } from '@/transform';
import chokidar from 'chokidar';
import fs from 'fs';

export const watch = async () => {
  let block = true;
  const config = readConfig('./mdtx.json');
  await preBuild(config);
  await copyStaticFiles(config);
  await transformFiles({
    config,
  });
  chokidar
    .watch(pathIn(config)(`**/*.{jpeg,gif,mp4,png,jpg,md}`), {
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
            fileChanged: p,
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
