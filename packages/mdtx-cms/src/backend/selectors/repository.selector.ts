import { Selector, InputType, GraphQLTypes } from '../../zeus';
import { scalars } from '../scalars';

export const FileSelector = Selector('Blob')({
  text: true,
});

export const FolderSelector = Selector('Tree')({
  entries: {
    name: true,
    extension: true,
    type: true,
  },
});

export const repositorySelector = Selector('Repository')({
  object: [{}, { '...on Tree': FolderSelector }],
});

export type RepositoryType = InputType<
  GraphQLTypes['Repository'],
  typeof repositorySelector,
  typeof scalars
>;
