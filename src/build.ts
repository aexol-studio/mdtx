import { readConfig } from '@/config.js';
import { transformFiles, copyStaticFiles } from '@/transform.js';

export const build = async () => {
  const config = readConfig('./mdtx.json');
  await transformFiles({ config });
  await copyStaticFiles(config);
};
