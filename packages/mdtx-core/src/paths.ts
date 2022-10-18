import { ConfigFile } from '@/config.js';
import path from 'path';
export const pathIn =
  (config: ConfigFile) =>
  (...args: string[]) =>
    path.join(config.in, ...args);

export const pathOut =
  (config: ConfigFile) =>
  (...args: string[]) =>
    path.join(config.out, ...args);
