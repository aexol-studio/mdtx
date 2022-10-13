import { ConfigFile, readConfig } from '@/config.js';
import { cleanBuild, transformFiles, copyStaticFiles } from '@/transform.js';

export const preBuild = async (config: ConfigFile) => {
  cleanBuild(config);
};

export const build = async () => {
  const config = readConfig('./mdtx.json');
  await preBuild(config);
  await transformFiles({ config });
  await copyStaticFiles(config);
};
