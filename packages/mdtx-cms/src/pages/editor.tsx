import React, { useEffect, useMemo, useState } from 'react';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Layout } from '../layouts';
import {
  RepositoriesType,
  RepositoryType,
} from '../backend/selectors/repositories.selector';
import { useBackend } from '../backend/useBackend';
import { ArrowLeft, BackIcon } from '../assets';
import { ClipLoader } from 'react-spinners';
import { useRouter } from 'next/router';
import { UserType } from '../backend/selectors/user.selector';
import {
  RepositoryContentType,
  SingleFileType,
} from '../backend/selectors/repositorycontent.selector';
import { useForm, SubmitHandler } from 'react-hook-form';
import { dateFormatter } from '../utils/dateFormatter';

import { Menu, PullRequestInput } from '../components';
import { OrderDirection, RepositoryOrderField } from '../zeus';
import { setterForRespositoryContent } from '../utils/setterForRepositoryContent';
import { setterForContentFile } from '../utils/setterForContentFile';
import { useAuthState } from '../containers';
import { CommitInput } from '../components/CMS/molecules/CommitForm';
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });
export enum CommitingModes {
  COMMIT = 'COMMIT',
  PULL_REQUEST = 'PULL_REQUEST',
}

export enum WatchingModeOnRepository {
  REPOSITORY,
  PULL_REQUESTS,
}

