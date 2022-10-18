import { message } from '@/console.js';
import { fileWriteRecuirsiveAsync } from '@/fsAddons.js';
import { pathIn, pathOut } from '@/paths.js';
import matter from 'gray-matter';
import fs from 'fs';
import { ConfigFile } from '@/config.js';
import remarkRehype from 'remark-rehype';
import remarkParse from 'remark-parse';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight';
import { unified } from 'unified';


export const transformMarkdownFiles =
  (config: ConfigFile) => async (mdFiles: string[]) => {
    try {
      const generatedMdLib: Record<
        string,
        Pick<ReturnType<typeof matter>, 'content' | 'data' | 'excerpt'>
      > = {};
      await Promise.all(
        mdFiles.map(async (mdFile) => {
          const m = matter(await fs.promises.readFile(pathIn(config)(mdFile)));

          const processedContent = await unified()
            .use(remarkParse)
            .use(remarkRehype, { allowDangerousHtml: true })
            .use(rehypeRaw)
            .use(remarkGfm)
            .use(rehypeHighlight)
            .use(rehypeStringify)
            .process(m.content)

          const contentHtml = processedContent.toString();
          generatedMdLib[mdFile] = {
            content: config.markdownToHtml ? contentHtml : m.content,
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
