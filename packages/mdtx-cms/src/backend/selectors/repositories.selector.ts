import { Selector, InputType, GraphQLTypes, ModelTypes } from '../../zeus';
import { scalars } from '../scalars';

export const BranchesSelector = Selector('Ref')({
  name: true,
  target: {
    '...on Commit': {
      history: [
        { first: 1 },
        {
          nodes: {
            oid: true,
          },
        },
      ],
    },
  },
});

export const repositorySelector = Selector('Repository')({
  id: true,
  name: true,
  defaultBranchRef: BranchesSelector,
  refs: [{}, { nodes: BranchesSelector }],
});

export const repositoriesSelector = Selector('RepositoryConnection')({
  nodes: repositorySelector,
});

export type RepositoryType = InputType<
  GraphQLTypes['Repository'],
  typeof repositorySelector,
  typeof scalars
>;

export type RepositoriesType = InputType<
  GraphQLTypes['RepositoryConnection'],
  typeof repositoriesSelector,
  typeof scalars
>;