const editor = () => {
  const {
    register: registerCommit,
    handleSubmit: handleSubmitCommit,
    watch: watchCommit,
    reset: resetCommitForm,
    formState: { errors: errorsCommit },
  } = useForm<CommitInput>();

  const {
    register: registerPullRequest,
    handleSubmit: handleSubmitPullRequest,
    watch: watchPullRequest,
    reset: resetPullRequestForm,
    formState: { errors: errorsPullRequest },
  } = useForm<PullRequestInput>();

  const router = useRouter();
  const {
    token,
    isLoggedIn,
    setLoggedData,
    loggedData,
    setTokenWithLocal,
    setIsLoggedIn,
  } = useAuthState();
  const {
    getUserInfo,
    createCommitOnBranch,
    createPullRequest,
    createBranch,
    getOrganizationRepositories,
    getUserRepositories,
  } = useBackend();
  ///////////////////////
  /// Markdown States ///
  ///////////////////////

  const [markdownEdit, setMarkdownEdit] = useState<string | undefined>(
    'Pick Markdown',
  );
  const [markdownBase, setMarkdownBase] = useState<string | undefined>(
    'Pick Markdown',
  );

  const resetMarkdown = () => {
    setMarkdownBase('Pick Markdown');
    setMarkdownEdit('Pick Markdown');
  };

  ///////////////////////
  ///      States     ///
  ///////////////////////

  const [openMenu, setOpenMenu] = useState(true);

  const [watchingModeOnRepository, setWatchingModeOnRepository] =
    useState<WatchingModeOnRepository>(WatchingModeOnRepository.REPOSITORY);

  const [commitingMode, setCommitingMode] = useState<CommitingModes>(
    CommitingModes.PULL_REQUEST,
  );

  const [sendingToGIT, setSendingToGIT] = useState(false);
  const [leaveWithChanges, setLeaveWithChanges] = useState(false);

  const [repositoriesList, setRepositoriesList] = useState<RepositoriesType>();
  const [organizationList, setOrganizationList] =
    useState<Pick<UserType, 'organizations'>>();

  const [selectedOrganization, setSelectedOrganization] = useState('---');

  const [autoCompleteValue, setAutoCompleteValue] = useState<
    string | undefined
  >();

  const [selectedRepository, setSelectedRepository] =
    useState<RepositoryType>();

  const [selectedRepositoryContent, setSelectedRepositoryContent] =
    useState<RepositoryContentType>();

  const [selectedBranch, setSelectedBranch] = useState<string | undefined>();
  const [selectedFile, setSelectedFile] = useState<SingleFileType>();
  const [contentPath, setContentPath] = useState<string | undefined>();

  const [loadingFullTree, setLoadingFullTree] = useState(false);

  ///////////////////////

  const filteredRepositories = useMemo(() => {
    if (!autoCompleteValue) return repositoriesList;
    if (autoCompleteValue.length) {
      const regex = new RegExp(
        `^${autoCompleteValue.toLocaleLowerCase()}`,
        `i`,
      );
      const filteredData = {
        nodes: repositoriesList?.nodes?.filter((x) => regex.test(x.name)),
      };
      return filteredData;
    }
  }, [autoCompleteValue, repositoriesList]);

  /// gettingToken ///

  useEffect(() => {
    const url = window.location.href;
    const hasCode = url.includes('?code=');
    const hasError = url.includes('?error=');
    if (hasError) {
      router.push('/');
    }
    if (!token && hasCode) {
      const newUrl = url.split('?code=');
      const newestUrl = newUrl[1].split('&');
      const requestData = {
        code: newestUrl[0],
      };
      const proxy_url = process.env.NEXT_PUBLIC_PROXY || '';
      fetch(proxy_url, {
        method: 'POST',
        body: JSON.stringify(requestData),
      })
        .then((response) => response.json())
        .then(async (data) => {
          setTokenWithLocal(data.accessToken);
          setIsLoggedIn(true);
        });
    }
  }, []);

  /// First Load ///

  useEffect(() => {
    if (isLoggedIn && token) {
      getUserInfo(token).then((res) => {
        setLoggedData(res);
        setOrganizationList(res);
        setIsLoggedIn(true);
        router.replace('/editor');
        setLoadingFullTree(true);
        getUserRepositories(token, {
          first: 100,
          orderBy: {
            direction: OrderDirection.DESC,
            field: RepositoryOrderField.PUSHED_AT,
          },
        }).then((response) => {
          setRepositoriesList(response);
          setLoadingFullTree(false);
        });
      });
    }
  }, [isLoggedIn]);

  /// Repositories refetch ///

  useEffect(() => {
    if (isLoggedIn && token) {
      setRepositoriesList(undefined);
      if (selectedOrganization !== '---') {
        getOrganizationRepositories(
          token,
          {
            first: 100,
            orderBy: {
              direction: OrderDirection.DESC,
              field: RepositoryOrderField.PUSHED_AT,
            },
          },
          selectedOrganization,
        ).then((response) => {
          setRepositoriesList(response);
          setLoadingFullTree(false);
        });
      } else {
        getUserRepositories(token, {
          first: 100,
          orderBy: {
            direction: OrderDirection.DESC,
            field: RepositoryOrderField.PUSHED_AT,
          },
        }).then((response) => {
          setRepositoriesList(response);
          setLoadingFullTree(false);
        });
      }
    }
  }, [selectedOrganization]);

  useEffect(() => {
    if (isLoggedIn && token && selectedRepository) {
      setLoadingFullTree(true);
      setCommitingMode(CommitingModes.PULL_REQUEST);
      resetCommitForm();
      resetPullRequestForm();
      if (selectedBranch && selectedRepository)
        setterForRespositoryContent(
          token,
          contentPath ? contentPath : '',
          selectedOrganization,
          selectedBranch,
          selectedRepository,
          loggedData?.login === selectedRepository.owner.login,
          setSelectedRepositoryContent,
          setLoadingFullTree,
        );
    }
  }, [contentPath, selectedBranch]);

  //COMMITS
  const onCommitSubmit: SubmitHandler<CommitInput> = (data) => {
    console.log(data);
    setSendingToGIT(true);
    if (loggedData && token && markdownEdit) {
      const doBuffer = Buffer.from(markdownEdit, 'utf-8').toString('base64');
      const oidArray = selectedRepository?.refs?.nodes?.find(
        (x) => x.name === selectedBranch,
      )?.target?.history.nodes;
      const isOwner = loggedData.login === selectedRepository?.owner.login;
      if (oidArray && contentPath) {
        createCommitOnBranch(token, {
          branch: {
            branchName: selectedBranch,
            repositoryNameWithOwner: `${
              isOwner
                ? loggedData.login
                : selectedOrganization !== '---'
                ? selectedOrganization
                : selectedRepository.owner.login
            }/${selectedRepository?.name}`,
          },
          expectedHeadOid: oidArray[0].oid,
          message: {
            headline: data.commitMessage.length
              ? data.commitMessage
              : contentPath,
          },
          fileChanges: {
            additions: [
              {
                path: contentPath,
                contents: doBuffer,
              },
            ],
          },
        }).then((x) => {
          setMarkdownBase(markdownEdit);
          setSendingToGIT(false);
          setSelectedRepository((prev) => {
            if (
              prev &&
              prev.defaultBranchRef &&
              prev.defaultBranchRef.name &&
              x.commit?.oid
            ) {
              return {
                ...prev,
                defaultBranchRef: {
                  name: prev.defaultBranchRef.name,
                  target: { history: { nodes: [{ oid: x.commit.oid }] } },
                },
              };
            } else {
              return prev;
            }
          });
        });
      }
    }
  };

  const onPullRequestSubmit: SubmitHandler<PullRequestInput> = (data) => {
    console.log(data);
    setSendingToGIT(true);
    if (
      token &&
      loggedData &&
      markdownEdit &&
      selectedRepository &&
      contentPath
    ) {
      const doBuffer = Buffer.from(markdownEdit, 'utf-8').toString('base64');
      const oidArray = selectedRepository?.refs?.nodes?.find(
        (x) => x.name === selectedBranch,
      )?.target?.history.nodes;
      const isOwner = loggedData.login === selectedRepository?.owner.login;
      if (oidArray)
        createBranch(token, {
          name: `refs/heads/${data.newBranchName!}`, // uniwersalna nazwa brancha !!!
          oid: oidArray[0].oid,
          repositoryId: selectedRepository.id,
        }).then((createdBranch) => {
          const oidArray = createdBranch.ref?.target?.history.nodes;

          if (createdBranch && oidArray) {
            createCommitOnBranch(token, {
              branch: {
                branchName: createdBranch.ref?.name,
                repositoryNameWithOwner: `${
                  isOwner
                    ? loggedData.login
                    : selectedOrganization !== '---'
                    ? selectedOrganization
                    : selectedRepository.owner.login
                }/${selectedRepository?.name}`,
              },
              expectedHeadOid: oidArray[0].oid,
              message: {
                headline: data.commitMessage.length
                  ? data.commitMessage
                  : contentPath,
              },
              fileChanges: {
                additions: [
                  {
                    path: contentPath,
                    contents: doBuffer,
                  },
                ],
              },
            }).then((x) => {
              if (createdBranch && createdBranch.ref)
                createPullRequest(token, {
                  baseRefName: data.selectedTargetBranch,
                  headRefName: createdBranch.ref.name,
                  repositoryId: selectedRepository.id,
                  title: data.pullRequestTitle,
                  body: data.pullRequestMessage,
                }).then((x) => {
                  setSendingToGIT(false);
                  setMarkdownBase(markdownEdit);
                  setSelectedFile(undefined);
                  setMarkdownBase('Pick markdown');
                  setMarkdownEdit('Pick markdown');
                  setLoadingFullTree(true);
                  setContentPath((prev) => {
                    if (prev) {
                      if (prev.lastIndexOf('/') === -1) {
                        return undefined;
                      } else {
                        return prev.slice(0, prev.lastIndexOf('/'));
                      }
                    } else {
                      return undefined;
                    }
                  });
                });
            });
          }
        });
    }
  };

  const handlePress = (input: SingleFileType) => {
    switch (input.extension) {
      case '.md': {
        setSelectedFile(input);
        setLoadingFullTree(true);
        setContentPath(
          contentPath ? contentPath + '/' + input.name : input.name,
        );
        setterForContentFile(
          token!,
          selectedRepository,
          contentPath ? contentPath + '/' + input.name : input.name,
          selectedBranch!,
          selectedOrganization!,
          loggedData?.login === selectedRepository?.owner.login,
          setMarkdownEdit,
          setMarkdownBase,
          setLoadingFullTree,
        );

        break;
      }
      case '': {
        setContentPath((prev) => {
          if (!prev) {
            return `${input.name}`;
          } else {
            return prev + `/${input.name}`;
          }
        });
        break;
      }
      case undefined:
        break;
    }
  };

  const handleRepositoryPick = (repository: RepositoryType) => {
    setLoadingFullTree(true);
    setSelectedRepository(repository);
    setSelectedBranch(repository.defaultBranchRef?.name);
    if (
      repository &&
      repository.defaultBranchRef &&
      token &&
      contentPath !== ''
    )
      setterForRespositoryContent(
        token,
        contentPath ? contentPath : '',
        selectedOrganization,
        repository.defaultBranchRef?.name,
        repository,
        loggedData?.login === repository.owner.login,
        setSelectedRepositoryContent,
        setLoadingFullTree,
      );
  };

  const resetContentPath = () => {
    setContentPath((prev) => {
      if (prev) {
        if (prev.lastIndexOf('/') === -1) {
          setLoadingFullTree(false);
          setSelectedFile(undefined);
          return undefined;
        } else {
          return prev.slice(0, prev.lastIndexOf('/'));
        }
      } else {
        setLoadingFullTree(false);
        setSelectedRepository(undefined);
        return undefined;
      }
    });
    resetMarkdown();
  };
  return (
    <Layout isEditor pageTitle="MDtx Editor">
      <div className="max-w-[25vw] relative">
        <Menu
          commitingMode={commitingMode}
          setCommitingMode={setCommitingMode}
          contentPath={contentPath}
          selectedFile={selectedFile}
          filteredRepositories={filteredRepositories}
          selectedOrganization={selectedOrganization}
          setSelectedOrganization={setSelectedOrganization}
          selectedBranch={selectedBranch}
          setSelectedBranch={setSelectedBranch}
          autoCompleteValue={autoCompleteValue}
          setAutoCompleteValue={setAutoCompleteValue}
          organizationList={organizationList}
          loadingFullTree={loadingFullTree}
          setLoadingFullTree={setLoadingFullTree}
          loggedData={loggedData}
          isOpen={openMenu}
          selectedRepository={selectedRepository}
          selectedRepositoryContent={selectedRepositoryContent}
          handleRepositoryPick={handleRepositoryPick}
          handlePress={handlePress}
          resetContentPath={resetContentPath}
          errorsCommit={errorsCommit}
          handleSubmitCommit={handleSubmitCommit}
          markdownBase={markdownBase}
          markdownEdit={markdownEdit}
          onCommitSubmit={onCommitSubmit}
          registerCommit={registerCommit}
          errorsPullRequest={errorsPullRequest}
          handleSubmitPullRequest={handleSubmitPullRequest}
          onPullRequestSubmit={onPullRequestSubmit}
          registerPullRequest={registerPullRequest}
        />
        <div
          className="cursor-pointer select-none z-[99] flex justify-center items-center absolute bottom-[1.6rem] right-[-1.6rem] w-[3.2rem] h-[3.2rem] rounded-full bg-mdtxOrange0"
          onClick={() => {
            setOpenMenu((prev) => !prev);
          }}
        >
          <div
            className={`${
              openMenu ? 'rotate-0' : 'ml-[0.8rem] rotate-[-180deg]'
            } flex justify-center items-center max-w-[1.6rem] max-h-[1.6rem] transition-all duration-500 ease-in-out`}
          >
            <ArrowLeft />
          </div>
        </div>
      </div>
      <div className="w-full">
        <MDEditor
          height={'100vh'}
          value={markdownEdit}
          onChange={setMarkdownEdit}
        />
      </div>
    </Layout>
  );
};

export default editor;
