#!/usr/bin/env node
import { build } from '@/build.js';
import { initConfig } from '@/config.js';
import { message } from '@/console.js';
import { watch } from '@/watch.js';
import yargs from 'yargs';
process.on('SIGINT', function () {
  message('Exiting...', 'redBright');
  process.exit();
});

yargs(process.argv.slice(2))
  .usage(
    `Mdtx 🤯 - Generate Typescript Files from Markdown. Run to watch directory with .md files and generate .ts files`,
  )
  .command(
    '$0',
    'the default command',
    (yargs) => {
      yargs.option('build', {
        alias: 'b',
        describe: 'Build project',
        boolean: true,
      });
    },
    async (argv) => {
      if (argv.build) {
        await build();
      } else {
        await watch();
      }
    },
  )
  .command(
    'init',
    'Init Mdtx config',
    async (yargs) => {
      yargs.options({
        in: {
          default: './content',
          describe: 'Folder with markdown files',
          type: 'string',
        },
        out: {
          default: './src',
          describe: 'Folder to output generated markdown.ts file',
          type: 'string',
        },
      });
    },
    async (argv) => {
      const args = argv as unknown as { in: string; out: string };
      console.log(args);
      if ('in' in argv && 'out' in argv) {
        await initConfig({
          in: args.in,
          out: args.out,
        });
      }
    },
  )
  .strict()
  .demandCommand()
  .parse();
