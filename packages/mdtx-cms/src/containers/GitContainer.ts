import { useAuthState } from '@/src/containers/AuthContainer';
import { useState } from 'react';
import { createContainer } from 'unstated-next';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useGitHub } from '../utils';

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

const GitContainer = createContainer(() => {
  //   const { service, serviceURL, token } = useAuthState();
  const serviceURL = '';
  const service: any = 'github';
  const token: any = 'github';
  const [loggedData, setLoggedData] = useState<UserType>();
  const { getGitHubRepositoryInfo, getGitHubSearchRepositories } = useGitHub();

  const searchRepository = async (
    input: { searchQuery: string },
    signal: AbortSignal,
  ) => {
    switch (service) {
      case 'none':
        return;
      case 'github':
        const githubRepositories = await getGitHubSearchRepositories(
          input.searchQuery,
          signal,
        );
        return githubRepositories.items;
      case 'gitlab':
        const response = await fetch(
          `${serviceURL}/api/v4/search?scope=projects&search=${input.searchQuery}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal,
          },
        );
        const gitlabRepository: RepositoryFromGitlab[] = await response.json();
        if (!gitlabRepository) return;
        if (gitlabRepository.length) {
          return gitlabRepository.map((obj) => ({
            name: obj.name,
            full_name: obj.path_with_namespace,
            default_branch: obj.default_branch,
            id: obj.id,
            node_id: obj.id,
            fork: obj.forks_count > 0,
            private: false,
            owner: {
              avatar_url: obj.namespace.avatar_url || '',
              login: obj.namespace.path,
              type: obj.namespace.kind,
            },
          }));
        }
    }
  };

  const getBranches = async () => {};

  const getPullRequests = async () => {};

  const getForks = async () => {};

  const getRepository = async (input: {
    owner: string;
    repo: string;
  }): Promise<Repository | undefined> => {
    switch (service) {
      case 'none':
        return;
      case 'github':
        const githubRepository = await getGitHubRepositoryInfo(input);
        return githubRepository;
      case 'gitlab':
        const response = await fetch(
          `${serviceURL}/api/v4/projects/${input.owner}%2F${input.repo}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const gitlabRepository = await response.json();
        return {
          name: gitlabRepository.name,
          full_name: gitlabRepository.path_with_namespace,
          default_branch: gitlabRepository.default_branch,
          id: gitlabRepository.id,
          node_id: gitlabRepository.id,
          fork: gitlabRepository.forks_count > 0,
          private: false,
          owner: {
            avatar_url: '',
            login: '',
            type: '',
          },
        };
    }
  };

  return {
    getRepository,
    searchRepository,
  };
});

export const GitProvider = GitContainer.Provider;
export const useGitState = GitContainer.useContainer;
