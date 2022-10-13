import { message } from '@/console';
import { fileWriteRecuirsiveAsync } from '@/fsAddons';
import { pathIn, pathOut } from '@/paths';
import matter from 'gray-matter';
import fs from 'fs';
import { ConfigFile } from '@/config';

export const transformMarkdownFiles = (config: ConfigFile) => async (
  mdFiles: string[],
) => {
  try {
    const generatedMdLib: Record<
      string,
      Pick<ReturnType<typeof matter>, 'content' | 'data' | 'excerpt'>
    > = {};
    await Promise.all(
      mdFiles.map(async (mdFile) => {
        const m = matter(await fs.promises.readFile(pathIn(config)(mdFile)));
        generatedMdLib[mdFile] = {
          content: m.content,
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
