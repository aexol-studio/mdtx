export type TreeObject = {
  name: string;
  path?: string;
  image?: ArrayBuffer;
  children?: TreeMenu;
};

export type TreeMenu = TreeObject[];

export const treeBuilder = (paths: TreeMenu) => {
  let result: TreeMenu = [];
  paths.reduce(
    (r, path) => {
      path.name.split('/').reduce((o, name) => {
        let found = (o.children = o.children || []).find(
          (q: { name: string }) => q.name === name,
        );
        if (!found) {
          const fileName = path.name.split('/');
          if (name === fileName[fileName.length - 1]) {
            o.children.push(
              (found = {
                path: path.name,
                name: name,
                image: path.image,
              }),
            );
          } else {
            o.children.push(
              (found = {
                path: path.name,
                name: name,
                children: path.children,
              }),
            );
          }
        }
        return found;
      }, r);
      return r;
    },
    { name: '', children: result },
  );
  return result;
};
