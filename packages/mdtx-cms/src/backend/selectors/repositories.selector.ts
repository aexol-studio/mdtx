import {
  Selector,
  InputType,
  GraphQLTypes,
  IssueOrderField,
  OrderDirection,
  PullRequestState,
} from '@/src/zeus';
import { scalars } from '@/src/backend/scalars';

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

export const repositorySelectorWithoutTree = Selector('Repository')({
  id: true,
  name: true,
  owner: {
    '...on User': {
      name: true,
    },
    '...on Organization': {
      name: true,
    },
    login: true,
  },
  defaultBranchRef: BranchesSelector,
  refs: [
    { first: 10, refPrefix: 'refs/heads/' },
    {
      nodes: BranchesSelector,
    },
  ],
  pullRequests: [
    {
      first: 50,
      states: PullRequestState.OPEN,
      orderBy: {
        direction: OrderDirection.DESC,
        field: IssueOrderField.UPDATED_AT,
      },
    },
    {
      nodes: {
        baseRefName: true,
        headRefName: true,
        closed: true,
        bodyText: true,
        updatedAt: true,
        author: {
          login: true,
          avatarUrl: [{}, true],
          '...on User': { name: true },
        },
      },
    },
  ],
});

export const repositoriesSelectorWithoutTree = Selector('RepositoryConnection')(
  {
    nodes: repositorySelectorWithoutTree,
  },
);

export type RepositoryType = InputType<
  GraphQLTypes['Repository'],
  typeof repositorySelectorWithoutTree,
  typeof scalars
>;

export type RepositoriesType = InputType<
  GraphQLTypes['RepositoryConnection'],
  typeof repositoriesSelectorWithoutTree,
  typeof scalars
>;
