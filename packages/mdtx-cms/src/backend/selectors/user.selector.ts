import { Selector, InputType, GraphQLTypes } from '@/src/zeus';
import { scalars } from '@/src/backend/scalars';

export const userSelector = Selector('User')({
  name: true,
  email: true,
  login: true,
  organizations: [{ first: 20 }, { nodes: { login: true } }],
  avatarUrl: [{}, true],
});

export type UserType = InputType<
  GraphQLTypes['User'],
  typeof userSelector,
  typeof scalars
>;
