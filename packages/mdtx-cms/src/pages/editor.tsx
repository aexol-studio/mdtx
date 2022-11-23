import React, { useEffect, useState } from 'react';
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
  // ORGANIZATION = 'ORGANIZATION',
  ORGANIZATIONS = 'ORGANIZATIONS',
}

export type RepositoryFromSearch = {
  name: string;
  full_name: string;
  default_branch: string;
  id: string;
  node_id: string;
  owner: {
    avatar_url: string;
    login: string;
  };
  permissions: {
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
    control: controlCommit,
    handleSubmit: handleSubmitCommit,
    watch: watchCommit,
    reset: resetCommitForm,
    formState: { errors: errorsCommit },
  } = useForm<CommitInput>();

  const {
    control: controlPullRequest,
    handleSubmit: handleSubmitPullRequest,
    watch: watchPullRequest,
    reset: resetPullRequestForm,
    setValue: setValuePullRequestForm,
    formState: { errors: errorsPullRequest },
  } = useForm<PullRequestInput>();

  const {
    getGithubUser,
    getUserOrganizations,
    getRepositoryAsZIP,
    getRepositoryBranches,
  } = useGithubCalls();
  const { createCommitOnBranch, getOid, createBranch, createPullRequest } =
    useGithubActions();

  const {
    getSelectedFileByPath,
    setSelectedFileContentByPath,
    setFiles,
    setImagesToDisplay,
    setOrginalFiles,
    isFilesDirty,
    modifiedFiles,
    resetState,
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
  const [submittingCommit, setSubmittingCommit] = useState(false);
  const [submittingPullRequest, setPullRequest] = useState(false);
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

  const confirmBranchClick = async (branchName?: string) => {
    if (token && selectedRepository && selectedBranch) {
      setDownloadZIP(true);
      const JSONResponse = await getRepositoryAsZIP(
        token,
        selectedRepository?.full_name,
        branchName ? branchName : selectedBranch?.name,
      );
      if (JSONResponse) {
        const paths = JSONResponse.fileArray.filter((z) =>
          z.name.includes('.md'),
        );
        const images = JSONResponse.fileArray.filter(
          (z) =>
            z.name.includes('.png') ||
            z.name.includes('.jpg') ||
            z.name.includes('.jpeg') ||
            z.name.includes('.gif'),
        );
        const tree = treeBuilder(paths);
        setRepositoryTree(tree);
        setFiles(paths);
        setOrginalFiles(paths);
        setImagesToDisplay(images);
        setAutoCompleteValue('');
        setRepositoriesFromSearch(undefined);
        setDownloadZIP(false);
        setDownloadModal(false);
      }
    }
  };
  const handleRepositoryPick = async (item: RepositoryFromSearch) => {
    setSelectedRepository(item);
    if (token) {
      const response = await getRepositoryBranches(token, item.full_name);
      if (response) {
        setDownloadModal(true);
        setAvailableBranches(response);
        setSelectedBranch(response[0]);
        setValuePullRequestForm('selectedTargetBranch', response[0].name);
      }
    }
  };
  const onCommitSubmit: SubmitHandler<CommitInput> = async (data) => {
    setSubmittingCommit(true);
    const filesToSend: { path: string; contents: string }[] = [];
    modifiedFiles.map((x) => {
      const doBuffer = Buffer.from(x.content, 'utf-8').toString('base64');
      filesToSend.push({
        path: x.name.slice(x.name.indexOf('/') + 1),
        contents: doBuffer,
      });
    });
    if (
      token &&
      filesToSend &&
      selectedRepository &&
      modifiedFiles &&
      selectedBranch
    ) {
      getOid(token, {
        branchName: selectedBranch.name,
        repositoryName: selectedRepository.name,
        repositoryOwner: selectedRepository.owner.login,
      }).then((oidArray) => {
        createCommitOnBranch(token, {
          branch: {
            branchName: selectedBranch.name,
            repositoryNameWithOwner: selectedRepository.full_name,
          },
          expectedHeadOid: oidArray[0].oid,
          message: {
            headline: data.commitHeadlineMessage,
            body: data.commitBodyMessage,
          },
          fileChanges: {
            additions: filesToSend,
          },
        }).then((createdCommit) => {
          if (createdCommit.commit?.oid) {
            resetState();
            confirmBranchClick().then(() => {
              setSubmittingCommit(false);
              setMenuModal(undefined);
            });
          }
        });
      });
    }
  };
  const onPullRequestSubmit: SubmitHandler<PullRequestInput> = (data) => {
    setPullRequest(true);
    const filesToSend: { path: string; contents: string }[] = [];
    modifiedFiles.map((x) => {
      const doBuffer = Buffer.from(x.content, 'utf-8').toString('base64');
      filesToSend.push({
        path: x.name.slice(x.name.indexOf('/') + 1),
        contents: doBuffer,
      });
    });
    if (
      token &&
      filesToSend &&
      selectedRepository &&
      modifiedFiles &&
      selectedBranch
    ) {
      getOid(token, {
        branchName: selectedBranch.name,
        repositoryName: selectedRepository.name,
        repositoryOwner: selectedRepository.owner.login,
      }).then((oidArray) => {
        createBranch(token, {
          name: `refs/heads/${data.newBranchName}`, // uniwersalna nazwa brancha !!!
          oid: oidArray[0].oid,
          repositoryId: selectedRepository.node_id,
        }).then((createdBranch) => {
          const ref = createdBranch.ref;
          if (ref) {
            createCommitOnBranch(token, {
              branch: {
                branchName: ref.name,
                repositoryNameWithOwner: selectedRepository.full_name,
              },
              expectedHeadOid: oidArray[0].oid,
              message: {
                headline: data.commitHeadlineMessage,
                body: data.commitBodyMessage,
              },
              fileChanges: {
                additions: filesToSend,
              },
            }).then((createdCommit) => {
              if (createdCommit) {
                createPullRequest(token, {
                  baseRefName: data.selectedTargetBranch,
                  headRefName: ref.name,
                  repositoryId: selectedRepository.node_id,
                  title: data.pullRequestTitle,
                  body: data.pullRequestMessage,
                }).then((pr) => {
                  if (pr.pullRequest) {
                    resetState();
                    confirmBranchClick(ref.name).then(() => {
                      setPullRequest(false);
                      setMenuModal(undefined);
                    });
                  }
                });
              }
            });
          }
        });
      });
    }
  };
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (
        autoCompleteValue !== '' &&
        autoCompleteValue !== undefined &&
        !loadingFullTree
      ) {
        setLoadingFullTree(true);
        setRepositoriesFromSearch(undefined);
        setSelectedRepository(undefined);
        setRepositoryTree(undefined);
        resetState();
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
    }, 750);
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
          customClassName="flex flex-col w-[60rem] h-[30rem]"
          blockingState={downloadZIP}
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
          blockingState={submittingCommit}
          closeFnc={() => setMenuModal(undefined)}
        >
          <CommitModal
            selectedBranch={selectedBranch}
            controlCommit={controlCommit}
            submittingCommit={submittingCommit}
            handleSubmitCommit={handleSubmitCommit}
            onCommitSubmit={onCommitSubmit}
          />
        </Modal>
      )}
      {menuModal === MenuModalType.PULL_REQUEST && (
        <Modal
          customClassName="flex flex-col justify-center items-center w-[50rem] h-[45rem]"
          blockingState={submittingPullRequest}
          closeFnc={() => setMenuModal(undefined)}
        >
          <PullRequestModal
            allowedRepositories={availableBranches}
            submittingPullRequest={submittingPullRequest}
            controlPullRequest={controlPullRequest}
            handleSubmitPullRequest={handleSubmitPullRequest}
            onPullRequestSubmit={onPullRequestSubmit}
          />
        </Modal>
      )}
      {isFilesDirty && (
        <ButtonMenu
          permissions={selectedRepository?.permissions}
          setMenuModal={setMenuModal}
        />
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
          handleRepositoryPick={handleRepositoryPick}
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
          previewOptions={{
            transformImageUri: (src) => {
              return !src.includes('https') || !src.includes('http')
                ? `https://github.com/${selectedRepository?.full_name}/blob/${selectedBranch?.name}/${src}?raw=true`
                : src;
            },
          }}
          onChange={(e) => {
            setSelectedFileContentByPath(e ? e : '');
          }}
        />
      </div>
    </Layout>
  );
};

export default editor;
