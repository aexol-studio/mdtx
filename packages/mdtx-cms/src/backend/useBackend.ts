import {
  IssueOrderField,
  OrderDirection,
  SearchType,
  VariableDefinition,
} from './../zeus/index';
import { AuthConatiner } from '../containers';
import { GraphQLTypes, InputType, ModelTypes } from '../zeus';
import { chain } from './chain';
import { scalars } from './scalars';
import {
  repositoriesSelector,
  BranchesSelector,
} from './selectors/repositories.selector';
import {
  FileSelector,
  FolderSelector,
  repositorySelector,
} from './selectors/repositorycontent.selector';
import { userSelector } from './selectors/user.selector';

export const useBackend = () => {
  const { token } = AuthConatiner.useContainer();
  const getUserInfo = async () => {
    const response = await chain(
      'query',
      token!,
    )({
      viewer: userSelector,
    });
    if (!response.viewer) throw new Error('Bad response from getUserInfo()');
    return response.viewer;
  };

  const getUserRepositoryWithoutTree = async (name: string) => {
    const response = await chain('query', token!)({
      viewer: {
        repository: [{ name: name, followRenames: true }, {
          id: true,
          name: true,
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
              orderBy: {
                direction: OrderDirection.DESC,
                field: IssueOrderField.UPDATED_AT,
              },
            },
            {
              nodes: {
                baseRefName: true,
                headRefName: true,
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
        }]
      }
    })
    if (!response.viewer)
      throw new Error('Bad response from getUserRepositoryWithoutTree()');
    return response.viewer.repository;
  }

  const getOrganizationRepositoryWithoutTree = async (organizationName: string, name: string) => {
    const response = await chain('query', token!)({
      viewer: {
        organization: [{ login: organizationName }, {
          repository: [{ name: name, followRenames: true }, {
            id: true,
            name: true,
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
                orderBy: {
                  direction: OrderDirection.DESC,
                  field: IssueOrderField.UPDATED_AT,
                },
              },
              {
                nodes: {
                  baseRefName: true,
                  headRefName: true,
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
          }]
        }]
      }
    })
    if (!response.viewer)
      throw new Error('Bad response from getUserRepositoryWithoutTree()');
    return response.viewer.organization?.repository;
  }

  const getUserRepositories = async (pagination: {
    orderBy?: ModelTypes['RepositoryOrder'];
    first?: number;
    last?: number;
  }) => {
    const response = await chain(
      'query',
      token!,
    )({
      viewer: {
        repositories: [
          pagination,
          {
            nodes: {
              id: true,
              name: true,
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
                  orderBy: {
                    direction: OrderDirection.DESC,
                    field: IssueOrderField.UPDATED_AT,
                  },
                },
                {
                  nodes: {
                    baseRefName: true,
                    headRefName: true,
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
            },
          },
        ],
      },
    });
    if (!response.viewer)
      throw new Error('Bad response from getUserRepositories()');
    return response.viewer.repositories;
  };

  const getOrganizationRepositories = async (
    pagination: {
      orderBy?: ModelTypes['RepositoryOrder'];
      first?: number;
      last?: number;
    },
    organizationName: string,
  ) => {
    const response = await chain(
      'query',
      token!,
    )({
      viewer: {
        organization: [
          { login: organizationName },
          {
            repositories: [
              pagination,
              {
                nodes: {
                  name: true,
                  id: true,
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
                      orderBy: {
                        direction: OrderDirection.DESC,
                        field: IssueOrderField.UPDATED_AT,
                      },
                    },
                    {
                      nodes: {
                        baseRefName: true,
                        headRefName: true,
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
                },
              },
            ],
          },
        ],
      },
    });
    if (!response.viewer)
      throw new Error('Bad response from getUserRepositories()');
    return response.viewer.organization?.repositories;
  };

  const getOrganizationRepository = async (
    repoName: string,
    branchName: string,
    organizationName: string,
  ) => {
    const response = await chain(
      'query',
      token!,
    )({
      organization: [
        { login: organizationName },
        {
          repository: [
            { name: repoName, followRenames: true },
            {
              object: [
                { expression: branchName },
                { '...on Tree': FolderSelector },
              ],
            },
          ],
        },
      ],
    });
    if (!response.organization)
      throw new Error('Bad response from getOrganizationRepository()');
    return response.organization.repository;
  };

  const getUserRepository = async (repoName: string, branchName: string) => {
    const response = await chain(
      'query',
      token!,
    )({
      viewer: {
        repository: [
          { name: repoName, followRenames: true },
          {
            object: [
              { expression: branchName },
              { '...on Tree': FolderSelector },
            ],
          },
        ],
      },
    });
    if (!response.viewer)
      throw new Error('Bad response from getUserRepository()');
    return response.viewer.repository;
  };

  const getFolderContentFromRepository = async (
    repoName: string,
    path: string,
    branchName: string,
  ) => {
    const response = await chain(
      'query',
      token!,
    )({
      viewer: {
        repository: [
          { name: repoName },
          {
            object: [
              { expression: `${branchName}:${path}` },
              { '...on Tree': FolderSelector },
            ],
          },
        ],
      },
    });
    if (!response.viewer)
      throw new Error('Bad response from getFolderContentFromRepository()');
    return response.viewer.repository;
  };
  const getFolderContentFromOrganization = async (
    repoName: string,
    path: string,
    organizationName: string,
    branchName: string,
  ) => {
    const response = await chain(
      'query',
      token!,
    )({
      organization: [
        { login: organizationName },
        {
          repository: [
            { name: repoName },
            {
              object: [
                { expression: `${branchName}:${path}` },
                { '...on Tree': FolderSelector },
              ],
            },
          ],
        },
      ],
    });
    if (!response.organization)
      throw new Error('Bad response from getFolderContentFromOrganization()');
    return response.organization.repository;
  };

  const getFileContentFromOrganization = async (
    repoName: string,
    path: string,
    organizationName: string,
    branchName: string,
  ) => {
    const response = await chain(
      'query',
      token!,
    )({
      organization: [
        { login: organizationName },
        {
          repository: [
            { name: repoName },
            {
              object: [
                { expression: `${branchName}:${path}` },
                { '...on Blob': FileSelector },
              ],
            },
          ],
        },
      ],
    });
    if (!response.organization)
      throw new Error('Bad response from getFileContentFromOrganization()');
    return response.organization.repository;
  };

  const getFileContentFromRepository = async (
    repoName: string,
    path: string,
    branchName: string,
  ) => {
    const response = await chain(
      'query',
      token!,
    )({
      viewer: {
        repository: [
          { name: repoName },
          {
            object: [
              { expression: `${branchName}:${path}` },
              { '...on Blob': FileSelector },
            ],
          },
        ],
      },
    });
    if (!response.viewer)
      throw new Error('Bad response from getFolderContentFromRepository()');
    return response.viewer.repository;
  };

  const createCommitOnBranch = async (
    input: ModelTypes['CreateCommitOnBranchInput'],
  ) => {
    const response = await chain(
      'mutation',
      token!,
    )({
      createCommitOnBranch: [
        { input },
        {
          commit: {
            oid: true,
          },
        },
      ],
    });
    if (!response.createCommitOnBranch)
      throw new Error('Bad response from createCommitOnBranch()');
    return response.createCommitOnBranch;
  };

  const createPullRequest = async (
    input: ModelTypes['CreatePullRequestInput'],
  ) => {
    const response = await chain(
      'mutation',
      token!,
    )({
      createPullRequest: [{ input }, { pullRequest: { headRefName: true } }],
    });
    if (!response.createPullRequest)
      throw new Error('Bad response from createPullRequest()');
    return response.createPullRequest;
  };

  type CreateBranchInput = InputType<
    GraphQLTypes['CreateRefInput'],
    ModelTypes['CreateRefInput'],
    typeof scalars
  >;

  const createBranch = async (input: CreateBranchInput) => {
    const response = await chain(
      'mutation',
      token!,
    )({
      createRef: [
        { input },
        {
          ref: {
            name: true,
            target: {
              '...on Commit': {
                history: [{ first: 1 }, { nodes: { oid: true } }],
              },
            },
          },
        },
      ],
    });
    if (!response.createRef)
      throw new Error('Bad response from createPullRequest()');
    return response.createRef;
  };

  return {
    getOrganizationRepositories,
    getUserRepositoryWithoutTree,
    getUserInfo,
    getUserRepositories,
    getUserRepository,
    getFolderContentFromRepository,
    getFileContentFromRepository,
    createCommitOnBranch,
    createPullRequest,
    createBranch,
    getOrganizationRepository,
    getFolderContentFromOrganization,
    getFileContentFromOrganization,
    getOrganizationRepositoryWithoutTree
  };
};
