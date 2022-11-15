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
import {
  allowedRepositiories,
  allowedRepositioriesType,
} from '../utils/allowedRepositiories';
import { Menu } from '../components';
import { setterForRespositoriesList } from '../utils/setterForRepositoriesList';
import { OrderDirection, RepositoryOrderField } from '../zeus';
import { setterForRespositoryContent } from '../utils/setterForRepositoryContent';
import { setterForContentFile } from '../utils/setterForContentFile';
import { useAuthState } from '../containers';
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });
enum CommitingModes {
  COMMIT,
  PULL_REQUEST,
}

enum WatchingModeOnRepository {
  REPOSITORY,
  PULL_REQUESTS,
}

type CommitInput = {
  commitMessage: string;
};

type PullRequestInput = {
  selectedTargetBranch: string;
  pullRequestMessage: string;
  pullRequestTitle: string;
  commitMessage: string;
  newBranchName?: string; /// i think it is good idea to generate it
};

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
  const { getUserInfo, createCommitOnBranch, createPullRequest, createBranch } =
    useBackend();
  ///////////////////////
  /// Markdown States ///
  ///////////////////////

  const [markdownEdit, setMarkdownEdit] = useState<string | undefined>(
    'Pick Markdown',
  );
  const [markdownBase, setMarkdownBase] = useState<string | undefined>(
    'Pick Markdown',
  );

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

  const [listOfAllowedRepositories, setListOfAllowedRepositories] = useState<
    allowedRepositioriesType[]
  >([]);

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
          if (data === 'No_installation') {
            router.push(process.env.NEXT_PUBLIC_INSTALLATION_LINK!);
          } else {
            const response = await allowedRepositiories(data.accessToken);
            setListOfAllowedRepositories(response);
            setTokenWithLocal(data.accessToken);
            setIsLoggedIn(true);
          }
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
        allowedRepositiories(token!).then(async (allowedRepositories) => {
          setListOfAllowedRepositories(allowedRepositories);
          const responseFromSetter = await setterForRespositoriesList(
            token,
            {
              first: 100,
              orderBy: {
                direction: OrderDirection.DESC,
                field: RepositoryOrderField.PUSHED_AT,
              },
            },
            selectedOrganization,
            allowedRepositories,
          );
          responseFromSetter?.map((allowed) => {
            if (allowed) {
              if ('nodes' in allowed) {
                setRepositoriesList((prev) => {
                  return { ...prev, nodes: allowed.nodes };
                });
              } else if ('name' in allowed) {
                setRepositoriesList((prev) => {
                  if (prev) {
                    if (prev.nodes) {
                      return { ...prev, nodes: [...prev.nodes, allowed] };
                    } else {
                      return { ...prev, nodes: [allowed] };
                    }
                  } else {
                    return { nodes: [allowed] };
                  }
                });
              }
            }
          });
          setLoadingFullTree(false);
        });
      });
    }
  }, [isLoggedIn]);

  /// Repositories refetch ///

  useEffect(() => {
    if (isLoggedIn && token) {
      setRepositoriesList(undefined);
      setterForRespositoriesList(
        token,
        {
          first: 100,
          orderBy: {
            direction: OrderDirection.DESC,
            field: RepositoryOrderField.PUSHED_AT,
          },
        },
        selectedOrganization,
        listOfAllowedRepositories,
      )
        .then((responseFromSetter) => {
          responseFromSetter?.map((allowed) => {
            if (allowed) {
              if ('nodes' in allowed) {
                setRepositoriesList((prev) => {
                  return { ...prev, nodes: allowed.nodes };
                });
              } else if ('name' in allowed) {
                setRepositoriesList((prev) => {
                  if (prev) {
                    if (prev.nodes) {
                      return { ...prev, nodes: [...prev.nodes, allowed] };
                    } else {
                      return { ...prev, nodes: [allowed] };
                    }
                  } else {
                    return { nodes: [allowed] };
                  }
                });
              }
            }
          });
        })
        .then(() => {
          setLoadingFullTree(false);
        });
    }
  }, [selectedOrganization]);

  useEffect(() => {
    if (isLoggedIn && token && selectedRepository) {
      setLoadingFullTree(true);
      setCommitingMode(CommitingModes.PULL_REQUEST);
      resetCommitForm();
      resetPullRequestForm();
      console.log(contentPath);
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
  console.log(contentPath);

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
  };
  return (
    <Layout isEditor pageTitle="MDtx Editor">
      <div className="max-w-[25vw] relative">
        <Menu
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

      <div className="select-none w-full max-w-[20vw] h-screen bg-[#13131C] border-r-[2px] border-r-solid border-r-white flex flex-col items-center">
        <div className="w-full border-b-[1px] border-white relative min-h-[30%] pt-[2.4rem]">
          {selectedRepository && (
            <>
              {!selectedFile && (
                <div className="bottom-[0.8rem] left-[0.8rem] absolute flex gap-[.8rem]">
                  <div
                    className="flex justify-center items-center relative w-[4.8rem] h-[2.4rem] rounded-[3.2rem] border-[2px] border-[#FFF]"
                    onClick={() => {
                      watchingModeOnRepository ===
                        WatchingModeOnRepository.REPOSITORY &&
                        setWatchingModeOnRepository(
                          WatchingModeOnRepository.PULL_REQUESTS,
                        );
                      watchingModeOnRepository ===
                        WatchingModeOnRepository.PULL_REQUESTS &&
                        setWatchingModeOnRepository(
                          WatchingModeOnRepository.REPOSITORY,
                        );
                    }}
                  >
                    <div
                      className={`${
                        watchingModeOnRepository ===
                        WatchingModeOnRepository.REPOSITORY
                          ? 'translate-x-[-70%]'
                          : 'translate-x-[70%]'
                      } transition-all ease-in-out duration-300 absolute bg-[#FFF] w-[1.6rem] h-[1.6rem] rounded-full`}
                    />
                  </div>
                  <p className="text-[#FFF]">
                    {watchingModeOnRepository ===
                    WatchingModeOnRepository.REPOSITORY
                      ? 'Repository'
                      : 'Pull requests'}
                  </p>
                </div>
              )}

              <p className="text-white absolute bottom-[.8rem] right-[.8rem]">
                Current branch
              </p>
            </>
          )}
          {selectedRepository && (
            <p className="text-white absolute bottom-[.8rem] right-[.8rem]">
              Current branch
            </p>
          )}
          <div>
            <div className="mt-[0.8rem] flex flex-col">
              <div className="max-w-[12.8rem] flex items-center justify-center flex-col mx-auto gap-[0.4rem]">
                {!selectedRepository && organizationList?.organizations?.nodes && (
                  <select
                    defaultValue={selectedOrganization}
                    onChange={(e) => {
                      setSelectedOrganization(e.target.value);
                      setLoadingFullTree(true);
                    }}
                  >
                    <option>---</option>
                    {organizationList.organizations.nodes.map((x) => {
                      return (
                        <option key={x.login} value={x.login}>
                          {x.login}
                        </option>
                      );
                    })}
                  </select>
                )}
                {!selectedRepository && (
                  <input
                    placeholder="Type to search"
                    value={autoCompleteValue}
                    onChange={(e) => {
                      setAutoCompleteValue(e.target.value);
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="relative pt-[1.6rem] pl-[1.6rem] min-h-[70%] scrollbar stroke-current overflow-x-hidden overflow-y-scroll w-full gap-[0.8rem]">
          {leaveWithChanges && selectedFile && (
            <div className="z-[10] left-0 top-0 absolute w-full h-full bg-[#31313CF2] px-[.8rem] py-[.4rem]">
              <p className="mt-[9.6rem] text-white text-center font-bold">
                Are you sure? You got uncommited changes
              </p>
              <div className="mt-[3.2rem] w-[80%] mx-auto gap-[1.6rem] flex justify-between">
                <div
                  onClick={() => {
                    setLeaveWithChanges(false);
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
                  }}
                  className="w-1/2 bg-[#0A58CA] rounded-[3.6rem] flex justify-center items-center"
                >
                  <p className="text-white">Yes</p>
                </div>
                <div
                  onClick={() => setLeaveWithChanges(false)}
                  className="w-1/2 flex justify-center items-center bg-[#13131C] rounded-[3.6rem]"
                >
                  <p className="text-white">No</p>
                </div>
              </div>
            </div>
          )}
          <>
            {loadingFullTree ? (
              <div className="flex w-full items-center justify-center">
                <ClipLoader color="#FFF" size={64} />
              </div>
            ) : (
              <div className="mt-[.8rem] flex flex-col items-start">
                {!selectedRepository ? (
                  <>
                    {filteredRepositories?.nodes &&
                    filteredRepositories.nodes.length > 0 ? (
                      filteredRepositories?.nodes?.map((repository) => {
                        return (
                          <div
                            onClick={() => {
                              handleRepositoryPick(repository);
                            }}
                            key={repository.name}
                          >
                            <p className="text-[#FFF]">{repository.name}</p>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-[#FFF]">Nothing there</p>
                    )}
                  </>
                ) : (
                  <>
                    {watchingModeOnRepository ===
                    WatchingModeOnRepository.PULL_REQUESTS ? (
                      <div className="w-full flex flex-col">
                        <div
                          className="w-full flex"
                          onClick={() => {
                            setSelectedRepository(undefined);
                            setWatchingModeOnRepository(
                              WatchingModeOnRepository.REPOSITORY,
                            );
                          }}
                        >
                          <BackIcon />
                          <p className="ml-[1.6rem] text-white">
                            {selectedRepository.name}
                          </p>
                        </div>
                        <div>
                          {selectedRepository.pullRequests?.nodes &&
                          selectedRepository.pullRequests.nodes?.filter(
                            (x) => !x.closed,
                          ).length > 0 ? (
                            <>
                              {selectedRepository.pullRequests.nodes
                                ?.filter((x) => !x.closed)
                                .map((pullRequest, idx) => (
                                  <div
                                    key={pullRequest.headRefName}
                                    onClick={() => {
                                      setSelectedFile(undefined);
                                      setMarkdownEdit('Pick markdown');
                                      setMarkdownBase('Pick markdown');
                                      setSelectedBranch(
                                        pullRequest.headRefName,
                                      );
                                      setWatchingModeOnRepository(
                                        WatchingModeOnRepository.REPOSITORY,
                                      );
                                    }}
                                    className={`${
                                      idx === 0 && 'border-t-[1px]'
                                    } border-b-[1px]`}
                                  >
                                    <div className="flex items-center gap-[.8rem]">
                                      {pullRequest?.author?.avatarUrl && (
                                        <div className="my-[0.8rem] relative w-[3.2rem] h-[3.2rem] rounded-full self-center">
                                          <Image
                                            priority
                                            width={64}
                                            height={64}
                                            className="rounded-full"
                                            alt="User Logo"
                                            src={pullRequest.author.avatarUrl}
                                          />
                                        </div>
                                      )}
                                      <p className="text-white">
                                        {pullRequest.author?.login}
                                      </p>
                                    </div>
                                    <p className="text-white">
                                      Branch: {pullRequest.headRefName}
                                    </p>
                                    <p className="text-white">
                                      Target to: {pullRequest.baseRefName}
                                    </p>
                                    <p className="text-white">
                                      {pullRequest.bodyText}
                                    </p>

                                    <p className="text-white">
                                      {dateFormatter(
                                        pullRequest.updatedAt,
                                        'dd.MM.yyyy hh:mm',
                                      )}
                                    </p>
                                  </div>
                                ))}
                            </>
                          ) : (
                            <>
                              <p className="text-white">
                                No pull requests on this repository
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col w-full">
                        <div className="flex w-full">
                          {contentPath?.length ? (
                            <div
                              onClick={() => {
                                if (markdownBase === markdownEdit) {
                                  setSelectedFile(undefined);
                                  setMarkdownBase('Pick markdown');
                                  setMarkdownEdit('Pick markdown');
                                  setLoadingFullTree(true);
                                  setContentPath((prev) => {
                                    if (prev) {
                                      if (prev.lastIndexOf('/') === -1) {
                                        return undefined;
                                      } else {
                                        return prev.slice(
                                          0,
                                          prev.lastIndexOf('/'),
                                        );
                                      }
                                    } else {
                                      return undefined;
                                    }
                                  });
                                } else {
                                  setLeaveWithChanges(true);
                                }
                              }}
                              className="relative w-full flex"
                            >
                              <BackIcon />
                              <p className="ml-[1.6rem] text-white">
                                {contentPath}
                              </p>
                            </div>
                          ) : (
                            <div
                              className="w-full flex"
                              onClick={() => {
                                setSelectedRepository(undefined);
                              }}
                            >
                              <BackIcon />
                              <p className="ml-[1.6rem] text-white">
                                {selectedRepository.name}
                              </p>
                            </div>
                          )}

                          {!contentPath ? (
                            <div className="w-[9.6rem]">
                              <select
                                className="w-full"
                                defaultValue={
                                  selectedBranch
                                    ? selectedBranch
                                    : selectedRepository.defaultBranchRef?.name
                                }
                                onChange={(e) => {
                                  setLoadingFullTree(true);
                                  setSelectedBranch(e.target.value);
                                }}
                              >
                                {selectedRepository.refs?.nodes?.map(
                                  (branch) => (
                                    <option
                                      key={branch.name}
                                      value={branch.name}
                                    >
                                      {branch.name}
                                    </option>
                                  ),
                                )}
                              </select>
                            </div>
                          ) : (
                            <p className="text-white">{selectedBranch}</p>
                          )}
                        </div>
                        {loadingFullTree ? (
                          <div className="flex w-full items-center justify-center">
                            <ClipLoader color="#FFF" size={64} />
                          </div>
                        ) : (
                          <div className="mt-[1.6rem]">
                            {!selectedFile ? (
                              <>
                                {selectedRepositoryContent &&
                                selectedRepositoryContent.object &&
                                selectedRepositoryContent.object.entries &&
                                selectedRepositoryContent.object.entries
                                  .length > 0 ? (
                                  selectedRepositoryContent?.object?.entries?.map(
                                    (content) => {
                                      return (
                                        <div
                                          onClick={() => {
                                            handlePress(content);
                                          }}
                                          key={content.name}
                                        >
                                          <p className="text-white">
                                            {content.name}
                                          </p>
                                        </div>
                                      );
                                    },
                                  )
                                ) : (
                                  <div>
                                    <p className="text-white">
                                      Nothing there :P
                                    </p>
                                  </div>
                                )}
                              </>
                            ) : (
                              <>
                                <div
                                  className="flex justify-center items-center relative w-[4.8rem] h-[2.4rem] rounded-[3.2rem] border-[2px] border-[#FFF]"
                                  onClick={() => {
                                    commitingMode === CommitingModes.COMMIT &&
                                      setCommitingMode(
                                        CommitingModes.PULL_REQUEST,
                                      );
                                    commitingMode ===
                                      CommitingModes.PULL_REQUEST &&
                                      setCommitingMode(CommitingModes.COMMIT);
                                  }}
                                >
                                  <div
                                    className={`${
                                      commitingMode ===
                                      CommitingModes.PULL_REQUEST
                                        ? 'translate-x-[-70%]'
                                        : 'translate-x-[70%]'
                                    } transition-all ease-in-out duration-300 absolute bg-[#FFF] w-[1.6rem] h-[1.6rem] rounded-full`}
                                  />
                                </div>
                                {sendingToGIT ? (
                                  <div>
                                    <ClipLoader color="#FFF" size={48} />
                                  </div>
                                ) : (
                                  <div>
                                    {commitingMode === CommitingModes.COMMIT ? (
                                      <div>
                                        <form
                                          className="flex flex-col"
                                          onSubmit={handleSubmitCommit(
                                            onCommitSubmit,
                                          )}
                                        >
                                          <p className="text-white italic font-bold">
                                            Commit
                                          </p>
                                          <input
                                            {...registerCommit(
                                              'commitMessage',
                                              {
                                                required: true,
                                              },
                                            )}
                                            placeholder="Commit message"
                                          />
                                          {markdownBase !== markdownEdit ? (
                                            <input
                                              className="text-white"
                                              type="submit"
                                            />
                                          ) : (
                                            <div>
                                              <p className="text-white">
                                                There are no changes to commit
                                              </p>
                                            </div>
                                          )}
                                        </form>
                                      </div>
                                    ) : (
                                      <div>
                                        {selectedRepository!.refs!.nodes!
                                          .length > 0 ? (
                                          <>
                                            <p className="text-white italic font-bold">
                                              Pull request
                                            </p>
                                            <form
                                              className="flex flex-col"
                                              onSubmit={handleSubmitPullRequest(
                                                onPullRequestSubmit,
                                              )}
                                            >
                                              <select
                                                {...registerPullRequest(
                                                  'selectedTargetBranch',
                                                  { required: true },
                                                )}
                                              >
                                                {selectedRepository.refs?.nodes?.map(
                                                  (branch) => {
                                                    return (
                                                      <option
                                                        key={branch.name}
                                                        value={branch.name}
                                                      >
                                                        {branch.name}
                                                      </option>
                                                    );
                                                  },
                                                )}
                                              </select>
                                              <input
                                                {...registerPullRequest(
                                                  'newBranchName',
                                                  { required: true },
                                                )}
                                                placeholder="New branch name"
                                              />
                                              <input
                                                {...registerPullRequest(
                                                  'pullRequestTitle',
                                                  { required: true },
                                                )}
                                                placeholder="Pull request title"
                                              />
                                              <input
                                                {...registerPullRequest(
                                                  'pullRequestMessage',
                                                  { required: true },
                                                )}
                                                placeholder="Pull request message"
                                              />
                                              <input
                                                {...registerPullRequest(
                                                  'commitMessage',
                                                  { required: true },
                                                )}
                                                placeholder="Commit message"
                                              />
                                              {markdownBase !== markdownEdit ? (
                                                <input
                                                  className="text-white"
                                                  type="submit"
                                                />
                                              ) : (
                                                <div>
                                                  <p className="text-white">
                                                    There are no changes
                                                  </p>
                                                </div>
                                              )}
                                            </form>
                                          </>
                                        ) : (
                                          <>
                                            <p className="text-white">
                                              There are no branch to make pull
                                              request to
                                            </p>
                                          </>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </>
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
