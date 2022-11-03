import { Selector, InputType, GraphQLTypes } from '../../zeus';
import { scalars } from '../scalars';

export const BranchesSelector = Selector('Ref')({
  name: true,
});

export const repositoriesSelector = Selector('RepositoryConnection')({
  nodes: {
    name: true,
  },
});

export type RepositoriesType = InputType<
  GraphQLTypes['RepositoryConnection'],
  typeof repositoriesSelector,
  typeof scalars
>;
