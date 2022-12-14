import React, { useEffect, useState } from 'react';
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
  Editor,
  UploadModal,
} from '../components';
import {
  useFileState,
  useAuthState,
  useToasts,
  ToastType,
} from '../containers';
import { Layout } from '../layouts';
import { useGitHub } from '../utils';
import { useGithubActions } from '../utils/useGithubActions';
import { treeBuilder, TreeMenu } from '../utils/treeBuilder';

export type Organization = {
  login: string;
};

export type RepositoryFromSearch = {
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
  } | null;
  permissions?: {
    admin: boolean;
    maintain?: boolean;
    push?: boolean;
    triage?: boolean;
    pull?: boolean;
  };
};
export type availableBranchType = {
  commit: {
    sha: string;
    url: string;
  };
  name: string;
  protected?: boolean;
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
  } | null;
  title: string;
  body: string | null;
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

  const { createCommitOnBranch, getOid, createBranch, createPullRequest } =
    useGithubActions();
  const {
    setFiles,
    setOrginalFiles,
    isFilesDirty,
    modifiedFiles,
    resetState,
    creatingFilePath,
  } = useFileState();

  const {
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
      source?: { full_name: string; owner: { login: string } };
    }[]
  >();

  const [foundedFork, setFoundedFork] = useState(false);
  const [file, setFile] = useState<File>();
  const handleFile = (p: File) => setFile(p);
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
  const [uploadModal, setUploadModal] = useState(false);
  const handleUploadModal = (p: boolean) => setUploadModal(p);
  const [availableBranches, setAvailableBranches] =
    useState<availableBranchType[]>();
  const [availablePullRequests, setAvailablePullRequests] =
    useState<PullRequestsType[]>();
  const [selectedRepository, setSelectedRepository] =
    useState<RepositoryFromSearch>();
  const [selectedBranch, setSelectedBranch] = useState<availableBranchType>();
  const [repositoryTree, setRepositoryTree] = useState<TreeMenu>();
  const [openMenu, setOpenMenu] = useState(true);
  const handleMenu = () => setOpenMenu((prev) => !prev);
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

  const {
    getGitHubToken,
    getGitHubAfterLoginInfo,
    getGitHubRepositoryAsZIP,
    getGitHubRepositoryInfo,
    getGitHubSearchRepositories,
    getGitHubRepositoryBranches,
    getGitHubRepositoryPullRequests,
    getGitHubRepositoryForks,
    doGitHubFork,
    getContents,
  } = useGitHub();
  useEffect(() => {
    const error = router.query.error;
    const code = router.query.code;
    if (error) logOut();
    if (code) {
      getGitHubToken(code as string)
        .then((data) => {
          setTokenWithLocal(data.token);
          setIsLoggedIn(true);
          router.replace('/editor');
        })
        .catch(() => {
          logOut();
        });
    }
  }, [router.isReady]);

  const afterLoginInfo = async () => {
    const { orgs, repos, user } = await getGitHubAfterLoginInfo();
    setOrganizations(orgs);
    setUserRepos(repos);
    if (repos.length) {
      const tempArr: {
        full_name: string;
        source?: { full_name: string; owner: { login: string } };
      }[] = [];
      repos
        .filter((x) => x.fork)
        .map((z: { full_name: string }) =>
          getGitHubRepositoryInfo({
            owner: z.full_name.split('/')[0],
            repo: z.full_name.split('/')[1],
          }).then((x) => {
            if (x) {
              tempArr.push(x);
            }
          }),
        );
      setUserForks(tempArr);
      setLoggedData(user);
      setIsLoggedIn(true);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      afterLoginInfo();
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
    }
  }, [isLoggedIn]);

  const controllerZIP = new AbortController();

  const confirmBranchClick = async (branchName?: string) => {
    if (isLoggedIn && selectedRepository && selectedBranch) {
      setDownloadZIP(true);
      const response = await getGitHubRepositoryAsZIP({
        owner: selectedRepository?.full_name.split('/')[0],
        repo: selectedRepository?.full_name.split('/')[1],
        ref: branchName ? branchName : selectedBranch.name,
      });

      if (response !== undefined) {
        const wantedFiles = /(.*)\.(png|jpg|jpeg|gif|webp|md)$/;
        const isWanted = (p: string) => !!p.match(wantedFiles);
        const paths = response.filter((z) => isWanted(z.name));
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
    if (isLoggedIn) {
      const input = {
        owner: item.full_name.split('/')[0],
        repo: item.full_name.split('/')[1],
      };
      const promiseBranches = getGitHubRepositoryBranches(input);
      const promisePullRequest = getGitHubRepositoryPullRequests(input);
      const promiseForks = getGitHubRepositoryForks(input);
      const promiseAboutFork = getGitHubRepositoryInfo(input);
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
      filesToSend &&
      selectedRepository?.owner &&
      modifiedFiles &&
      selectedBranch
    ) {
      const oidArray = await getOid({
        branchName: selectedBranch.name,
        repositoryName: selectedRepository.name,
        repositoryOwner: selectedRepository.owner.login,
      });
      const createdCommit = await createCommitOnBranch({
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
      });
      if (oidArray && createdCommit.commit?.oid) {
        resetState();
        confirmBranchClick().then(() => {
          setSubmittingCommit(false);
          setMenuModal(undefined);
        });
      }
    }
  };
  const onPullRequestSubmit: SubmitHandler<PullRequestInput> = async (data) => {
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
      filesToSend &&
      selectedRepository?.owner &&
      modifiedFiles &&
      selectedBranch
    ) {
      const oidArray = await getOid({
        branchName: selectedBranch.name,
        repositoryName: selectedRepository.name,
        repositoryOwner: selectedRepository.owner.login,
      });
      const createdBranch = await createBranch({
        name: `refs/heads/${data.newBranchName}`,
        oid: oidArray[0].oid,
        repositoryId: selectedRepository.node_id,
      });
      const ref = createdBranch.ref;
      if (ref) {
        const createdCommit = await createCommitOnBranch({
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
        });
        if (createdCommit) {
          const createdPullReq = await createPullRequest({
            baseRefName: data.selectedTargetBranch,
            headRefName: ref.name,
            repositoryId: selectedRepository.node_id,
            title: data.pullRequestTitle,
            body: data.pullRequestMessage,
          });
          if (createdPullReq.pullRequest) {
            resetState();
            confirmBranchClick(ref.name).then(() => {
              setPullRequest(false);
              setMenuModal(undefined);
            });
          }
        }
      }
    }
  };

  const controller = new AbortController();
  const { signal } = controller;
  useEffect(() => {
    const timer = setTimeout(() => {
      if (autoCompleteValue !== '' && autoCompleteValue !== undefined) {
        setLoadingFullTree(true);
        setRepositoriesFromSearch(undefined);
        setSelectedRepository(undefined);
        setRepositoryTree(undefined);
        resetState();
        const organizationsString = organizations
          ?.map((x) => ` org:${x.login}`)
          .toString()
          .replaceAll(',', '');
        const queryString = `${autoCompleteValue}${
          searchingMode === SearchingType.USER ||
          searchingMode === SearchingType.ALLALLOWED
            ? ` user:${loggedData?.login}`
            : ''
        }${
          searchingMode === SearchingType.ORGANIZATIONS
            ? organizationsString
            : ''
        }${includeForks ? ` fork:true` : ``}`;
        getGitHubSearchRepositories(queryString, signal)
          .then((res) => {
            setRepositoriesFromSearch(res.items);
            setLoadingFullTree(false);
          })
          .catch(() => {
            setLoadingFullTree(false);
          });
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
    resetState();
  };

  const doForkFunction = (fullName: string) => {
    if (isLoggedIn) {
      setDoingFork(true);
      createToast(ToastType.MESSAGE, 'Creating fork!');
      doGitHubFork({
        owner: fullName.split('/')[0],
        repo: fullName.split('/')[1],
      }).then((response) => {
        if (response) {
          createToast(ToastType.SUCCESS, 'Fork created!');
          setAutoCompleteValue('');
          backToSearch();
          setDoingFork(false);
        }
      });
    }
  };

  const onUploadSubmit = async () => {
    const path = creatingFilePath?.slice(creatingFilePath.indexOf('/') + 1);
    if (file && selectedBranch && selectedRepository?.owner) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64 = buffer.toString('base64');
      const oidArray = await getOid({
        branchName: selectedBranch.name,
        repositoryName: selectedRepository.name,
        repositoryOwner: selectedRepository.owner.login,
      });
      const createdCommit = await createCommitOnBranch({
        branch: {
          branchName: selectedBranch.name,
          repositoryNameWithOwner: selectedRepository.full_name,
        },
        expectedHeadOid: oidArray[0].oid,
        message: {
          headline: 'Upload image',
          body: 'Upload image',
        },
        fileChanges: {
          additions: [
            {
              contents: base64,
              path: path ? path : '' + file.name,
            },
          ],
        },
      });
      if (oidArray && createdCommit.commit?.oid) {
        // resetState();
        confirmBranchClick().then(() => {
          handleUploadModal(false);
        });
      }
    }
  };

  return (
    <Layout isEditor pageTitle="MDtx Editor">
      {uploadModal && (
        <Modal
          closeFnc={() => {
            handleUploadModal(false);
          }}
        >
          <UploadModal
            file={file}
            handleFile={handleFile}
            onUploadSubmit={onUploadSubmit}
          />
        </Modal>
      )}
      {downloadModal && availableBranches?.length && (
        <Modal
          customClassName="flex flex-col w-[60rem] h-[40rem]"
          closeFnc={() => {
            setDownloadModal(false);
            backToSearch();
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
      <div className="fixed z-[100]">
        <Menu
          handleUploadModal={handleUploadModal}
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
          openMenu={openMenu}
          setOpenMenu={handleMenu}
          loadingFullTree={loadingFullTree}
          repositoryTree={repositoryTree}
          repositoriesFromSearch={repositoriesFromSearch}
          selectedBranch={selectedBranch}
          handleRepositoryPick={handleRepositoryPick}
        />
      </div>
      <div className="pl-[4.2rem] w-full">
        <Editor
          menuFnc={() => setMenuModal(MenuModalType.CHANGES)}
          selectedRepository={selectedRepository}
          selectedBranch={selectedBranch}
        />
      </div>
    </Layout>
  );
};

export default editor;
