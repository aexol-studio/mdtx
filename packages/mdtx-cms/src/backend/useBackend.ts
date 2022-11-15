import { GraphQLTypes, InputType, ModelTypes } from '@/src/zeus';
import { chain } from '@/src/backend/chain';
import { scalars } from '@/src/backend/scalars';
import {
  repositoriesSelectorWithoutTree,
  repositorySelectorWithoutTree,
} from './selectors';
import {
  FileSelector,
  FolderSelector,
} from './selectors/repositorycontent.selector';
import { userSelector } from './selectors/user.selector';

export const useBackend = () => {
  const getUserInfo = async (token: string) => {
    const response = await chain(
      'query',
      token,
    )({
      viewer: userSelector,
    });
    if (!response.viewer) throw new Error('Bad response from getUserInfo()');
    return response.viewer;
  };
  const getOrganizationRepositories = async (
    token: string,
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
            repositories: [pagination, repositoriesSelectorWithoutTree],
          },
        ],
      },
    });
    if (!response.viewer)
      throw new Error('Bad response from getUserRepositories()');
    return response.viewer.organization?.repositories;
  };
  const getUserRepositories = async (
    token: string,
    pagination: {
      orderBy?: ModelTypes['RepositoryOrder'];
      first?: number;
      last?: number;
    },
  ) => {
    const response = await chain(
      'query',
      token!,
    )({
      viewer: {
        repositories: [pagination, repositoriesSelectorWithoutTree],
      },
    });
    if (!response.viewer)
      throw new Error('Bad response from getUserRepositories()');
    return response.viewer.repositories;
  };
  const getOrganizationRepositoryWithoutTree = async (
    token: string,
    organizationName: string,
    name: string,
  ) => {
    const response = await chain(
      'query',
      token!,
    )({
      viewer: {
        organization: [
          { login: organizationName },
          {
            repository: [
              { name: name, followRenames: true },
              repositorySelectorWithoutTree,
            ],
          },
        ],
      },
    });
    if (!response.viewer)
      throw new Error('Bad response from getUserRepositoryWithoutTree()');
    return response.viewer.organization?.repository;
  };
  const getUserRepositoryWithoutTree = async (token: string, name: string) => {
    const response = await chain(
      'query',
      token!,
    )({
      viewer: {
        repository: [
          { name: name, followRenames: true },
          repositorySelectorWithoutTree,
        ],
      },
    });
    if (!response.viewer)
      throw new Error('Bad response from getUserRepositoryWithoutTree()');
    return response.viewer.repository;
  };
  const getRepositoryWithoutTree = async (
    token: string,
    name: string,
    owner: string,
  ) => {
    const response = await chain(
      'query',
      token!,
    )({
      repository: [{ name, owner }, repositorySelectorWithoutTree],
    });
    if (!response.repository)
      throw new Error('Bad response from getUserRepositoryWithoutTree()');
    return response.repository;
  };
  const getFileContentFromOrganization = async (
    token: string,
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

  const getFileContentFromUserRepository = async (
    token: string,
    repoName: string,
    path: string,
    branchName: string,
  ) => {
    const response = await chain(
      'query',
      token,
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
      throw new Error('Bad response from getFolderContentFromUserRepository()');
    return response.viewer.repository;
  };

  const getFileContentFromRepository = async (
    token: string,
    owner: string,
    repoName: string,
    path: string,
    branchName: string,
  ) => {
    const response = await chain(
      'query',
      token,
    )({
      repository: [
        { owner: owner, name: repoName },
        {
          object: [
            { expression: `${branchName}:${path}` },
            { '...on Blob': FileSelector },
          ],
        },
      ],
    });
    if (!response.repository)
      throw new Error('Bad response from getFolderContentFromRepository()');
    return response.repository;
  };

  const createCommitOnBranch = async (
    token: string,
    input: ModelTypes['CreateCommitOnBranchInput'],
  ) => {
    const response = await chain(
      'mutation',
      token,
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
    token: string,
    input: ModelTypes['CreatePullRequestInput'],
  ) => {
    const response = await chain(
      'mutation',
      token,
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

  const createBranch = async (token: string, input: CreateBranchInput) => {
    const response = await chain(
      'mutation',
      token,
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

  const getUserRepository = async (
    token: string,
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
          { name: repoName, followRenames: true },
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
      throw new Error('Bad response from getUserRepository()');
    return response.viewer.repository;
  };

  const getOrganizationRepository = async (
    token: string,
    repoName: string,
    path: string,
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
                { expression: `${branchName}:${path}` },
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

  const getRepository = async (
    token: string,
    owner: string,
    name: string,
    path: string,
    branchName: string,
  ) => {
    const response = await chain(
      'query',
      token!,
    )({
      repository: [
        { name: name, owner: owner },
        {
          object: [
            { expression: `${branchName}:${path}` },
            { '...on Tree': FolderSelector },
          ],
        },
      ],
    });
    if (!response.repository)
      throw new Error('Bad response from getUserRepository()');
    return response.repository;
  };
  return {
    getUserInfo,
    createCommitOnBranch,
    createPullRequest,
    createBranch,
    getFileContentFromRepository,
    getFileContentFromUserRepository,
    getFileContentFromOrganization,
    getOrganizationRepositories,
    getOrganizationRepositoryWithoutTree,
    getUserRepositories,
    getUserRepositoryWithoutTree,
    getRepositoryWithoutTree,
    getRepository,
    getOrganizationRepository,
    getUserRepository,
  };
};
