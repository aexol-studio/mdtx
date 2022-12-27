import { GraphQLTypes, InputType, Selector } from './zeus';

export const loginSelector = Selector('LoginInput')({
    password: true,
    username: true,
});

export type LoginType = InputType<GraphQLTypes['LoginInput'], typeof loginSelector>;

export const repositoriesSelector = Selector('Repository')({
    _id: true,
    uri: true,
    connection: {
        _id: true,
        applicationId: true,
        createdAt: true,
        name: true,
        owner: true,
        service: true,
        token: true,
        updatedAt: true,
        url: true,
    },
});

export type RepositoryType = InputType<GraphQLTypes['Repository'], typeof repositoriesSelector>;

export const connectionSelector = Selector('Connection')({
    _id: true,
    applicationId: true,
    createdAt: true,
    name: true,
    owner: true,
    service: true,
    token: true,
    updatedAt: true,
    url: true,
    repositiories: repositoriesSelector,
});

export type ConnectionType = InputType<GraphQLTypes['Connection'], typeof connectionSelector>;
