import { AuthConatiner } from '../containers';
import { ModelTypes } from '../zeus';
import { chain } from './chain';
import { repositoriesSelector } from './selectors/repositories.selector';
import {
  FileSelector,
  FolderSelector,
  repositorySelector,
} from './selectors/repository.selector';
import { userSelector } from './selectors/user.selector';

export const useBackend = () => {
  const { token } = AuthConatiner.useContainer();
  const getUserInfo = async () => {
    const response = await chain(
      'query',
      token!,
    )({
      viewer: userSelector,
    });
    if (!response.viewer) throw new Error('Bad response from getUserInfo()');
    return response.viewer;
  };
  const getUserRepositories = async (pagination: {
    orderBy?: ModelTypes['RepositoryOrder'];
    first?: number;
    last?: number;
  }) => {
    const response = await chain(
      'query',
      token!,
    )({
      viewer: {
        repositories: [
          pagination,
          {
            nodes: {
              name: true,
              defaultBranchRef: {
                target: {
                  "...on Commit": {
                    history: [{ first: 1 }, {
                      nodes: {
                        oid: true
                      }
                    }]
                  }
                }
              },
              // refs: [
              //   { first: 10, refPrefix: 'refs/heads/' },
              //   {
              //     nodes: {
              //       name: true,
              //     },
              //   },
              // ],
            },
          },
        ],
      },
    });
    if (!response.viewer)
      throw new Error('Bad response from getUserRepositories()');
    return response.viewer.repositories;
  };
  const getUserRepository = async (repoName: string) => {
    const response = await chain(
      'query',
      token!,
    )({
      viewer: {
        repository: [
          { name: repoName, followRenames: true },
          repositorySelector,
        ],
      },
    });
    if (!response.viewer)
      throw new Error('Bad response from getUserRepository()');
    return response.viewer.repository;
  };

  const getFolderContentFromRepository = async (
    repoName: string,
    path: string,
  ) => {
    const response = await chain(
      'query',
      token!,
    )({
      viewer: {
        repository: [
          { name: repoName },
          {
            object: [
              { expression: `HEAD:${path}` },
              { '...on Tree': FolderSelector },
            ],
          },
        ],
      },
    });
    if (!response.viewer)
      throw new Error('Bad response from getFolderContentFromRepository()');
    return response.viewer.repository;
  };

  const getFileContentFromRepository = async (
    repoName: string,
    path: string,
  ) => {
    const response = await chain(
      'query',
      token!,
    )({
      viewer: {
        repository: [
          { name: repoName },
          {
            object: [
              { expression: `HEAD:${path}` },
              { '...on Blob': FileSelector },
            ],
          },
        ],
      },
    });
    if (!response.viewer)
      throw new Error('Bad response from getFolderContentFromRepository()');
    return response.viewer.repository;
  };

  const createCommitOnBranch = async (input: ModelTypes['CreateCommitOnBranchInput']) => {
    const response = await chain("mutation", token!)({
      createCommitOnBranch: [{ input: input }, {
        commit: {
          oid: true
        }
      }]
    })
    if (!response.createCommitOnBranch)
      throw new Error('Bad response from createCommitOnBranch()');
    return response.createCommitOnBranch
  }


  return {
    getUserInfo,
    getUserRepositories,
    getUserRepository,
    getFolderContentFromRepository,
    getFileContentFromRepository,
    createCommitOnBranch
  };
};
