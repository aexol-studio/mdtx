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

  const getGitLabTree = async (
    input: {
      owner: string;
      repo: string;
      branch: string;
    },
    connection: ConnectionType,
  ) => {
    const tempArr = [];
    const response = await fetch(
      `${connection.url}api/v4/projects/${input.owner}%2F${input.repo}/repository/tree?recursive=true&per_page=100&ref=${input.branch}`,
      {
        headers: {
          Authorization: connection.token,
        },
      },
    );
    tempArr.push(response);
    const totalPages = Number(response.headers.get('x-total-pages'));
    let currentPage = Number(response.headers.get('x-page'));
    if (totalPages && currentPage) {
      while (currentPage < totalPages) {
        const response = await fetch(
          `${connection.url}api/v4/projects/${input.owner}%2F${
            input.repo
          }/repository/tree?recursive=true&per_page=100&page=${
            currentPage + 1
          }`,
          {
            headers: {
              Authorization: connection.token,
            },
          },
        );
        tempArr.push(response);
        currentPage++;
      }
    }
    const promise = await Promise.all(
      tempArr.map(async (res) => await res.json()),
    );
    const tree: {
      path?: string | undefined;
      mode?: string | undefined;
      type?: string | undefined;
      sha?: string | undefined;
      size?: number | undefined;
      url?: string | undefined;
    }[] = [];
    promise.map((x) =>
      x.length
        ? x.map((o: { mode: string; path: string; id: string; type: string }) =>
            tree.push({
              mode: o.mode,
              path: o.path,
              sha: o.id,
              type: o.type,
              url: connection.url!,
            }),
          )
        : tree.push(x),
    );
    return {
      tree: tree,
    };
  };

  const getGitLabContents = async (
    input: {
      owner: string;
      repo: string;
      branch: string;
      path: string;
    },
    gitlabApi: Gitlab<false>,
  ) => {
    const response = await gitlabApi.RepositoryFiles.show(
      `${input.owner}/${input.repo}`,
      input.path,
      input.branch,
    );
    return response;
  };

  const getGitLabRepositoryBranches = async (
    input: {
      owner: string;
      repo: string;
    },
    gitlabApi: Gitlab<false>,
  ) => {
    const response = await gitlabApi.Branches.all(
      `${input.owner}/${input.repo}`,
    );
    return response.map((o) => ({
      commit: { sha: o.commit.id as string, url: o.commit.web_url as string },
      name: o.name,
      protected: o.protected,
    }));
  };

  const createCommitOnGitLab = async (
    input: {
      owner: string;
      repo: string;
    },
    gitlabApi: Gitlab<false>,
  ) => {
    const response = await gitlabApi.Commits.create(
      '',
      '',
      '',
      [
        { action: 'create', filePath: '', content: '', encoding: 'text' },
        { action: 'update', filePath: '', content: '', encoding: 'text' },
        { action: 'delete', filePath: '' },
      ],
      {},
    );
  };

  return {
    getGitLabSearchRepositories,
    getGitLabRepositoryInfo,
    getGitLabTree,
    getGitLabContents,
    getGitLabRepositoryBranches,
  };
};
