import { buildTree, stringifyUnifiedProcessor } from 'mdtx-core';
import { htmlContent } from '../content/docs';
import { visit } from 'unist-util-visit';
import { h } from 'hastscript';
import { Root } from 'mdast';

const replaceCustomTagWithMarkdownDirective =
  (htmlContent: string) => (customTag: string) => {
    const startRegex = new RegExp(`{% (${customTag}[^%}]*)%}`, 'gm');
    const endRegex = new RegExp(`{% (end${customTag}[^%}]*)%}`, 'gm');
    return htmlContent
      .replace(startRegex, `:::div{.${customTag}}`)
      .replace(endRegex, `:::`);
  };

export const getHTMLfile = async () => {
  const content = htmlContent['graphql-editor/graph/create.md'].content;

  const processedContent =
    replaceCustomTagWithMarkdownDirective(content)('hint');

  const myTree = buildTree({
    t1TreeDirective: (t, r) => {
      return t.use(r).use(() => {
        return (n) => {
          visit(n, 'containerDirective', (node) => {
            const data = node.data || (node.data = {});
            const hast = h(node.name, node.attributes) as unknown as {
              tagName: string;
              properties: string[];
            };

            data.hName = hast.tagName;
            data.hProperties = hast.properties;
          });
          visit(n, 'html', (node) => {
            if (node.value.includes('src="')) {
              node.value = node.value.replace(/src\=\".*\.gitbook/, 'src="');
              // tree.children.push({ type: '' });
            }
          });
          visit(n, 'paragraph', (node) => {
            const image = node.children.find((child) => child.type === 'image');
            if (image && image.type === 'image') {
              const fileName = image.url.replace(/^.*\.gitbook/, '');
              image.url = fileName;
            }
          });
        };
      });
    },
  });

  return stringifyUnifiedProcessor(myTree, processedContent);
};
