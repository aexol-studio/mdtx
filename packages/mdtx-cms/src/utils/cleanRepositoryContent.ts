import { RepositoryContentType } from '../backend';

export const cleanRepositoryContentAndSort = (
  repositoryContent: RepositoryContentType,
) => {
  return {
    object: {
      entries: repositoryContent?.object?.entries
        ?.filter(
          (file) =>
            file.extension === '.md' ||
            (file.extension === '' && file.type === 'tree'),
        )
        .sort((file) => {
          if (file.extension === '.md') {
            return -1;
          }
          return 0;
        }),
    },
  };
};
