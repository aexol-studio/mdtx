import { RepositoryFromSearch } from './../containers/RepositoryStateContainer';
import { Gitlab } from '@gitbeaker/core/dist/types/resources';

import { FileType } from '../containers';
import { RepositoryFromGitlab } from '../containers/GitContainer';
import { ConnectionType } from '../mdtx-backend-zeus/selectors';
import { PullRequestsType, RepositoriesCollection } from '../pages/editor';

export const useGitLab = () => {
    const getGitLabSearchRepositories = async (
        input: { searchQuery: string },
        signal: AbortSignal,
        gitlab: Gitlab<false>,
    ): Promise<RepositoryFromSearch[] | undefined> => {
        const response = await gitlab.Projects.search(input.searchQuery);
        console.log('🚀 ~ file: useGitLab.ts:16 ~ useGitLab ~ response', response);
        if (!response) return;
        if (response.length) {
            return response.map(obj => {
                return {
                    name: obj.name,
                    full_name: obj.path_with_namespace,
                    default_branch: obj.default_branch || 'develop',
                    id: obj.id,
                    node_id: String(obj.id),
                    fork: obj.forks_count > 0,
                    private: false,
                    owner: {
                        avatar_url: obj.avatar_url || obj.namespace.avatar_url || '',
                        login: obj.namespace.path,
                        type: obj.namespace.kind,
                    },
                    permissions: {
                        admin: obj.owner
                            ? true
                            : //@ts-ignore
                            obj.permissions.group_access && obj.permissions.project_access
                            ? true
                            : false,
                        //@ts-ignore
                        gitlabPermission: obj.permissions.project_access ? true : false,
                    },
                };
            });
        }
    };

    const getGitLabRepositoryPullRequests = async (
        input: {
            owner: string;
            repo: string;
        },
        gitlabApi: Gitlab<false>,
    ): Promise<PullRequestsType[]> => {
        const response = await gitlabApi.MergeRequests.all({
            projectId: `${input.owner}/${input.repo}`,
            state: 'opened',
        });
        if (!response) throw new Error('Cannot get MergeRequests from GitLab');
        const returnVal: PullRequestsType[] = response.map(o => ({
            base: {
                ref: o.source_branch,
            },
            head: {
                ref: o.target_branch,
            },
            body: o.title,
            title: o.title,
            updated_at: o.updated_at,
            user: {
                avatar_url: o.author.avatar_url ? (o.author.avatar_url as string) : '',
                login: o.author.name as string,
            },
        }));
        return returnVal;
    };
    const getGitLabRepositoryInfo = async (
        input: {
            owner: string;
            repo: string;
        },
        gitlabApi: Gitlab<false>,
    ) => {
        const response = await gitlabApi.Projects.show(`${input.owner}/${input.repo}`);
        return {
            name: response.name,
            full_name: response.path_with_namespace,
            default_branch: response.default_branch || 'develop',
            id: response.id,
            node_id: response.id.toString(),
            fork: response.forks_count > 0,
            private: response.request_access_enabled,
            owner: {
                avatar_url: response.namespace.avatar_url ? response.namespace.avatar_url : response.avatar_url,
                login: response.owner?.name ? response.owner.name : response.namespace.name,
                type: response.namespace.kind,
            },
            permissions: {
                admin: response.permissions.group_access && response.permissions.project_access ? true : false,
                gitlabPermission: response.permissions.project_access ? true : false,
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
        let tempArr = [];
        const response = await fetch(
            `${connection.url}api/v4/projects/${input.owner}%2F${input.repo}/repository/tree?recursive=true&per_page=100&ref=${input.branch}`,
            {
                headers: {
                    Authorization: `Bearer ${connection.token}`,
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
                    }/repository/tree?recursive=true&per_page=100&page=${currentPage + 1}&ref=${input.branch}`,
                    {
                        headers: {
                            Authorization: `Bearer ${connection.token}`,
                        },
                    },
                );
                tempArr.push(response);
                currentPage++;
            }
        }
        const promise = await Promise.all(tempArr.map(async res => await res.json()));
        const tree: {
            path?: string | undefined;
            mode?: string | undefined;
            type?: string | undefined;
            sha?: string | undefined;
            size?: number | undefined;
            url?: string | undefined;
        }[] = [];
        promise.map(x =>
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
        const response = await gitlabApi.RepositoryFiles.show(`${input.owner}/${input.repo}`, input.path, input.branch);
        if (!response) throw new Error('Cannot get GitLab content');
        return response;
    };

    const requestForAccess = async (input: { owner: string; repo: string }, gitlabApi: Gitlab<false>) => {
        const response = await gitlabApi.ProjectAccessRequests.request(`${input.owner}/${input.repo}`);
        if (!response) throw new Error('Cannot get GitLab access request');
        return response;
    };

    const getGitLabRepositoryForks = async (
        input: { owner: string; repo: string },
        gitlabApi: Gitlab<false>,
    ): Promise<RepositoriesCollection> => {
        const response = await gitlabApi.Projects.forks(`${input.owner}/${input.repo}`);
        if (!response) throw new Error('Cannot get GitLab repository forks');
        return response.map(o => ({
            full_name: o.path_with_namespace,
            source: {
                //@ts-ignore
                full_name: o.forked_from_project.path_with_namespace,
                //@ts-ignore
                owner: { login: o.forked_from_project.path_with_namespace.split('/')[0] },
            },
        }));
    };

    const getGitLabRepositoryBranches = async (
        input: {
            owner: string;
            repo: string;
        },
        gitlabApi: Gitlab<false>,
    ) => {
        const response = await gitlabApi.Branches.all(`${input.owner}/${input.repo}`);
        return response.map(o => ({
            commit: { sha: o.commit.id as string, url: o.commit.web_url as string },
            name: o.name,
            protected: o.protected,
        }));
    };

    const createCommitOnGitLab = async (
        input: {
            owner: string;
            repo: string;
            branch: string;
            message: string;
        },
        modifiedFiles: FileType[],
        deletions: FileType[],
        gitlabApi: Gitlab<false>,
    ) => {
        const filesCreated: {
            action: 'create';
            encoding: 'base64' | 'text';
            filePath: string;
            content: string;
        }[] = [];

        modifiedFiles.map(x => {
            if (x.isCreated) {
                if (x.content) {
                    const doBuffer = Buffer.from(x.content, 'utf-8').toString('base64');
                    filesCreated.push({
                        action: 'create',
                        encoding: 'base64',
                        filePath: x.name.slice(x.name.indexOf('/') + 1),
                        content: doBuffer,
                    });
                } else {
                    filesCreated.push({
                        action: 'create',
                        encoding: 'text',
                        filePath: x.name.slice(x.name.indexOf('/') + 1),
                        content: '',
                    });
                }
            }
        });

        const filesUpdated: {
            action: 'update';
            encoding: 'base64' | 'text';
            filePath: string;
            content: string;
        }[] = [];

        modifiedFiles.map(x => {
            if (!x.isCreated) {
                if (x.content) {
                    const doBuffer = Buffer.from(x.content, 'utf-8').toString('base64');
                    filesUpdated.push({
                        action: 'update',
                        encoding: 'base64',
                        filePath: x.name.slice(x.name.indexOf('/') + 1),
                        content: doBuffer,
                    });
                } else {
                    filesUpdated.push({
                        action: 'update',
                        encoding: 'text',
                        filePath: x.name.slice(x.name.indexOf('/') + 1),
                        content: '',
                    });
                }
            }
        });

        const filesDeleted: {
            action: 'delete';
            filePath: string;
        }[] = [];
        deletions.map(x => {
            if (x.content) {
                filesDeleted.push({
                    action: 'delete',
                    filePath: x.name.slice(x.name.indexOf('/') + 1),
                });
            }
        });
        const response = await gitlabApi.Commits.create(`${input.owner}/${input.repo}`, input.branch, input.message, [
            ...filesDeleted,
            ...filesUpdated,
            ...filesCreated,
        ]);
        if (!response) throw new Error('Something went wrong while doing commit on GitLab');
        return response;
    };

    const createPullRequestOnGitLab = async (
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
        gitlabApi: Gitlab<false>,
    ) => {
        const newBranch = await gitlabApi.Branches.create(
            `${input.owner}/${input.repo}`,
            input.newBranch,
            input.currentBranch,
        );
        if (!newBranch) throw new Error('Something went wrong while doing MR on GitLab');
        if (newBranch) {
            const doCommit = await createCommitOnGitLab(
                {
                    branch: newBranch.name,
                    message: input.message,
                    owner: input.owner,
                    repo: input.repo,
                },
                modifiedFiles,
                deletions,
                gitlabApi,
            );
            if (!doCommit) throw new Error('Something went wrong while doing MR on GitLab');
            if (doCommit) {
                const pullRequest = await gitlabApi.MergeRequests.create(
                    `${input.owner}/${input.repo}`,
                    newBranch.name,
                    input.selectedBranchToMR,
                    input.title,
                    { description: input.description },
                );
                if (!pullRequest) throw new Error('Something went wrong while doing MR on GitLab');
                return {
                    pullRequest: {
                        headRefName: pullRequest.source_branch,
                    },
                };
            }
        }
    };
    const doGitLabFork = async (
        input: {
            owner: string;
            repo: string;
        },
        gitlabApi: Gitlab<false>,
    ) => {
        const response = await gitlabApi.Projects.fork(`${input.owner}/${input.repo}`);
        if (!response) throw new Error('Something went wrong while doing doGitLabFork');
        return response;
    };
    return {
        getGitLabSearchRepositories,
        getGitLabRepositoryInfo,
        getGitLabTree,
        getGitLabContents,
        getGitLabRepositoryBranches,
        getGitLabRepositoryPullRequests,
        getGitLabRepositoryForks,
        createCommitOnGitLab,
        createPullRequestOnGitLab,
        requestForAccess,
        doGitLabFork,
    };
};
