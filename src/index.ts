#!/usr/bin/env node
import { ConfigFile, GLOBAL_CONFIG_FILE } from './config';
export const getInitialConfig = (): ConfigFile => {
  return {
    ...GLOBAL_CONFIG_FILE,
  };
};
