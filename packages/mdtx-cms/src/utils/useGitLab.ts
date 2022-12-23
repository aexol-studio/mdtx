import { Gitlab } from '@gitbeaker/core/dist/types/resources';
import { RepositoryFromGitlab } from '../containers/GitContainer';
type ConnectionType = {
  url?: string;
  applicationId?: string;
  token: string;
  service: string;
};

export const useGitLab = () => {
  const getGitLabSearchRepositories = async (
    input: { searchQuery: string },
    signal: AbortSignal,
    connection: ConnectionType,
  ) => {
    const response = await fetch(
      `${connection.url}api/v4/search?scope=projects&search=${input.searchQuery}`,
      {
        headers: {
          Authorization: connection.token,
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
  };
  const getGitLabRepositoryInfo = async (
    input: {
      owner: string;
      repo: string;
    },
    gitlabApi: Gitlab<false>,
  ) => {
    const response = await gitlabApi.Projects.show(
      `${input.owner}/${input.repo}`,
    );
    return {
      name: response.name,
      full_name: response.path_with_namespace,
      default_branch: response.default_branch || 'develop',
      id: response.id,
      node_id: response.id.toString(),
      fork: response.forks_count > 0,
      private: response.request_access_enabled,
      owner: {
        avatar_url: response.namespace.avatar_url
          ? response.namespace.avatar_url
          : response.avatar_url,
        login: response.owner?.name
          ? response.owner.name
          : response.namespace.name,
        type: response.namespace.kind,
      },
    };
  };
  return { getGitLabSearchRepositories, getGitLabRepositoryInfo };
};
