import { Octokit } from 'octokit';
import { FileType, useAuthState } from '../containers';
import { unzipFunction } from './unzipFunction';
import { useGithubActions } from './useGithubActions';

export const useGitHub = () => {
    const { token, logOut } = useAuthState();
    const { createCommitOnBranch, getOid, createBranch, createPullRequest } = useGithubActions();
    const octokit = new Octokit({
        auth: token,
    });
    const connectURL = process.env.NEXT_PUBLIC_PROXY || 'http://localhost:7071';
    //USE: FOR SEARCH FOR REPOSITORIES
    const getGitHubSearchRepositories = async (
        input: { searchQuery: string },
        signal: AbortSignal,
        octokit: Octokit,
    ) => {
        const { data } = await octokit.rest.search.repos({
            q: input.searchQuery,
            per_page: 100,
            request: { signal },
        });
        if (!data) throw new Error('Bad response from getGitHubSearchRepositories()');
        return data;
    };
    //USE: FOR DOWNLOAD REPOSITORY
    const getGitHubRepositoryAsZIP = async (input: { owner: string; repo: string; ref: string }) => {
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
        if (!data) throw new Error('Bad response from getGitHubRepositoryAsZIP(), while downloading');
        if (!fileArray) throw new Error('Bad response from getGitHubRepositoryAsZIP(), while unzipping');
        return fileArray;
    };
    //USE: FOR AUTHENTICATE
    const getGitHubToken = async (code: string) => {
        try {
            const response = await fetch(`${connectURL}/authenticate/${code}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response) throw new Error('Bad response from getGitHubToken()');
            return await response.json();
        } catch {
            logOut();
            throw new Error('Something went wrong');
        }
    };
    //USE: FOR GET USER INFO
    const getGitHubUser = async () => {
        try {
            const { data } = await octokit.rest.users.getAuthenticated();
            if (!data) throw new Error('Bad response from getGitHubUser()');
            return data;
        } catch {
            logOut();
            throw new Error('Something went wrong');
        }
    };
    //USE: FOR GET USER REPOSITORIES INFO
    const getGitHubUserRepositoriesInfo = async () => {
        const { data } = await octokit.rest.repos.listForAuthenticatedUser({
            sort: 'updated',
            per_page: 100,
        });
        if (!data) throw new Error('Bad response from getGitHubUserRepositoriesInfo()');
        return data;
    };
    //USE: FOR GET USER ORGANISATIONS INFO
    const getGitHubUserOrganisationsInfo = async () => {
        const { data } = await octokit.rest.orgs.listForAuthenticatedUser({
            per_page: 100,
        });
        if (!data) throw new Error('Bad response from getGitHubUserOrganisationsInfo()');
        return data;
    };
    //USE: FOR GET USER REPOSITORY INFO
    const getGitHubRepositoryInfo = async (
        input: {
            owner: string;
            repo: string;
        },
        octokit: Octokit,
    ) => {
        const { data } = await octokit.rest.repos.get(input);
        if (!data) throw new Error('Bad response from getGitHubRepositoryInfo()');
        return data;
    };
    //USE: FOR GET ALL REPOSITORY BRANCHES
    const getGitHubRepositoryBranches = async (
        input: {
            owner: string;
            repo: string;
        },
        octokit: Octokit,
    ) => {
        const { data } = await octokit.rest.repos.listBranches(input);
        if (!data) throw new Error('Bad response from getGitHubRepositoryBranches()');
        return data;
    };
    //USE: FOR GET ALL REPOSITORY BRANCH
    const getGitHubRepositoryBranch = async (
        input: {
            owner: string;
            repo: string;
            branch: string;
        },
        octokit: Octokit,
    ) => {
        const { data } = await octokit.rest.repos.getBranch(input);
        if (!data) throw new Error('Bad response from getGitHubRepositoryBranch()');
        return data;
    };
    //USE: FOR GET ALL REPOSITORY PULL REQUESTS
    const getGitHubRepositoryPullRequests = async (input: { owner: string; repo: string }, octokit: Octokit) => {
        const { data } = await octokit.rest.pulls.list(input);
        if (!data) throw new Error('Bad response from getGitHubRepositoryPullRequests()');
        return data;
    };
    //USE: FOR GET ALL REPOSITORY FORKS
    const getGitHubRepositoryForks = async (input: { owner: string; repo: string }) => {
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

    const getGitHubContents = async (
        input: {
            owner: string;
            repo: string;
            path: string;
            branch: string;
        },
        octokit: Octokit,
    ) => {
        const { data } = await octokit.rest.repos.getContent({
            ...input,
            ref: input.branch,
        });
        if (!data) throw new Error('Bad response from getContents()');
        return data;
    };

    const getGitHubTree = async (
        input: {
            owner: string;
            repo: string;
            tree_sha: string;
        },
        octokit: Octokit,
    ) => {
        const { data } = await octokit.rest.git.getTree({
            ...input,
            recursive: 'true',
        });
        if (!data) throw new Error('Bad response from getTree()');
        return data;
    };

    const getGitHubAfterLoginInfo = async () => {
        try {
            const promiseUserInfo = getGitHubUser();
            const promiseOrganisations = getGitHubUserOrganisationsInfo();
            const promiseUserRepos = getGitHubUserRepositoriesInfo();
            const [user, orgs, repos] = await Promise.all([promiseUserInfo, promiseOrganisations, promiseUserRepos]);
            return {
                user,
                orgs,
                repos,
            };
        } catch {
            throw new Error('Bad response from getGitHubAfterLoginInfo()');
        }
    };

    const createCommitOnGitHub = async (
        input: {
            owner: string;
            repo: string;
            branch: string;
            message: string;
        },
        modifiedFiles: FileType[],
        deletions: FileType[],
        token: string,
    ) => {
        const filesToSend: { path: string; contents: string }[] = [];
        modifiedFiles.map(x => {
            if (x.content) {
                const doBuffer = Buffer.from(x.content, 'utf-8').toString('base64');
                filesToSend.push({
                    path: x.name.slice(x.name.indexOf('/') + 1),
                    contents: doBuffer,
                });
            }
        });
        const filesToDelete: { path: string }[] = [];
        deletions.map(x => {
            filesToDelete.push({
                path: x.name.slice(x.name.indexOf('/') + 1),
            });
        });
        const oidArray = await getOid(
            {
                branchName: input.branch,
                repositoryName: input.repo,
                repositoryOwner: input.owner,
            },
            token,
        );
        const createdCommit = await createCommitOnBranch(
            {
                branch: {
                    branchName: input.branch,
                    repositoryNameWithOwner: `${input.owner}/${input.repo}`,
                },
                expectedHeadOid: oidArray[0].oid,
                message: {
                    headline: input.message,
                    body: input.message,
                },
                fileChanges: {
                    additions: filesToSend,
                    deletions: filesToDelete,
                },
            },
            token,
        );
        if (!createdCommit) throw new Error('Something went wrong while doing commit on GitHub');
        return createdCommit;
    };

    const createPullRequestOnGitHub = async (
        input: {
            owner: string;
            repo: string;
            newBranch: string;
            currentBranch: string;
            selectedBranchToMR: string;
            title: string;
            description: string;
            message: string;
            node_id: string;
        },
        modifiedFiles: FileType[],
        deletions: FileType[],
        token: string,
    ) => {
        const oidArray = await getOid(
            {
                branchName: input.currentBranch,
                repositoryName: input.repo,
                repositoryOwner: input.owner,
            },
            token,
        );
        if (!oidArray) throw new Error('Something went wrong while doing MR on GitHub');
        const createdBranch = await createBranch(
            {
                name: `refs/heads/${input.newBranch}`,
                oid: oidArray[0].oid,
                repositoryId: input.node_id,
            },
            token,
        );
        const ref = createdBranch.ref;
        if (!ref) throw new Error('Something went wrong while doing MR on GitHub');
        if (ref) {
            const commit = await createCommitOnGitHub(
                {
                    branch: ref.name,
                    message: input.message,
                    owner: input.owner,
                    repo: input.repo,
                },
                modifiedFiles,
                deletions,
                token,
            );
            if (!commit) throw new Error('Something went wrong while doing MR on GitHub');
            if (commit) {
                const createdPullReq = await createPullRequest(
                    {
                        baseRefName: input.selectedBranchToMR,
                        headRefName: ref.name,
                        repositoryId: input.node_id,
                        title: input.title,
                    },
                    token,
                );
                if (!createdPullReq) throw new Error('Something went wrong while doing MR on GitHub');
                return createdPullReq;
            }
        }
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
        getGitHubContents,
        getGitHubTree,
        getGitHubRepositoryBranch,
        createCommitOnGitHub,
        createPullRequestOnGitHub,
    };
};
