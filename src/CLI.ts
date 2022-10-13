#!/usr/bin/env node
import { build } from '@/build';
import { message } from '@/console';
import { watch } from '@/watch';
import * as yargs from 'yargs';
import { initConfig } from './config';
process.on('SIGINT', function() {
  message('Exiting...', 'redBright');
  process.exit();
});

const args = yargs
  .usage(
    `Mdtx 🤯 - Generate Typescript Files from Markdown. Run to watch directory with .md files and generate .ts files
`,
  )
  .option('init', {
    alias: 'i',
    describe: 'Init Mdtx config',
    boolean: true,
  })
  .option('build', {
    alias: 'b',
    describe: 'Build project',
    boolean: true,
  })
  .demandCommand(0).argv as {
  [x: string]: unknown;
  init: boolean | undefined;
  build: boolean | undefined;
  _: (string | number)[];
  $0: string;
};

if (args?.build) {
  build();
} else if (args?.init) {
  initConfig();
} else {
  watch();
}
