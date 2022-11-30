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
  SearchingType,
} from '../components';
import {
  useFileState,
  useAuthState,
  useToasts,
  ToastType,
} from '../containers';
import { Layout } from '../layouts';
import { useGithubCalls } from '../utils';
import { useGithubActions } from '../utils/useGithubActions';
import { treeBuilder, TreeMenu } from '../utils/treeBuilder';
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

export type Organization = {
  login: string;
};

export type RepositoryFromSearch = {
  name: string;
  full_name: string;
  default_branch: string;
  id: string;
  node_id: string;
  fork: boolean;
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
export type PullRequestsType = {
  base: {
    ref: string;
  };
  head: {
    ref: string;
  };
  user: {
    avatar_url: string;
    login: string;
  };
  title: string;
  body: string;
  updated_at: string;
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
    getRepositoryForks,
    getRepositoryPullRequests,
    getRepositoryFullInfo,
    getGithubUserRepos,
    getRepository,
    doRepositoryFork,
  } = useGithubCalls();
  const { createCommitOnBranch, getOid, createBranch, createPullRequest } =
    useGithubActions();

  const {
    getSelectedFileByPath,
    setSelectedFileContentByPath,
    setFiles,
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
    logOut,
  } = useAuthState();
  const [includeForks, setIncludeForks] = useState(true);
  const [forksOnRepo, setForksOnRepo] = useState<{ full_name: string }[]>();

  const [userRepos, setUserRepos] = useState<
    {
      full_name: string;
    }[]
  >();
  const [userForks, setUserForks] = useState<
    {
      full_name: string;
      source: { full_name: string; owner: { login: string } };
    }[]
  >();

  const [foundedFork, setFoundedFork] = useState(false);

  const [searchingMode, setSearchingMode] = useState<SearchingType>(
    SearchingType.ALL,
  );
  const [organizations, setOrganizations] = useState<Organization[]>();
  const [autoCompleteValue, setAutoCompleteValue] = useState<
    string | undefined
  >();
  const [repositoriesFromSearch, setRepositoriesFromSearch] =
    useState<RepositoryFromSearch[]>();
  const [downloadModal, setDownloadModal] = useState(false);
  const [availableBranches, setAvailableBranches] =
    useState<availableBranchType[]>();
  const [availablePullRequests, setAvailablePullRequests] =
    useState<PullRequestsType[]>();
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

  const [submittingCommit, setSubmittingCommit] = useState(false);
  const [submittingPullRequest, setPullRequest] = useState(false);
  const [downloadZIP, setDownloadZIP] = useState(false);
  const [doingFork, setDoingFork] = useState(false);
  const [loadingFullTree, setLoadingFullTree] = useState(false);
  const { createToast } = useToasts();
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
        .then((data) => {
          setTokenWithLocal(data.accessToken);
          setIsLoggedIn(true);
        })
        .finally(() => {
          router.replace('/editor');
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
      getGithubUser(token).then(async (res) => {
        if (res) {
          const promiseORGS = getUserOrganizations(token);
          const promiseUserRepos = getGithubUserRepos(token);
          const [orgs, repos] = await Promise.all([
            promiseORGS,
            promiseUserRepos,
          ]);
          setOrganizations(orgs);
          if (repos.length) {
            const tempArr: {
              full_name: string;
              source: { full_name: string; owner: { login: string } };
            }[] = [];
            repos
              .filter((x: { fork: boolean }) => x.fork)
              .map((z: { full_name: string }) =>
                getRepository(token, z.full_name).then((x) => tempArr.push(x)),
              );
            setUserRepos(repos);
            setUserForks(tempArr);
            setIsLoggedIn(true);
            setLoggedData(res);
          } else {
            logOut();
          }
        }
      });
    }
  }, [isLoggedIn, token]);
  const controllerZIP = new AbortController();

  const confirmBranchClick = async (branchName?: string) => {
    if (token && selectedRepository && selectedBranch) {
      setDownloadZIP(true);
      const JSONResponse = await getRepositoryAsZIP(
        token,
        selectedRepository?.full_name,
        branchName ? branchName : selectedBranch?.name,
        controllerZIP,
      );

      if (JSONResponse !== undefined) {
        const paths = JSONResponse.fileArray.filter(
          (z: { name: string | string[] }) => z.name.includes('.md'),
        );
        const tree = treeBuilder(paths);
        setRepositoryTree(tree);
        setFiles(paths);
        setOrginalFiles(paths);
        setAutoCompleteValue('');
        setRepositoriesFromSearch(undefined);
        setDownloadZIP(false);
        setDownloadModal(false);
        createToast(ToastType.SUCCESS, 'Done.');
      } else {
        setDownloadZIP(false);
        setDownloadModal(false);
        createToast(ToastType.SUCCESS, 'Error while downloading repository.');
      }
    }
  };
  const handleRepositoryPick = async (item: RepositoryFromSearch) => {
    setSelectedRepository(item);
    if (token) {
      const promiseBranches = getRepositoryBranches(token, item.full_name);
      const promisePullRequest = getRepositoryPullRequests(
        token,
        item.full_name,
      );
      const promiseForks = getRepositoryForks(token, item.full_name);
      const promiseAboutFork = getRepositoryFullInfo(token, item.full_name);
      const [branches, pullRequests, forks, aboutFork] = await Promise.all([
        promiseBranches,
        promisePullRequest,
        promiseForks,
        promiseAboutFork,
      ]);
      if (!branches) {
        createToast(ToastType.ERROR, 'We cannot download this repository');
        return;
      }
      setAvailablePullRequests(pullRequests);
      setForksOnRepo(forks);
      const isForked =
        userForks?.find(
          (x) => x?.source?.full_name === aboutFork?.source?.full_name,
        ) ||
        userForks?.find((x) => x?.source?.full_name === item.full_name) ||
        item.full_name === aboutFork?.source?.full_name;
      if (
        !!isForked ||
        !!userRepos?.find((x) => x.full_name === item.full_name)
      ) {
        setFoundedFork(true);
      } else {
        setFoundedFork(false);
      }
      if (branches.length) {
        setDownloadModal(true);
        setAvailableBranches(branches);
        setSelectedBranch(branches[0]);
        setValuePullRequestForm('selectedTargetBranch', branches[0].name);
      } else {
        createToast(ToastType.ERROR, 'We cannot download this repository');
        setDownloadModal(false);
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
          name: `refs/heads/${data.newBranchName}`,
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
  const controller = new AbortController();
  const { signal } = controller;
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (autoCompleteValue !== '' && autoCompleteValue !== undefined) {
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
          }${includeForks ? '%20fork:true' : ''}&per_page=100`,
          {
            signal: signal,
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
      controller.abort();
      clearTimeout(timer);
    };
  }, [autoCompleteValue, includeForks, searchingMode]);
  const backToSearch = () => {
    setRepositoryTree(undefined);
    setSelectedBranch(undefined);
    setAvailableBranches(undefined);
    setAvailablePullRequests(undefined);
    setRepositoryTree(undefined);
  };
  const doForkFunction = (fullName: string) => {
    if (token) {
      setDoingFork(true);
      createToast(ToastType.MESSAGE, 'Creating fork!');
      doRepositoryFork(token, fullName).then((response) => {
        if (response) {
          createToast(ToastType.SUCCESS, 'Fork created!');
          setAutoCompleteValue('');
          backToSearch();
          resetState();
          setDoingFork(false);
        }
      });
    }
  };

  return (
    <Layout isEditor pageTitle="MDtx Editor">
      {downloadModal && availableBranches?.length && (
        <Modal
          customClassName="flex flex-col w-[60rem] h-[40rem]"
          closeFnc={() => {
            setDownloadModal(false);
            backToSearch();
            resetState();
            setDownloadZIP(false);
            setDoingFork(false);
            controllerZIP.abort();
          }}
        >
          <BranchSelector
            doForkFunction={doForkFunction}
            foundedFork={foundedFork}
            doingFork={doingFork}
            downloadZIP={downloadZIP}
            selectedRepository={selectedRepository}
            availableBranches={availableBranches}
            availablePullRequests={availablePullRequests}
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
      {isFilesDirty && repositoryTree && selectedRepository && (
        <ButtonMenu
          forksOnRepo={forksOnRepo}
          selectedRepository={selectedRepository}
          setMenuModal={setMenuModal}
        />
      )}
      <div className="relative">
        <Menu
          setRepositoryTree={setRepositoryTree}
          searchingMode={searchingMode}
          setSearchingMode={setSearchingMode}
          forksOnRepo={forksOnRepo}
          includeForks={includeForks}
          setIncludeForks={setIncludeForks}
          selectedRepository={selectedRepository}
          backToSearch={backToSearch}
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
