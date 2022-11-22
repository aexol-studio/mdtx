import React, { useEffect, useState } from 'react';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useForm, SubmitHandler } from 'react-hook-form';
import {
  Menu,
  BackButton,
  Modal,
  BranchSelector,
  ChangesModal,
  ButtonMenu,
  MenuModalType,
  CommitInput,
  CommitModal,
  PullRequestInput,
  PullRequestModal,
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
  const router = useRouter();
  const {
    register: registerCommit,
    handleSubmit: handleSubmitCommit,
    watch: watchCommit,
    reset: resetCommitForm,
    formState: { errors: errorsCommit },
  } = useForm<CommitInput>();

  const {
    control: controlPullRequest,
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
    setFiles,
    setOrginalFiles,
    isFilesDirty,
    modifiedFiles,
  } = useFileState();

  const {
    token,
    isLoggedIn,
    setLoggedData,
    loggedData,
    setTokenWithLocal,
    setIsLoggedIn,
  } = useAuthState();

  const [organizations, setOrganizations] = useState<Organization[]>();
  const [autoCompleteValue, setAutoCompleteValue] = useState<
    string | undefined
  >();
  const [repositoriesFromSearch, setRepositoriesFromSearch] =
    useState<RepositoryFromSearch[]>();
  const [downloadModal, setDownloadModal] = useState(false);
  const [availableBranches, setAvailableBranches] =
    useState<availableBranchType[]>();

  const [selectedRepository, setSelectedRepository] =
    useState<RepositoryFromSearch>();
  const [selectedBranch, setSelectedBranch] = useState<availableBranchType>();
  const [repositoryTree, setRepositoryTree] = useState<TreeMenu>();

  const [openMenu, setOpenMenu] = useState(true);
  const [menuModal, setMenuModal] = useState<MenuModalType | undefined>();
  const [previewChanges, setPreviewChanges] = useState<{
    orginalFile: string;
    changedFile: string;
  }>();

  const [searchingMode, setSearchingMode] = useState<SearchingType>(
    SearchingType.ALL,
  );

  const [downloadZIP, setDownloadZIP] = useState(false);
  const [loadingFullTree, setLoadingFullTree] = useState(false);

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
          router.replace('/editor');
          setIsLoggedIn(true);
        });
    }
  }, []);

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
        setRepositoriesFromSearch(undefined);
        setDownloadZIP(false);
        setDownloadModal(false);
      }
    }
  };

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
            headline: data.commitHeadlineMessage,
            body: data.commitBodyMessage,
          },
          fileChanges: {
            additions: filesToSend,
          },
        });
      });
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
      {downloadModal && availableBranches?.length && (
        <Modal
          customClassName="flex flex-col w-[60rem] h-[20rem]"
          closeFnc={() => {
            setDownloadModal(false);
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
      {menuModal === MenuModalType.CHANGES && (
        <Modal
          customClassName="flex flex-col w-[80%] h-[80%]"
          closeFnc={() => {
            setMenuModal(undefined);
          }}
        >
          <ChangesModal
            previewChanges={previewChanges}
            setPreviewChanges={setPreviewChanges}
          />
        </Modal>
      )}
      {menuModal === MenuModalType.COMMIT && (
        <Modal
          customClassName="flex flex-col justify-center items-center w-[40rem] h-[30rem]"
          closeFnc={() => setMenuModal(undefined)}
        >
          <CommitModal
            handleSubmitCommit={handleSubmitCommit}
            onCommitSubmit={onCommitSubmit}
            registerCommit={registerCommit}
          />
        </Modal>
      )}
      {menuModal === MenuModalType.PULL_REQUEST && (
        <Modal
          customClassName="flex flex-col justify-center items-center w-[50rem] h-[60rem]"
          closeFnc={() => setMenuModal(undefined)}
        >
          <PullRequestModal
            allowedRepositories={availableBranches?.filter(
              (x) => x.name !== selectedBranch?.name,
            )}
            controlPullRequest={controlPullRequest}
            handleSubmitPullRequest={handleSubmitPullRequest}
            onPullRequestSubmit={onPullRequestSubmit}
            registerPullRequest={registerPullRequest}
          />
        </Modal>
      )}
      {isFilesDirty && <ButtonMenu setMenuModal={setMenuModal} />}
      <div className="relative">
        <Menu
          setDownloadModal={setDownloadModal}
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
