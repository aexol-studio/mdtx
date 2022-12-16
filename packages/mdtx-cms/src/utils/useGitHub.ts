import { Octokit } from 'octokit';
import { useAuthState, useToasts } from '../containers';
import { unzipFunction } from './unzipFunction';

export const useGitHub = () => {
  const { token } = useAuthState();
  const octokit = new Octokit({
    auth: token,
  });
  const connectURL = process.env.NEXT_PUBLIC_PROXY || 'http://localhost:7071';
  //USE: FOR SEARCH FOR REPOSITORIES
  const getGitHubSearchRepositories = async (
    q: string,
    signal: AbortSignal,
  ) => {
    const { data } = await octokit.rest.search.repos({
      q,
      per_page: 100,
      request: { signal },
    });
    if (!data)
      throw new Error('Bad response from getGitHubSearchRepositories()');
    return data;
  };
  //USE: FOR DOWNLOAD REPOSITORY
  const getGitHubRepositoryAsZIP = async (input: {
    owner: string;
    repo: string;
    ref: string;
  }) => {
    const request = octokit.rest.repos.downloadZipballArchive.endpoint(input);
    const url = new URL(request.url);
    const { data } = await octokit.request(`GET ${url.pathname}`, {
      request: {
        fetch: async (url: string, opts: RequestInit | undefined) =>
          fetch(`${connectURL}/api${new URL(url).pathname}`, {
            ...opts,
          }),
      },
    });
    const fileArray = await unzipFunction(data);
    if (!data)
      throw new Error('Bad response from getGitHubToken(), while downloading');
    if (!fileArray)
      throw new Error('Bad response from getGitHubToken(), while unzipping');
    return fileArray;
  };
  //USE: FOR AUTHENTICATE
  const getGitHubToken = async (code: string) => {
    const response = await fetch(`${connectURL}/authenticate/${code}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).catch(() => {});
    if (!response) throw new Error('Bad response from getGitHubToken()');
    return await response.json();
  };
  //USE: FOR GET USER INFO
  const getGitHubUser = async () => {
    const { data } = await octokit.rest.users.getAuthenticated();
    if (!data) throw new Error('Bad response from getGitHubUser()');
    return data;
  };
  //USE: FOR GET USER REPOSITORIES INFO
  const getGitHubUserRepositoriesInfo = async () => {
    const { data } = await octokit.rest.repos.listForAuthenticatedUser({
      sort: 'updated',
      per_page: 100,
    });
    if (!data)
      throw new Error('Bad response from getGitHubUserRepositoriesInfo()');
    return data;
  };
  //USE: FOR GET USER ORGANISATIONS INFO
  const getGitHubUserOrganisationsInfo = async () => {
    const { data } = await octokit.rest.orgs.listForAuthenticatedUser({
      per_page: 100,
    });
    if (!data)
      throw new Error('Bad response from getGitHubUserOrganisationsInfo()');
    return data;
  };
  //USE: FOR GET USER REPOSITORY INFO
  const getGitHubRepositoryInfo = async (input: {
    owner: string;
    repo: string;
  }) => {
    const { data } = await octokit.rest.repos.get(input);
    if (!data) throw new Error('Bad response from getGitHubRepositoryInfo()');
    return data;
  };
  //USE: FOR GET ALL REPOSITORY BRANCHES
  const getGitHubRepositoryBranches = async (input: {
    owner: string;
    repo: string;
  }) => {
    const { data } = await octokit.rest.repos.listBranches(input);
    if (!data)
      throw new Error('Bad response from getGitHubRepositoryBranches()');
    return data;
  };
  //USE: FOR GET ALL REPOSITORY BRANCH
  const getGitHubRepositoryBranch = async (input: {
    owner: string;
    repo: string;
    branch: string;
  }) => {
    const { data } = await octokit.rest.repos.getBranch(input);
    if (!data)
      throw new Error('Bad response from getGitHubRepositoryBranches()');
    return data;
  };
  //USE: FOR GET ALL REPOSITORY PULL REQUESTS
  const getGitHubRepositoryPullRequests = async (input: {
    owner: string;
    repo: string;
  }) => {
    const { data } = await octokit.rest.pulls.list(input);
    if (!data)
      throw new Error('Bad response from getGitHubRepositoryPullRequests()');
    return data;
  };
  //USE: FOR GET ALL REPOSITORY FORKS
  const getGitHubRepositoryForks = async (input: {
    owner: string;
    repo: string;
  }) => {
    const { data } = await octokit.rest.repos.listForks(input);
    if (!data) throw new Error('Bad response from getGitHubRepositoryForks()');
    return data;
  };
  //USE: FOR FORK
  const doGitHubFork = async (input: { owner: string; repo: string }) => {
    const { data } = await octokit.rest.repos.createFork(input);
    if (!data) throw new Error('Bad response from doGitHubFork()');
    return data;
  };

  const getContents = async (input: {
    owner: string;
    repo: string;
    path: string;
    ref: string;
  }) => {
    const { data } = await octokit.rest.repos.getContent(input);
    if (!data) throw new Error('Bad response from getContents()');
    return data;
  };

  const getTree = async (input: {
    owner: string;
    repo: string;
    tree_sha: string;
  }) => {
    const { data } = await octokit.rest.git.getTree({
      ...input,
      recursive: 'true',
    });
    if (!data) throw new Error('Bad response from getTree()');
    return data;
  };

  const getGitHubAfterLoginInfo = async () => {
    const promiseUserInfo = getGitHubUser();
    const promiseOrganisations = getGitHubUserOrganisationsInfo();
    const promiseUserRepos = getGitHubUserRepositoriesInfo();
    const [user, orgs, repos] = await Promise.all([
      promiseUserInfo,
      promiseOrganisations,
      promiseUserRepos,
    ]);
    return {
      user,
      orgs,
      repos,
    };
  };

  return {
    getGitHubToken,
    getGitHubUser,
    getGitHubRepositoryInfo,
    getGitHubAfterLoginInfo,
    getGitHubUserRepositoriesInfo,
    getGitHubUserOrganisationsInfo,
    getGitHubRepositoryBranches,
    getGitHubRepositoryAsZIP,
    getGitHubSearchRepositories,
    getGitHubRepositoryPullRequests,
    getGitHubRepositoryForks,
    doGitHubFork,
    getContents,
    getTree,
    getGitHubRepositoryBranch,
  };
};
