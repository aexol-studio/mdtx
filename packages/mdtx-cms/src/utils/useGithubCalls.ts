import { UserType } from '../containers';

export const useGithubCalls = () => {
  const getGithubUser = async (token: string) => {
    const loginData = await fetch('https://api.github.com/user', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const JSONdata: UserType = await loginData.json();
    return JSONdata;
  };
  const getGithubUserRepos = async (token: string) => {
    const repos = await fetch(
      'https://api.github.com/user/repos?affiliation=owner%20&per_page=100',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const JSONdata = await repos.json();
    return JSONdata;
  };
  const getUserOrganizations = async (token: string) => {
    const loginData = await fetch(`https://api.github.com/user/orgs`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const JSONdata = await loginData.json();
    return JSONdata;
  };
  const getRepositoryMDtx = async () => {
    const response = await fetch(
      'https://api.github.com/repos/aexol-studio/mdtx',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    const responseParse = await response.json();
    return responseParse;
  };
  const getRepositoryBranches = async (token: string, full_name: string) => {
    const response = await fetch(
      `https://api.github.com/repos/${full_name}/branches`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const availableBranchesResponse = await response.json();
    return availableBranchesResponse;
  };
  const getRepositoryForks = async (token: string, full_name: string) => {
    const response = await fetch(
      `https://api.github.com/repos/${full_name}/forks`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const availableForksResponse = await response.json();
    return availableForksResponse;
  };
  const doRepositoryFork = async (token: string, full_name: string) => {
    const response = await fetch(
      `https://api.github.com/repos/${full_name}/forks`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const availableForksResponse = await response.json();
    return availableForksResponse;
  };
  const getRepositoryPullRequests = async (
    token: string,
    full_name: string,
  ) => {
    const response = await fetch(
      `https://api.github.com/repos/${full_name}/pulls`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const PullRequestsResponse = await response.json();
    return PullRequestsResponse;
  };
  const getRepository = async (token: string, full_name: string) => {
    const response = await fetch(`https://api.github.com/repos/${full_name}`, {
      method: 'GET',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
      },
    });
    const PullRequestsResponse = await response.json();
    return PullRequestsResponse;
  };
  const getRepositoryFullInfo = async (token: string, full_name: string) => {
    const response = await fetch(`https://api.github.com/repos/${full_name}`, {
      method: 'GET',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
      },
    });
    const PullRequestsResponse = await response.json();
    return PullRequestsResponse;
  };

  const getRepositoryAsZIP = async (
    token: string,
    full_name: string,
    branch: string,
    controllerZIP: AbortController,
  ) => {
    const response = await fetch('/api/getRepositoryAsZIP', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controllerZIP.signal,
      body: JSON.stringify({
        token: token,
        fullName: full_name,
        branchName: branch,
      }),
    });
    const JSONResponse = await response.json();
    if (JSONResponse === 'Error') {
      return undefined;
    } else {
      return JSONResponse;
    }
  };

  return {
    getGithubUser,
    getUserOrganizations,
    getRepositoryMDtx,
    getRepositoryBranches,
    getRepositoryForks,
    getRepositoryAsZIP,
    getRepositoryPullRequests,
    doRepositoryFork,
    getRepositoryFullInfo,
    getRepository,
    getGithubUserRepos,
  };
};
