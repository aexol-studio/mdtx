import { message } from '@/console.js';
import { fileWriteRecuirsiveAsync } from '@/fsAddons.js';
import { pathIn, pathOut } from '@/paths.js';
import { generatedMdLibType } from '@/types/transformersTypes.js';
import matter from 'gray-matter';
import fs from 'fs';
import { ConfigFile } from '@/config.js';
import remarkRehype from 'remark-rehype';
import remarkParse from 'remark-parse';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { unified, Processor } from 'unified';

type Plugins = {
  markdown?: (uni: Processor) => Processor;
  rehype?: (uni: Processor) => Processor;
  raw?: (uni: Processor) => Processor;
  gfm?: (uni: Processor) => Processor;
  highlight?: (uni: Processor) => Processor;
  stringify?: (uni: Processor) => Processor;
};

const convertToHtml = async (
  m: matter.GrayMatterFile<Buffer>,
  plugins?: Plugins,
) => {
  const processUni = (k: keyof Plugins, p: Processor) => plugins?.[k]?.(p) || p;

  const markdownContent = processUni('markdown', unified().use(remarkParse));

  const rehypeContent = processUni(
    'rehype',
    markdownContent.use(remarkRehype, { allowDangerousHtml: true }),
  );

  const rawContent = processUni('raw', rehypeContent.use(rehypeRaw));

  const gfmContent = processUni('gfm', rawContent.use(remarkGfm));

  const highlightContent = processUni(
    'highlight',
    gfmContent.use(rehypeHighlight),
  );

  const stringifyContent = processUni(
    'stringify',
    highlightContent.use(rehypeStringify),
  );

  const processedContent = await stringifyContent.process(m.content);

  return processedContent.toString();
};

export const transformMarkdownFiles =
  (config: ConfigFile) => async (mdFiles: string[], plugins?: Plugins) => {
    try {
      const generatedMdLib: generatedMdLibType = {};
      await Promise.all(
        mdFiles.map(async (mdFile) => {
          const m = matter(await fs.promises.readFile(pathIn(config)(mdFile)));

          generatedMdLib[mdFile] = {
            content: config.markdownToHtml
              ? await convertToHtml(m, plugins)
              : m.content,
            data: m.data,
            excerpt: m.excerpt,
          };
        }),
      );
      await fileWriteRecuirsiveAsync(
        pathOut(config)('mdtx.ts'),
        `export const htmlContent = ${JSON.stringify(
          generatedMdLib,
          null,
          4,
        )} as const`,
      );
    } catch (error) {
      if (error instanceof Error) {
        message(error.message, 'red');
      }
      return;
    }
  };
