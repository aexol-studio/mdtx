import React, { useEffect, useState } from 'react';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useForm, SubmitHandler } from 'react-hook-form';
import {
  CommitInput,
  PullRequestInput,
  Menu,
  BackButton,
  Button,
  Modal,
  BranchSelector,
} from '../components';
import { useFileState, useAuthState } from '../containers';
import { Layout } from '../layouts';
import { useGithubCalls } from '../utils';
import { useGithubActions } from '../utils/useGithubActions';
import { treeBuilder, TreeMenu } from '../utils/treeBuilder';
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

export type Organization = {
  login: string;
};

enum SearchingType {
  ALL = 'ALL',
  ALLALLOWED = 'ALLALLOWED',
  USER = 'USER',
  ORGANIZATION = 'ORGANIZATION',
  ORGANIZATIONS = 'ORGANIZATIONS',
}

export type RepositoryFromSearch = {
  name: string;
  full_name: string;
  default_branch: string;
  id: string;
  permission: {
    admin: boolean;
    maintain: boolean;
    push: boolean;
    triage: boolean;
    pull: boolean;
  };
};
export type availableBranchType = {
  commit: {
    sha: string;
    url: string;
  };
  name: string;
  protected: false;
};

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
  const { getGithubUser, getUserOrganizations, getRepositoryAsZIP } =
    useGithubCalls();
  const { createCommitOnBranch, getOid } = useGithubActions();
  const {
    getSelectedFileByPath,
    setSelectedFileContentByPath,
    isFilesDirty,
    modifiedFiles,
  } = useFileState();
  const router = useRouter();
  const { setFiles, setOrginalFiles } = useFileState();
  const {
    token,
    isLoggedIn,
    setLoggedData,
    loggedData,
    setTokenWithLocal,
    setIsLoggedIn,
  } = useAuthState();

  ///////////////////////
  ///      States     ///
  ///////////////////////
  const [availableBranches, setAvailableBranches] =
    useState<availableBranchType[]>();
  const [selectedBranch, setSelectedBranch] = useState<availableBranchType>();
  const [repositoryTree, setRepositoryTree] = useState<TreeMenu>();
  const [openMenu, setOpenMenu] = useState(true);
  const [commitingMode, setCommitingMode] = useState<CommitingModes>(
    CommitingModes.PULL_REQUEST,
  );
  const [selectedRepository, setSelectedRepository] =
    useState<RepositoryFromSearch>();
  const [repositoriesFromSearch, setRepositoriesFromSearch] =
    useState<RepositoryFromSearch[]>();

  const [autoCompleteValue, setAutoCompleteValue] = useState<
    string | undefined
  >();

  const [searchingMode, setSearchingMode] = useState<SearchingType>(
    SearchingType.ALL,
  );
  const [downloadZIP, setDownloadZIP] = useState(false);
  const [loadingFullTree, setLoadingFullTree] = useState(false);
  const [organizations, setOrganizations] = useState<Organization[]>();

  const [commitMenu, setCommitMenu] = useState(false);

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
          setLoggedData(data.loginData);
          getUserOrganizations(data.accessToken).then((res) => {
            setOrganizations(res);
          });
          router.replace('/editor');
          setIsLoggedIn(true);
        });
    }
  }, []);

  /// First Load ///
  useEffect(() => {
    const unloadCallback = (event: {
      preventDefault: () => void;
      returnValue: string;
    }) => {
      event.preventDefault();
      event.returnValue = '';
      return '';
    };

    window.addEventListener('beforeunload', unloadCallback);
    return () => window.removeEventListener('beforeunload', unloadCallback);
  }, []);
  useEffect(() => {
    if (isLoggedIn && token) {
      getGithubUser(token).then((res) => {
        if (res) {
          getUserOrganizations(token).then((response) =>
            setOrganizations(response),
          );
          setIsLoggedIn(true);
          setLoggedData(res);
        }
      });
    }
  }, [isLoggedIn]);

  const onCommitSubmit: SubmitHandler<CommitInput> = async (data) => {
    const filesToSend: { path: string; contents: string }[] = [];
    const repoOwner = selectedRepository?.full_name.split('/')[0];
    const repoName = selectedRepository?.full_name.split('/')[1];
    if (token && filesToSend && repoOwner && repoName) {
      modifiedFiles.map((x) => {
        const doBuffer = Buffer.from(x.content, 'utf-8').toString('base64');
        filesToSend.push({
          path: x.name.slice(x.name.indexOf('/') + 1),
          contents: doBuffer,
        });
      });
      getOid(token, {
        branchName: modifiedFiles[0].name.split('-')[1].split('/')[0],
        repositoryName: repoName,
        repositoryOwner: repoOwner,
      }).then((x) => {
        createCommitOnBranch(token, {
          branch: {
            branchName: modifiedFiles[0].name.split('-')[1].split('/')[0],
            repositoryNameWithOwner: selectedRepository?.full_name,
          },
          expectedHeadOid: x[0].oid,
          message: {
            headline: data.commitMessage,
          },
          fileChanges: {
            additions: filesToSend,
          },
        });
      });
    }
  };

  const confirmBranchClick = async () => {
    if (token && selectedRepository && selectedBranch) {
      setDownloadZIP(true);
      const JSONResponse = await getRepositoryAsZIP(
        token,
        selectedRepository?.full_name,
        selectedBranch?.name,
      );
      if (JSONResponse) {
        const paths = JSONResponse.fileArray.filter((z) =>
          z.name.includes('.md'),
        );
        const tree = treeBuilder(paths);
        setRepositoryTree(tree);
        setFiles(paths);
        setOrginalFiles(paths);
        setAutoCompleteValue('');
        setAvailableBranches(undefined);
        setRepositoriesFromSearch(undefined);
        setDownloadZIP(false);
      }
    }
  };

  const onPullRequestSubmit: SubmitHandler<PullRequestInput> = (data) => {};

  // //COMMITS
  // const onCommitSubmit: SubmitHandler<CommitInput> = (data) => {
  //   console.log(data);
  //   setSendingToGIT(true);
  //   if (loggedData && token && markdownEdit) {
  //     const doBuffer = Buffer.from(markdownEdit, 'utf-8').toString('base64');
  //     const oidArray = selectedRepository?.refs?.nodes?.find(
  //       (x) => x.name === selectedBranch,
  //     )?.target?.history.nodes;
  //     const isOwner = loggedData.login === selectedRepository?.owner.login;
  //     if (oidArray && contentPath) {
  //       createCommitOnBranch(token, {
  //         branch: {
  //           branchName: selectedBranch,
  //           repositoryNameWithOwner: `${
  //             isOwner
  //               ? loggedData.login
  //               : selectedOrganization !== '---'
  //               ? selectedOrganization
  //               : selectedRepository.owner.login
  //           }/${selectedRepository?.name}`,
  //         },
  //         expectedHeadOid: oidArray[0].oid,
  //         message: {
  //           headline: data.commitMessage.length
  //             ? data.commitMessage
  //             : contentPath,
  //         },
  //         fileChanges: {
  //           additions: [
  //             {
  //               path: contentPath,
  //               contents: doBuffer,
  //             },
  //           ],
  //         },
  //       }).then((x) => {
  //         setMarkdownBase(markdownEdit);
  //         setSendingToGIT(false);
  //         setSelectedRepository((prev) => {
  //           if (
  //             prev &&
  //             prev.defaultBranchRef &&
  //             prev.defaultBranchRef.name &&
  //             x.commit?.oid
  //           ) {
  //             return {
  //               ...prev,
  //               defaultBranchRef: {
  //                 name: prev.defaultBranchRef.name,
  //                 target: { history: { nodes: [{ oid: x.commit.oid }] } },
  //               },
  //             };
  //           } else {
  //             return prev;
  //           }
  //         });
  //       });
  //     }
  //   }
  // };

  // const onPullRequestSubmit: SubmitHandler<PullRequestInput> = (data) => {
  //   console.log(data);
  //   setSendingToGIT(true);
  //   if (
  //     token &&
  //     loggedData &&
  //     markdownEdit &&
  //     selectedRepository &&
  //     contentPath
  //   ) {
  //     const doBuffer = Buffer.from(markdownEdit, 'utf-8').toString('base64');
  //     const oidArray = selectedRepository?.refs?.nodes?.find(
  //       (x) => x.name === selectedBranch,
  //     )?.target?.history.nodes;
  //     const isOwner = loggedData.login === selectedRepository?.owner.login;
  //     if (oidArray)
  //       createBranch(token, {
  //         name: `refs/heads/${data.newBranchName!}`, // uniwersalna nazwa brancha !!!
  //         oid: oidArray[0].oid,
  //         repositoryId: selectedRepository.id,
  //       }).then((createdBranch) => {
  //         const oidArray = createdBranch.ref?.target?.history.nodes;

  //         if (createdBranch && oidArray) {
  //           createCommitOnBranch(token, {
  //             branch: {
  //               branchName: createdBranch.ref?.name,
  //               repositoryNameWithOwner: `${
  //                 isOwner
  //                   ? loggedData.login
  //                   : selectedOrganization !== '---'
  //                   ? selectedOrganization
  //                   : selectedRepository.owner.login
  //               }/${selectedRepository?.name}`,
  //             },
  //             expectedHeadOid: oidArray[0].oid,
  //             message: {
  //               headline: data.commitMessage.length
  //                 ? data.commitMessage
  //                 : contentPath,
  //             },
  //             fileChanges: {
  //               additions: [
  //                 {
  //                   path: contentPath,
  //                   contents: doBuffer,
  //                 },
  //               ],
  //             },
  //           }).then((x) => {
  //             if (createdBranch && createdBranch.ref)
  //               createPullRequest(token, {
  //                 baseRefName: data.selectedTargetBranch,
  //                 headRefName: createdBranch.ref.name,
  //                 repositoryId: selectedRepository.id,
  //                 title: data.pullRequestTitle,
  //                 body: data.pullRequestMessage,
  //               }).then((x) => {
  //                 setSendingToGIT(false);
  //                 setMarkdownBase(markdownEdit);
  //                 setSelectedFile(undefined);
  //                 setMarkdownBase('Pick markdown');
  //                 setMarkdownEdit('Pick markdown');
  //                 setLoadingFullTree(true);
  //                 setContentPath((prev) => {
  //                   if (prev) {
  //                     if (prev.lastIndexOf('/') === -1) {
  //                       return undefined;
  //                     } else {
  //                       return prev.slice(0, prev.lastIndexOf('/'));
  //                     }
  //                   } else {
  //                     return undefined;
  //                   }
  //                 });
  //               });
  //           });
  //         }
  //       });
  //   }
  // };
  // if (repositoryTree && pickedFileID)
  //   console.log(getTreeObjectByID(repositoryTree, pickedFileID));
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (autoCompleteValue !== '') {
        setLoadingFullTree(true);
        setRepositoriesFromSearch(undefined);
        setSelectedRepository(undefined);
        setRepositoryTree(undefined);
        const organizationsString = organizations
          ?.map((x) => `%20org:${x.login}`)
          .toString()
          .replaceAll(',', '');
        const response = await fetch(
          `https://api.github.com/search/repositories?q=${autoCompleteValue}${
            searchingMode === SearchingType.USER ||
            searchingMode === SearchingType.ALLALLOWED
              ? `%20user:${loggedData?.login}`
              : ''
          }${
            searchingMode === SearchingType.ORGANIZATIONS ||
            searchingMode === SearchingType.ALLALLOWED
              ? organizationsString
              : ''
          }&per_page=100`,
          {
            method: 'GET',
            headers: {
              Accept: 'application/vnd.github+json',
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const res = await response.json();
        setRepositoriesFromSearch(res.items);
        setLoadingFullTree(false);
      }
    }, 500);
    return () => {
      setRepositoriesFromSearch(undefined);
      setLoadingFullTree(false);
      clearTimeout(timer);
    };
  }, [autoCompleteValue]);
  return (
    <Layout isEditor pageTitle="MDtx Editor">
      {availableBranches?.length && (
        <Modal
          customClassName="flex flex-col w-[60rem] h-[20rem]"
          closeFnc={() => {
            setAvailableBranches(undefined);
          }}
        >
          <BranchSelector
            downloadZIP={downloadZIP}
            selectedRepository={selectedRepository}
            availableBranches={availableBranches}
            confirmBranchClick={confirmBranchClick}
            selectedBranch={selectedBranch}
            setSelectedBranch={setSelectedBranch}
          />
        </Modal>
      )}
      {isFilesDirty && commitMenu && (
        <Modal
          customClassName="flex flex-col w-[80%] h-[80%]"
          closeFnc={() => {
            setCommitMenu(false);
          }}
        >
          <div className="w-full h-full flex flex-col justify-center items-center">
            <div>
              <p className="text-mdtxWhite uppercase text-[1.2rem] font-[700] select-none tracking-wide">
                Changed files
              </p>
            </div>
            <div className="h-[12rem] overflow-y-scroll overflow-x-hidden scrollbar">
              {modifiedFiles.map((file) => (
                <div className="flex flex-col">
                  <p className="text-white">{file.name}</p>
                </div>
              ))}
            </div>

            <form
              className="flex gap-[0.8rem]"
              onSubmit={handleSubmitCommit(onCommitSubmit)}
            >
              <input
                {...registerCommit('commitMessage', {
                  required: true,
                })}
                placeholder="Commit message"
              />
              <Button
                customClassName="px-[0.4rem] py-[0.2rem]"
                type="form"
                text="Wyślij"
                color="orange"
              />
            </form>
          </div>
        </Modal>
      )}
      {isFilesDirty ? (
        <div
          onClick={() => {
            setCommitMenu(true);
          }}
          className="py-[1.2rem] px-[0.8rem] cursor-pointer flex justify-center items-center z-[99] rounded-full absolute bottom-[1.2rem] right-[2.4rem] bg-mdtxOrange0"
        >
          <p className="text-center w-fit text-mdtxWhite uppercase text-[1.2rem] font-[700] select-none tracking-wide">
            Apply your changes
          </p>
        </div>
      ) : (
        <></>
      )}
      <div className="relative">
        <Menu
          autoCompleteValue={autoCompleteValue}
          setAutoCompleteValue={setAutoCompleteValue}
          isOpen={openMenu}
          loadingFullTree={loadingFullTree}
          repositoryTree={repositoryTree}
          repositoriesFromSearch={repositoriesFromSearch}
          selectedBranch={selectedBranch}
          setSelectedBranch={setSelectedBranch}
          setAvailableBranches={setAvailableBranches}
          setSelectedRepository={setSelectedRepository}
        />
        <BackButton
          state={openMenu}
          onClick={() => {
            setOpenMenu((prev) => !prev);
          }}
        />
      </div>
      <div className="w-full">
        <MDEditor
          height={'100vh'}
          value={getSelectedFileByPath()?.content}
          onChange={(e) => {
            setSelectedFileContentByPath(e ? e : '');
          }}
        />
      </div>
    </Layout>
  );
};

export default editor;
