import { Gitlab } from '@gitbeaker/browser';
import { Octokit } from 'octokit';
import { createContainer } from 'unstated-next';
import { ConnectionType } from '../mdtx-backend-zeus/selectors';
import { useGitHub, useGitLab } from '../utils';
import { FileType } from './FileStateContainer';

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
    const {
        getGitHubRepositoryInfo,
        getGitHubSearchRepositories,
        getGitHubTree,
        getGitHubRepositoryBranch,
        getGitHubContents,
        getGitHubRepositoryBranches,
        getGitHubRepositoryPullRequests,
        createCommitOnGitHub,
        createPullRequestOnGitHub,
    } = useGitHub();
    const {
        getGitLabRepositoryInfo,
        getGitLabSearchRepositories,
        getGitLabTree,
        getGitLabContents,
        getGitLabRepositoryBranches,
        getGitLabRepositoryPullRequests,
        createCommitOnGitLab,
        createPullRequestOnGitLab,
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
                const githubRepositories = await getGitHubSearchRepositories(input, signal, GitHubApi);
                return githubRepositories.items;
            case 'gitlab':
                const host =
                    connection.url && connection.url[connection.url.length - 1] === '/'
                        ? connection.url?.slice(0, connection.url.length - 1)
                        : connection.url;
                const GitLabApi = new Gitlab({
                    host,
                    token: connection.token,
                });
                const gitlabRepositories = await getGitLabSearchRepositories(input, signal, GitLabApi);
                return gitlabRepositories;
        }
    };
    const getPullRequests = async (
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
                const GitHubContent = await getGitHubRepositoryPullRequests(input, GitHubApi);
                return GitHubContent;
            case 'gitlab':
                const host =
                    connection.url && connection.url[connection.url.length - 1] === '/'
                        ? connection.url?.slice(0, connection.url.length - 1)
                        : connection.url;
                const GitLabApi = new Gitlab({
                    host,
                    token: connection.token,
                });
                const GitLabTree = await getGitLabRepositoryPullRequests(input, GitLabApi);
                return GitLabTree;
        }
    };

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
                const githubRepository = await getGitHubRepositoryInfo(input, GitHubApi);
                return githubRepository;
            case 'gitlab':
                const host =
                    connection.url && connection.url[connection.url.length - 1] === '/'
                        ? connection.url?.slice(0, connection.url.length - 1)
                        : connection.url;
                const GitLabApi = new Gitlab({
                    host,
                    token: connection.token,
                });
                const gitlabRepository = await getGitLabRepositoryInfo(input, GitLabApi);
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
                const host =
                    connection.url && connection.url[connection.url.length - 1] === '/'
                        ? connection.url?.slice(0, connection.url.length - 1)
                        : connection.url;
                const GitLabApi = new Gitlab({
                    host,
                    token: connection.token,
                });
                const GitLabContent = await getGitLabContents(input, GitLabApi);
                return GitLabContent;
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
                const GitHubBranches = await getGitHubRepositoryBranches(input, GitHubApi);
                return GitHubBranches;
            case 'gitlab':
                const host =
                    connection.url && connection.url[connection.url.length - 1] === '/'
                        ? connection.url?.slice(0, connection.url.length - 1)
                        : connection.url;
                const GitLabApi = new Gitlab({
                    host,
                    token: connection.token,
                });
                const GitLabBranches = await getGitLabRepositoryBranches(input, GitLabApi);
                return GitLabBranches;
        }
    };

    const doCommit = async (
        input: {
            owner: string;
            repo: string;
            branch: string;
            message: string;
        },
        modifiedFiles: FileType[],
        deletions: FileType[],
        connection: ConnectionType,
    ) => {
        switch (connection.service) {
            case '':
                return;
            case 'github':
                const GitHubCommit = await createCommitOnGitHub(input, modifiedFiles, deletions, connection.token);
                return GitHubCommit;
            case 'gitlab':
                const host =
                    connection.url && connection.url[connection.url.length - 1] === '/'
                        ? connection.url?.slice(0, connection.url.length - 1)
                        : connection.url;
                const GitLabApi = new Gitlab({
                    host,
                    token: connection.token,
                });
                const GitLabCommit = await createCommitOnGitLab(input, modifiedFiles, deletions, GitLabApi);
                return GitLabCommit;
        }
    };

    const doPullRequest = async (
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
        connection: ConnectionType,
    ) => {
        switch (connection.service) {
            case '':
                return;
            case 'github':
                const GitHubPR = await createPullRequestOnGitHub(input, modifiedFiles, deletions, connection.token);
                return GitHubPR;
            case 'gitlab':
                const host =
                    connection.url && connection.url[connection.url.length - 1] === '/'
                        ? connection.url?.slice(0, connection.url.length - 1)
                        : connection.url;
                const GitLabApi = new Gitlab({
                    host,
                    token: connection.token,
                });
                const GitLabPR = await createPullRequestOnGitLab(input, modifiedFiles, deletions, GitLabApi);
                return GitLabPR;
        }
    };

    return {
        getRepository,
        searchRepository,
        getTree,
        getFile,
        getBranches,
        getPullRequests,
        doCommit,
        doPullRequest,
    };
});

export const GitProvider = GitContainer.Provider;
export const useGitState = GitContainer.useContainer;
