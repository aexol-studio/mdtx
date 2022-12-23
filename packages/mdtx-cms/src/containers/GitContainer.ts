import { useAuthState } from '@/src/containers/AuthContainer';
import { Gitlab } from '@gitbeaker/browser';
import { Octokit } from 'octokit';
import { useState } from 'react';
import { createContainer } from 'unstated-next';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useGitHub } from '../utils';
import { useGitLab } from '../utils/useGitLab';

export type RepositoryFromGitlab = {
  name: any;
  path_with_namespace: any;
  default_branch: any;
  id: any;
  forks_count: number;
  namespace: { avatar_url: any; path: any; kind: any };
};

export type Repository = {
  name: string;
  full_name: string;
  default_branch: string;
  id: number;
  node_id: string;
  fork: boolean;
  private: boolean;
  owner: {
    avatar_url: string;
    login: string;
    type: string;
  } | null;
  permissions?: {
    admin: boolean;
    maintain?: boolean;
    push?: boolean;
    triage?: boolean;
    pull?: boolean;
  };
  source?: {
    full_name: string;
  };
};

export type UserType = {
  login: string;
  html_url: string;
  avatar_url: string;
  name: string | null;
};

type ConnectionType = {
  url?: string;
  applicationId?: string;
  name: string;
  id: string;
  token: string;
  service: string;
};

const GitContainer = createContainer(() => {
  const [searchInService, setSearchInService] = useState<
    ConnectionType | undefined
  >();
  const handleSearchInService = (p?: ConnectionType) => setSearchInService(p); //   const { service, serviceURL, token } = useAuthState();
  const [connections, setConnections] = useState<ConnectionType[]>([
    {
      url: '',
      name: 'Aexol',
      applicationId: '',
      id: '1',
      service: 'gitlab',
      token: '',
    },
    {
      id: '2',
      name: 'github',
      service: 'github',
      token: '',
    },
  ]);
  const [loggedData, setLoggedData] = useState<UserType>();
  const {
    getGitHubRepositoryInfo,
    getGitHubSearchRepositories,
    getGitHubTree,
    getGitHubRepositoryBranch,
    getGitHubContents,
    getGitHubRepositoryBranches,
  } = useGitHub();
  const {
    getGitLabRepositoryInfo,
    getGitLabSearchRepositories,
    getGitLabTree,
    getGitLabContents,
    getGitLabRepositoryBranches,
  } = useGitLab();
  const searchRepository = async (
    input: { searchQuery: string },
    signal: AbortSignal,
    connection: ConnectionType,
  ) => {
    switch (connection.service) {
      case 'none':
        return;
      case 'github':
        const GitHubApi = new Octokit({
          auth: connection.token,
        });
        const githubRepositories = await getGitHubSearchRepositories(
          input,
          signal,
          GitHubApi,
        );
        return githubRepositories.items;
      case 'gitlab':
        const gitlabRepositories = await getGitLabSearchRepositories(
          input,
          signal,
          connection,
        );
        return gitlabRepositories;
    }
  };

  const getPullRequests = async () => {};

  const getForks = async () => {};

  const getRepository = async (
    input: {
      owner: string;
      repo: string;
    },
    connection: ConnectionType,
  ): Promise<Repository | undefined> => {
    switch (connection.service) {
      case '':
        return;
      case 'github':
        const GitHubApi = new Octokit({
          auth: connection.token,
        });
        const githubRepository = await getGitHubRepositoryInfo(
          input,
          GitHubApi,
        );
        return githubRepository;
      case 'gitlab':
        const GitLabApi = new Gitlab({
          host: connection.url?.slice(0, connection.url.length - 1),
          token: connection.token.split(' ')[1],
        });
        const gitlabRepository = await getGitLabRepositoryInfo(
          input,
          GitLabApi,
        );
        return gitlabRepository;
    }
  };

  const getTree = async (
    input: {
      owner: string;
      repo: string;
      branch: string;
    },
    connection: ConnectionType,
  ) => {
    switch (connection.service) {
      case '':
        return;
      case 'github':
        const GitHubApi = new Octokit({
          auth: connection.token,
        });
        const getBranchInfo = await getGitHubRepositoryBranch(input, GitHubApi);
        const inputGit = {
          owner: input.owner,
          repo: input.repo,
          tree_sha: getBranchInfo.commit.sha,
        };
        const GitHubTree = await getGitHubTree(inputGit, GitHubApi);
        return GitHubTree;
      case 'gitlab':
        const GitLabTree = await getGitLabTree(input, connection);
        return GitLabTree;
    }
  };

  const getFile = async (
    input: {
      owner: string;
      repo: string;
      branch: string;
      path: string;
    },
    connection: ConnectionType,
  ) => {
    switch (connection.service) {
      case '':
        return;
      case 'github':
        const GitHubApi = new Octokit({
          auth: connection.token,
        });
        const GitHubContent = await getGitHubContents(input, GitHubApi);
        return GitHubContent;
      case 'gitlab':
        const GitLabApi = new Gitlab({
          host: connection.url?.slice(0, connection.url.length - 1),
          token: connection.token.split(' ')[1],
        });
        const GitLabTree = await getGitLabContents(input, GitLabApi);
        return GitLabTree;
    }
  };

  const getBranches = async (
    input: {
      owner: string;
      repo: string;
    },
    connection: ConnectionType,
  ) => {
    switch (connection.service) {
      case '':
        return;
      case 'github':
        const GitHubApi = new Octokit({
          auth: connection.token,
        });
        const GitHubContent = await getGitHubRepositoryBranches(
          input,
          GitHubApi,
        );
        return GitHubContent;
      case 'gitlab':
        const GitLabApi = new Gitlab({
          host: connection.url?.slice(0, connection.url.length - 1),
          token: connection.token.split(' ')[1],
        });
        const GitLabTree = await getGitLabRepositoryBranches(input, GitLabApi);
        return GitLabTree;
    }
  };

  return {
    connections,
    getRepository,
    searchRepository,
    getTree,
    getFile,
    getBranches,
    searchInService,
    handleSearchInService,
  };
});

export const GitProvider = GitContainer.Provider;
export const useGitState = GitContainer.useContainer;
