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
  //   const { service, serviceURL, token } = useAuthState();
  const [connections, setConnections] = useState<ConnectionType[]>([
    {
      id: '1',
      name: '',
      service: '',
      applicationId: '',
      token: 'Bearer',
      url: '',
    },
    {
      id: '2',
      name: 'github',
      service: '',
      token: 'token',
    },
  ]);
  const [loggedData, setLoggedData] = useState<UserType>();
  const { getGitHubRepositoryInfo, getGitHubSearchRepositories } = useGitHub();
  const { getGitLabRepositoryInfo, getGitLabSearchRepositories } = useGitLab();
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

  const getBranches = async () => {};

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
      //GITHUB
      case 'github':
        const GitHubApi = new Octokit({
          auth: connection.token,
        });
        const githubRepository = await getGitHubRepositoryInfo(
          input,
          GitHubApi,
        );
        return githubRepository;
      //GITLAB
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

  return {
    connections,
    getRepository,
    searchRepository,
  };
});

export const GitProvider = GitContainer.Provider;
export const useGitState = GitContainer.useContainer;
