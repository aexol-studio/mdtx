import fs from 'fs';
import path from 'path';
import { ConfigFile } from '@/config.js';
import { calcTime, message } from '@/console.js';
import {
  fileWriteRecuirsiveAsync,
  isDirectory,
  isStaticFile,
  isMd,
} from '@/fsAddons.js';
import { pathIn, pathOut } from '@/paths.js';
import { transformMarkdownFiles } from '@/transformers/markdown.js';

const getFiles = (dir: string) => {
  const result = [];

  const files = [dir];
  do {
    const filepath = files.pop();
    if (!filepath) {
      throw new Error('Cannot get file from filepath');
    }
    const stat = fs.lstatSync(filepath);
    if (stat.isDirectory()) {
      fs.readdirSync(filepath).forEach((f) =>
        files.push(path.join(filepath, f)),
      );
    } else if (stat.isFile()) {
      result.push(path.relative(dir, filepath));
    }
  } while (files.length !== 0);

  return result;
};
export const readFiles =
  (matchFunction: (p: string) => boolean) => async (p: string) => {
    const allFiles: string[] = [];
    for await (const f of getFiles(p)) {
      const t = f as string;
      if (matchFunction(t)) {
        allFiles.push(t);
      }
    }
    return allFiles;
  };

export const transformFiles = async ({ config }: { config: ConfigFile }) => {
  const { end } = calcTime('Build time', 'blueBright');
  const mdFiles = await readFiles(isMd)(config.in);
  await transformMarkdownFiles(config)(mdFiles);
  message('Code render successful', 'greenBright');
  end();
};

export const copyFile =
  (config: ConfigFile) => async (relativeFilePath: string) => {
    const f = await fs.promises.readFile(pathIn(config)(relativeFilePath));
    await fileWriteRecuirsiveAsync(pathOut(config)(relativeFilePath), f);
  };

export const copyStaticFiles = async (config: ConfigFile) => {
  const files = getFiles(config.in);
  await Promise.all(
    files
      .filter((f) => !isDirectory(pathIn(config)(f)))
      .filter(isStaticFile)
      .map((f) => copyFile(config)(f)),
  );
};
