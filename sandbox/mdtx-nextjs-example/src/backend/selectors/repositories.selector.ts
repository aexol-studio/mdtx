import { Selector, InputType, GraphQLTypes } from '../../zeus';
import { scalars } from '../scalars';

export const BranchesSelector = Selector('Ref')({
  name: true,
});

export const repositoriesSelector = Selector('RepositoryConnection')({
  nodes: {
    name: true,
    defaultBranchRef: {
      target: {
        "...on Commit": {
          history: [{ first: 1 }, {
            nodes: {
              oid: [{}, true]
            }
          }]
        }
      }
    },
    refs: [{}, { nodes: BranchesSelector }]

  },
});

export type RepositoriesType = InputType<
  GraphQLTypes['RepositoryConnection'],
  typeof repositoriesSelector,
  typeof scalars
>;
