import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useForm, SubmitHandler } from 'react-hook-form';
import {
  Menu,
  Modal,
  BranchSelector,
  ChangesModal,
  CommitInput,
  CommitModal,
  PullRequestInput,
  PullRequestModal,
  SearchingType,
  Editor,
  UploadModal,
  LoadingModal,
} from '../components';
import {
  useFileState,
  useAuthState,
  useToasts,
  ToastType,
  RepositoryFromSearch,
  availableBranchType,
  useRepositoryState,
} from '../containers';
import { Layout } from '../layouts';
import { useGitHub } from '../utils';
import { useGithubActions } from '../utils/useGithubActions';
import { treeBuilder, TreeMenu } from '../utils/treeBuilder';
import { Gitlab } from '@gitbeaker/browser';
import { useGitState } from '../containers/GitContainer';

export enum MenuModalType {
  COMMIT = 'COMMIT',
  PULL_REQUEST = 'PULL_REQUEST',
  FORK = 'FORK',
  CHANGES = 'CHANGES',
  UPLOAD = 'UPLOAD',
}

export type Organization = {
  login: string;
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

type RepositoriesCollection = {
  full_name: string;
  source?: { full_name: string; owner: { login: string } };
}[];

export enum CommitingModes {
  COMMIT = 'COMMIT',
  PULL_REQUEST = 'PULL_REQUEST',
}

export enum WatchingModeOnRepository {
  REPOSITORY,
  PULL_REQUESTS,
}

export enum MenuType {
  SEARCH = 'SEARCH',
  COMMITABLE = 'COMMITABLE',
  SETTINGS = 'SETTINGS',
}

type ConnectionType = {
  url?: string;
  applicationId?: string;
  id: string;
  name: string;
  token: string;
  service: string;
};
const editor = () => {
  const [menuType, setMenuType] = useState<MenuType | undefined>(
    MenuType.SEARCH,
  );
  const handleMenuType = (p?: MenuType) => setMenuType(p);
  const router = useRouter();
  const { createToast } = useToasts();

  const {
    getGitHubToken,
    getGitHubAfterLoginInfo,
    getGitHubRepositoryInfo,
    getGitHubSearchRepositories,
    getGitHubRepositoryBranches,
    getGitHubRepositoryPullRequests,
    getGitHubRepositoryForks,
    doGitHubFork,
    getGitHubRepositoryBranch,
    getGitHubTree,
  } = useGitHub();
  const { createCommitOnBranch, getOid, createBranch, createPullRequest } =
    useGithubActions();
  const {
    setFiles,
    setOriginalFiles,
    isFilesTouched,
    modifiedFiles,
    deletions,
    resetState,
    creatingFilePath,
  } = useFileState();

  const {
    isLoggedIn,
    setLoggedData,
    loggedData,
    setToken,
    setIsLoggedIn,
    setTokenWithLocal,
    logOut,
  } = useAuthState();

  const { selectedRepository, handleRepository, selectedBranch, handleBranch } =
    useRepositoryState();

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

  const [includeForks, setIncludeForks] = useState(true);
  const [foundedFork, setFoundedFork] = useState(false);
  const [forksOnRepo, setForksOnRepo] = useState<RepositoriesCollection>();
  const [userRepos, setUserRepos] = useState<RepositoriesCollection>();
  const [userForks, setUserForks] = useState<RepositoriesCollection>();

  const [images, setImages] = useState<FileList>();
  const handleImages = (p: FileList) => setImages(p);
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

  const [repositoryTree, setRepositoryTree] = useState<TreeMenu>();
  const [openMenu, setOpenMenu] = useState(true);
  const handleMenu = (p: boolean) => setOpenMenu(p);
  const [menuModal, setMenuModal] = useState<MenuModalType | undefined>();
  const handleMenuModal = (p?: MenuModalType) => setMenuModal(p);
  const [previewChanges, setPreviewChanges] = useState<{
    orginalFile?: string;
    changedFile?: string;
  }>();

  const [submittingCommit, setSubmittingCommit] = useState(false);
  const [submittingPullRequest, setPullRequest] = useState(false);
  const [downloadZIP, setDownloadZIP] = useState(false);
  const [doingFork, setDoingFork] = useState(false);
  const [loadingFullTree, setLoadingFullTree] = useState(false);
  const {
    connections,
    getRepository,
    searchRepository,
    getTree,
    getFile,
    getBranches,
    searchInService,
    handleSearchInService,
  } = useGitState();
  const [logging, setLogging] = useState(false);
  const { error, code, state } = router.query;

  useEffect(() => {
    if (state && state.includes('SETTINGS')) handleMenuType(MenuType.SETTINGS);
    if (state && state.includes('GITHUB')) {
      console.log('Integracja z githubem', code);
      router.replace('/editor/');
    }
    if (state && state.includes('GITLAB')) {
      console.log('Integracja z gitlabem'), code;
      router.replace('/editor/');
    }

    handleSearchInService(connections[0]);
    // getRepository(
    //   { owner: 'aexol', repo: 'aexol-company-manger' },
    //   connections[0],
    // ).then((res) => console.log(res));
    // getRepository({ owner: 'aexol-studio', repo: 'mdtx' }, connections[1]).then(
    //   (res) => console.log(res),
    // );
    getTree(
      { owner: 'aexol', repo: 'profitabee-landing', branch: 'develop' },
      connections[0],
    ).then((res) => {
      const onlyIMGRef = /(.*)\.(png|jpg|jpeg|gif|webp)$/;
      const onlyIMG = (p: string) => !!p.match(onlyIMGRef);
      const onlyMDReg = /(.*)\.md$/;
      const onlyMD = (p: string) => !!p.match(onlyMDReg);
      const filteredItems = res?.tree.filter((x) => {
        const cleanedPath = x.path?.split('/');
        const wanted = cleanedPath?.at(cleanedPath.length - 1);
        if (wanted) {
          return onlyMD(wanted) || onlyIMG(wanted);
        }
      });
      const paths = filteredItems?.map((x) => ({
        content: undefined,
        dir: x.type === 'tree',
        name: `aexol/${x.path}`,
      }));
      const tree = treeBuilder(paths!);
      setRepositoryTree(tree);
      setFiles(paths!);
      setOriginalFiles(paths!);
    });
    getTree(
      { owner: 'aexol-studio', repo: 'mdtx', branch: 'develop' },
      connections[1],
    ).then((res) => console.log(res));
    getFile(
      {
        owner: 'aexol-studio',
        repo: 'mdtx',
        branch: 'develop',
        path: 'Readme.md',
      },
      connections[1],
    ).then((res) =>
      console.log('🚀 ~ file: editor.tsx:288 ~ useEffect ~ res', res),
    );
    getFile(
      {
        owner: 'aexol',
        repo: 'profitabee-landing',
        branch: 'develop',
        path: 'packages/bddx/README.md',
      },
      connections[0],
    ).then((res) =>
      console.log('🚀 ~ file: editor.tsx:288 ~ useEffect ~ res', res),
    );
    // if (!isLoggedIn) {
    //   if (typeof error === 'string') logOut();
    //   if (typeof code === 'string' && code.length) {
    //     setLogging(true);
    //     getGitHubToken(code)
    //       .then((data) => {
    //         setTokenWithLocal(data.token);
    //         setIsLoggedIn(true);
    //         afterLoginInfo();
    //       })
    //       .catch(() => {
    //         createToast(ToastType.ERROR, 'Something went wrong. Refresh page.');
    //         setTimeout(() => {
    //           logOut();
    //         }, 500);
    //       });
    //   }
    // } else {
    //   setLogging(true);
    //   afterLoginInfo();
    // }
  }, [router.isReady, error, code, isLoggedIn]);

  // useEffect(() => {
  //   if (isLoggedIn) {
  //     // const unloadCallback = (event: {
  //     //   preventDefault: () => void;
  //     //   returnValue: string;
  //     // }) => {
  //     //   event.preventDefault();
  //     //   event.returnValue = '';
  //     //   return '';
  //     // };
  //     // window.addEventListener('beforeunload', unloadCallback);
  //     // return () => window.removeEventListener('beforeunload', unloadCallback);
  //   }
  // }, [isLoggedIn]);
  const afterLoginInfo = async () => {
    if (isLoggedIn) {
      router.replace('/editor');
      const { orgs, repos, user } = await getGitHubAfterLoginInfo();
      setOrganizations(orgs);
      setUserRepos(repos);
      const tempArr: {
        full_name: string;
        source?: { full_name: string; owner: { login: string } };
      }[] = [];
      // Promise.all(
      //   repos
      //     .filter((x) => x.fork)
      //     .map(async (z: { full_name: string }) => {
      //       const response = await getGitHubRepositoryInfo({
      //         owner: z.full_name.split('/')[0],
      //         repo: z.full_name.split('/')[1],
      //       });
      //       if (response) {
      //         tempArr.push(response);
      //       }
      //     }),
      // );
      setUserForks(tempArr);
      setLoggedData(user);
      setLogging(false);
    }
  };

  const zipController = new AbortController();
  const confirmBranchClick = async (branchName?: string) => {
    if (isLoggedIn && searchInService && selectedRepository) {
      setDownloadZIP(true);
      const input = {
        owner: selectedRepository.full_name.split('/')[0],
        repo: selectedRepository.full_name.split('/')[1],
        branch: branchName ? branchName : 'develop',
      };
      const items = await getTree(input, searchInService);
      const onlyIMGRef = /(.*)\.(png|jpg|jpeg|gif|webp)$/;
      const onlyIMG = (p: string) => !!p.match(onlyIMGRef);
      const onlyMDReg = /(.*)\.md$/;
      const onlyMD = (p: string) => !!p.match(onlyMDReg);
      const filteredItems = items?.tree.filter((x) => {
        const cleanedPath = x.path?.split('/');
        const wanted = cleanedPath?.at(cleanedPath.length - 1);
        if (wanted) {
          return onlyMD(wanted) || onlyIMG(wanted);
        }
      });
      const paths = filteredItems?.map((x) => ({
        content: undefined,
        dir: x.type === 'tree',
        name: `${selectedRepository.name}/${x.path}`,
      }));
      const tree = treeBuilder(paths!);
      setRepositoryTree(tree);
      setFiles(paths!);
      setOriginalFiles(paths);
      setAutoCompleteValue('');
      setRepositoriesFromSearch(undefined);
      setDownloadZIP(false);
      setDownloadModal(false);
      createToast(ToastType.SUCCESS, 'Done.');
      return true;
    } else {
      return false;
    }
  };
  const handleRepositoryPick = async (item: RepositoryFromSearch) => {
    handleRepository(item);
    if (isLoggedIn && searchInService) {
      const input = {
        owner: item.full_name.split('/')[0],
        repo: item.full_name.split('/')[1],
      };
      const promiseBranches = getBranches(input, searchInService);
      // const promisePullRequest = getGitHubRepositoryPullRequests(input);
      // const promiseForks = getGitHubRepositoryForks(input);
      // const promiseAboutFork = getGitHubRepositoryInfo(input);
      const [branches] = await Promise.all([
        promiseBranches,
        // promisePullRequest,
        // promiseForks,
        // promiseAboutFork,
      ]);
      if (!branches) {
        createToast(ToastType.ERROR, 'We cannot download this repository');
        return;
      }
      // setAvailablePullRequests(pullRequests);
      // setForksOnRepo(forks);
      // const isForked =
      //   userForks?.find(
      //     (x) => x?.source?.full_name === aboutFork?.source?.full_name,
      //   ) ||
      //   userForks?.find((x) => x?.source?.full_name === item.full_name) ||
      //   item.full_name === aboutFork?.source?.full_name;
      // if (
      //   !!isForked ||
      //   !!userRepos?.find((x) => x.full_name === item.full_name)
      // ) {
      //   setFoundedFork(true);
      // } else {
      //   setFoundedFork(false);
      // }
      if (branches.length) {
        setDownloadModal(true);
        setAvailableBranches(branches);
        handleBranch(branches[0]);
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
      if (x.content) {
        const doBuffer = Buffer.from(x.content, 'utf-8').toString('base64');
        filesToSend.push({
          path: x.name.slice(x.name.indexOf('/') + 1),
          contents: doBuffer,
        });
      }
    });
    const filesToDelete: { path: string }[] = [];
    deletions.map((x) => {
      filesToDelete.push({
        path: x.name.slice(x.name.indexOf('/') + 1),
      });
    });
    if (selectedRepository?.owner && selectedBranch) {
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
          deletions: filesToDelete,
        },
      });
      if (oidArray && createdCommit.commit?.oid) {
        setRepositoryTree(undefined);
        resetState();
        const newResponse = await confirmBranchClick();
        if (newResponse) {
          setSubmittingCommit(false);
          handleMenuModal(undefined);
        }
      }
    }
  };
  const onPullRequestSubmit: SubmitHandler<PullRequestInput> = async (data) => {
    setPullRequest(true);
    const filesToSend: { path: string; contents: string }[] = [];
    modifiedFiles.map((x) => {
      if (x.content) {
        const doBuffer = Buffer.from(x.content, 'utf-8').toString('base64');
        filesToSend.push({
          path: x.name.slice(x.name.indexOf('/') + 1),
          contents: doBuffer,
        });
      }
    });
    const filesToDelete: { path: string; contents: string }[] = [];
    deletions.map((x) => {
      if (x.content) {
        const doBuffer = Buffer.from(x.content, 'utf-8').toString('base64');
        filesToDelete.push({
          path: x.name.slice(x.name.indexOf('/') + 1),
          contents: doBuffer,
        });
      }
    });
    if (selectedRepository?.owner && selectedBranch) {
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
            deletions: filesToDelete,
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
            setRepositoryTree(undefined);
            resetState();
            const newResponse = await confirmBranchClick();
            if (newResponse) {
              setSubmittingCommit(false);
              handleMenuModal(undefined);
            }
          }
        }
      }
    }
  };

  const searchController = new AbortController();
  const { signal: searchSignal } = searchController;
  useEffect(() => {
    const timer = setTimeout(() => {
      if (
        searchInService &&
        autoCompleteValue !== '' &&
        autoCompleteValue !== undefined
      ) {
        setLoadingFullTree(true);
        setRepositoriesFromSearch(undefined);
        handleRepository(undefined);
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
        searchRepository(
          { searchQuery: autoCompleteValue },
          searchSignal,
          searchInService,
        )
          .then((res) => {
            setRepositoriesFromSearch(res);
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
      searchController.abort();
      clearTimeout(timer);
    };
  }, [autoCompleteValue, includeForks, searchingMode, searchInService]);

  const backToSearch = () => {
    handleRepository(undefined);
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
    if (images?.length) {
      const files = Array.from(images);
      Promise.all(
        files.map(async (file) => {
          const buffer = await file.arrayBuffer();
          const base64 = Buffer.from(buffer).toString('base64');
          console.log(base64);
        }),
      );
    }
  };

  return (
    <Layout isEditor pageTitle="MDtx Editor">
      {logging && !loggedData && <LoadingModal />}
      {uploadModal && (
        <Modal
          closeFnc={() => {
            handleUploadModal(false);
          }}
        >
          <UploadModal
            images={images}
            handleImages={handleImages}
            onUploadSubmit={onUploadSubmit}
          />
        </Modal>
      )}
      {downloadModal && availableBranches?.length && (
        <Modal
          customClassName="flex flex-col w-[70rem] h-[40rem]"
          closeFnc={() => {
            setDownloadModal(false);
            backToSearch();
            setDownloadZIP(false);
            setDoingFork(false);
            zipController.abort();
          }}
        >
          <BranchSelector
            doForkFunction={doForkFunction}
            foundedFork={foundedFork}
            doingFork={doingFork}
            downloadZIP={downloadZIP}
            availableBranches={availableBranches}
            availablePullRequests={availablePullRequests}
            confirmBranchClick={confirmBranchClick}
          />
        </Modal>
      )}
      {menuModal === MenuModalType.CHANGES && (
        <Modal
          customClassName="flex flex-col w-[80%] h-[80%]"
          closeFnc={() => {
            handleMenuModal(undefined);
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
          closeFnc={() => handleMenuModal(undefined)}
        >
          <CommitModal
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
          closeFnc={() => handleMenuModal(undefined)}
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
      <div className="z-[100]">
        <Menu
          menuType={menuType}
          handleMenuType={handleMenuType}
          searchInService={searchInService}
          handleSearchInService={handleSearchInService}
          commitableMenu={
            isFilesTouched && !!selectedRepository && !!repositoryTree
          }
          handleMenuModal={handleMenuModal}
          handleUploadModal={handleUploadModal}
          setRepositoryTree={setRepositoryTree}
          searchingMode={searchingMode}
          setSearchingMode={setSearchingMode}
          forksOnRepo={forksOnRepo}
          includeForks={includeForks}
          setIncludeForks={setIncludeForks}
          backToSearch={backToSearch}
          autoCompleteValue={autoCompleteValue}
          setAutoCompleteValue={setAutoCompleteValue}
          openMenu={openMenu}
          setOpenMenu={handleMenu}
          loadingFullTree={loadingFullTree}
          repositoryTree={repositoryTree}
          repositoriesFromSearch={repositoriesFromSearch}
          handleRepositoryPick={handleRepositoryPick}
        />
      </div>
      <div className="w-full">
        <Editor />
      </div>
    </Layout>
  );
};

export default editor;
