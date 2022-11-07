import { Selector, InputType, GraphQLTypes } from '../../zeus';
import { scalars } from '../scalars';

export const FileSelector = Selector('Blob')({
  text: true,
});

const SingleFileSelector = Selector('TreeEntry')({
  name: true,
  extension: true,
  type: true,
})

export const FolderSelector = Selector('Tree')({
  entries: SingleFileSelector
});

export const repositorySelector = Selector('Repository')({
  object: [{}, { '...on Tree': FolderSelector }],
});

export type SingleFileType = InputType<
  GraphQLTypes['TreeEntry'],
  typeof SingleFileSelector,
  typeof scalars
>;

export type FolderSelectorType = InputType<
  GraphQLTypes['Tree'],
  typeof FolderSelector,
  typeof scalars
>;

export type RepositoryContentType = InputType<
  GraphQLTypes['Repository'],
  typeof repositorySelector,
  typeof scalars
>;
