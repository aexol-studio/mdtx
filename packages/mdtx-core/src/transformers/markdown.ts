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
import remarkDirective from 'remark-directive';

const baseTree = unified().use(remarkParse);

const remarkDirectiveTree = (t: typeof baseTree, r: typeof remarkDirective) =>
  t.use(r);

const remarkRehypeTree = (
  t: ReturnType<typeof remarkDirectiveTree>,
  r: typeof remarkRehype,
) =>
  t.use(r, {
    allowDangerousHtml: true,
  });

const remarkRawTree = (
  t: ReturnType<typeof remarkRehypeTree>,
  r: typeof rehypeRaw,
) => t.use(r);

const remarkGfmTree = (
  t: ReturnType<typeof remarkRawTree>,
  r: typeof remarkGfm,
) => t.use(r);

const finalTree = (
  t: ReturnType<typeof remarkGfmTree>,
  r: typeof rehypeHighlight,
) => t.use(r);

export const buildTree = (options?: {
  t1TreeDirective?: typeof remarkDirectiveTree;
  t2TreeRehype?: typeof remarkRehypeTree;
  t3TreeRaw?: typeof remarkRawTree;
  t4TreeGfm?: typeof remarkGfmTree;
  t5TreeFinal?: typeof finalTree;
}) => {
  const {
    t1TreeDirective = remarkDirectiveTree,
    t2TreeRehype = remarkRehypeTree,
    t3TreeRaw = remarkRawTree,
    t4TreeGfm = remarkGfmTree,
    t5TreeFinal = finalTree,
  } = options || {};
  return t5TreeFinal(
    t4TreeGfm(
      t3TreeRaw(
        t2TreeRehype(t1TreeDirective(baseTree, remarkDirective), remarkRehype),
        rehypeRaw,
      ),
      remarkGfm,
    ),
    rehypeHighlight,
  );
};

export const baseParserTree = buildTree();

export const stringifyUnifiedProcessor = <T extends Processor>(
  p: T,
  content: string,
) => {
  return p
    .use(rehypeStringify)
    .process(content)
    .then((r) => r.toString());
};

const convertToHtml = async (m: matter.GrayMatterFile<Buffer>) => {
  return stringifyUnifiedProcessor(baseParserTree, m.content);
};

export const convertMarkdownToHtml = async (mdString: string) => {
  return stringifyUnifiedProcessor(baseParserTree, mdString);
};

export const transformMarkdownFiles =
  (config: ConfigFile) => async (mdFiles: string[]) => {
    try {
      const generatedMdLib: generatedMdLibType = {};
      await Promise.all(
        mdFiles.map(async (mdFile) => {
          const m = matter(await fs.promises.readFile(pathIn(config)(mdFile)));

          generatedMdLib[mdFile] = {
            content: config.markdownToHtml ? await convertToHtml(m) : m.content,
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
