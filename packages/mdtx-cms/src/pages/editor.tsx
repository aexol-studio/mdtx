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
import { treeBuilder, TreeMenu } from '../utils/treeBuilder';
import { useGitState } from '../containers/GitContainer';
import { useMDTXBackend } from '../utils/useMDTXBackend';
import { ConnectionType } from '../mdtx-backend-zeus/selectors';

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

export enum CommittingModes {
    COMMIT = 'COMMIT',
    PULL_REQUEST = 'PULL_REQUEST',
}

export enum WatchingModeOnRepository {
    REPOSITORY,
    PULL_REQUESTS,
}

export enum MenuType {
    SEARCH = 'SEARCH',
    COMMITTABLE = 'COMMITTABLE',
    SETTINGS = 'SETTINGS',
    FAVORITES = 'FAVORITES',
}

const editor = () => {
    const [menuType, setMenuType] = useState<MenuType | undefined>(MenuType.SEARCH);
    const handleMenuType = (p?: MenuType) => setMenuType(p);
    const router = useRouter();
    const { createToast } = useToasts();

    const { getGitHubToken, getGitHubAfterLoginInfo, doGitHubFork } = useGitHub();
    const { setFiles, setOriginalFiles, originalFiles, isFilesTouched, modifiedFiles, deletions, resetState } =
        useFileState();

    const { isLoggedIn, integrations } = useAuthState();

    const { selectedRepository, handleRepository, selectedBranch, handleBranch } = useRepositoryState();

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
    const [searchingMode, setSearchingMode] = useState<SearchingType>(SearchingType.ALL);
    const [organizations, setOrganizations] = useState<Organization[]>();
    const [autoCompleteValue, setAutoCompleteValue] = useState<string | undefined>();
    const [repositoriesFromSearch, setRepositoriesFromSearch] = useState<RepositoryFromSearch[]>();
    const [downloadModal, setDownloadModal] = useState(false);
    const [uploadModal, setUploadModal] = useState(false);
    const handleUploadModal = (p: boolean) => setUploadModal(p);
    const [availableBranches, setAvailableBranches] = useState<availableBranchType[]>();
    const [availablePullRequests, setAvailablePullRequests] = useState<PullRequestsType[]>();

    const [repositoryTree, setRepositoryTree] = useState<TreeMenu>();
    const [openMenu, setOpenMenu] = useState(true);
    const handleMenu = (p: boolean) => setOpenMenu(p);
    const [menuModal, setMenuModal] = useState<MenuModalType | undefined>();
    const handleMenuModal = (p?: MenuModalType) => setMenuModal(p);
    const [previewChanges, setPreviewChanges] = useState<{
        originalFile?: string;
        changedFile?: string;
    }>();
    const handlePreviewChanges = (p: { originalFile?: string; changedFile?: string }) => setPreviewChanges(p);
    const [submittingCommit, setSubmittingCommit] = useState(false);
    const [submittingPullRequest, setPullRequest] = useState(false);
    const [downloadZIP, setDownloadZIP] = useState(false);
    const [doingFork, setDoingFork] = useState(false);
    const [loadingFullTree, setLoadingFullTree] = useState(false);
    const { searchRepository, getTree, getBranches, doCommit, doPullRequest, getPullRequests } = useGitState();
    const [logging, setLogging] = useState(false);
    const { error, code, state } = router.query;
    const { createConnection, getConnections } = useMDTXBackend();
    const { setIntegrations, handleSearchInService, searchInService, logOut } = useAuthState();
    useEffect(() => {
        if (error) logOut();
        if (!integrations) {
            getConnections().then(res => {
                setIntegrations(res);
                if (res) handleSearchInService(res[0]);
            });
        }
        if (state && state.includes('SETTINGS')) handleMenuType(MenuType.SETTINGS);
        if (state && state.includes('GITHUB')) {
            if (code) {
                setLogging(true);
                getGitHubToken(code as string)
                    .then(async data => {
                        const response = await createConnection({
                            service: 'github',
                            token: data.token,
                            name: 'MDTX Github',
                        });
                        if (response) {
                            const conns = await getConnections();
                            setIntegrations(conns);
                            if (conns) handleSearchInService(conns[0]);
                            router.replace('/editor/');
                            setLogging(false);
                        }
                    })
                    .catch(() => {
                        createToast(ToastType.ERROR, 'Something went wrong. Refresh page.');
                        router.replace('/editor/?state=SETTINGS');
                        setLogging(false);
                    });
            }
        }
        // if (state && state.includes('GITLAB')) {
        //     console.log('Integracja z gitlabem'), code;
        //     router.replace('/editor/');
        // }
    }, [router.isReady, error, code, state]);

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
            setLogging(false);
        }
    };

    const zipController = new AbortController();
    const confirmBranchClick = async (
        owner?: string,
        repo?: string,
        branchName?: string,
        connection?: ConnectionType,
    ) => {
        if (branchName && owner && repo) {
            const branches = await getBranches({ owner, repo }, connection ? connection : searchInService!);
            setAvailableBranches(branches);
            handleBranch(branches?.find(o => o.name === branchName));
        }
        if (isLoggedIn) {
            setDownloadZIP(true);
            let input = {
                owner: owner ? owner : selectedRepository!.full_name.split('/')[0],
                repo: repo ? repo : selectedRepository!.full_name.split('/')[1],
                branch: branchName ? branchName : selectedBranch!.name,
            };
            const items = await getTree(input, connection ? connection : searchInService!);
            const onlyIMGRef = /(.*)\.(png|jpg|jpeg|gif|webp)$/;
            const onlyIMG = (p: string) => !!p.match(onlyIMGRef);
            const onlyMDReg = /(.*)\.md$/;
            const onlyMD = (p: string) => !!p.match(onlyMDReg);
            const filteredItems = items?.tree.filter(x => {
                const cleanedPath = x.path?.split('/');
                const wanted = cleanedPath?.at(cleanedPath.length - 1);
                if (wanted) {
                    return onlyMD(wanted) || onlyIMG(wanted);
                }
            });
            const paths = filteredItems?.map(x => ({
                content: undefined,
                dir: x.type === 'tree',
                name: selectedRepository ? `${selectedRepository.name}/${x.path}` : `${repo}/${x.path}`,
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
            handleMenuType(MenuType.SEARCH);
            return true;
        } else {
            return false;
        }
    };
    const handleRepositoryPick = async (item: RepositoryFromSearch, connection?: ConnectionType) => {
        handleRepository(item);
        if (isLoggedIn) {
            const input = {
                owner: item.full_name.split('/')[0],
                repo: item.full_name.split('/')[1],
            };
            const promiseBranches = getBranches(input, connection ? connection : searchInService!);
            const promisePullRequest = getPullRequests(input, connection ? connection : searchInService!);
            // const promiseForks = getGitHubRepositoryForks(input);
            // const promiseAboutFork = getGitHubRepositoryInfo(input);
            const [branches, pullRequests] = await Promise.all([
                promiseBranches,
                promisePullRequest,
                // promiseForks,
                // promiseAboutFork,
            ]);
            if (!branches) {
                createToast(ToastType.ERROR, 'We cannot download this repository');
                return;
            }
            setAvailablePullRequests(pullRequests);
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
                return true;
            } else {
                createToast(ToastType.ERROR, 'We cannot download this repository');
                setDownloadModal(false);
                return false;
            }
        }
    };

    const onCommitSubmit: SubmitHandler<CommitInput> = async data => {
        setSubmittingCommit(true);
        if (originalFiles && selectedRepository?.owner && selectedBranch) {
            const commit = await doCommit(
                {
                    branch: selectedBranch.name,
                    message: data.commitBodyMessage,
                    owner: selectedRepository.full_name.split('/')[0],
                    repo: selectedRepository.full_name.split('/')[1],
                },
                modifiedFiles,
                deletions,
                searchInService!,
            );
            if (commit) {
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
    const onPullRequestSubmit: SubmitHandler<PullRequestInput> = async data => {
        setPullRequest(true);
        if (originalFiles && selectedRepository?.owner && selectedBranch) {
            const pr = await doPullRequest(
                {
                    currentBranch: selectedBranch.name,
                    description: data.commitBodyMessage,
                    newBranch: data.newBranchName,
                    node_id: selectedRepository.node_id,
                    selectedBranchToMR: data.selectedTargetBranch,
                    title: data.pullRequestTitle,
                    message: data.pullRequestMessage,
                    owner: selectedRepository.full_name.split('/')[0],
                    repo: selectedRepository.full_name.split('/')[1],
                },
                modifiedFiles,
                deletions,
                searchInService!,
            );
            if (pr) {
                setRepositoryTree(undefined);
                resetState();
                const newResponse = await confirmBranchClick(
                    selectedRepository.full_name.split('/')[0],
                    selectedRepository.full_name.split('/')[1],
                    pr.pullRequest?.headRefName,
                );
                if (newResponse) {
                    setPullRequest(false);
                    handleMenuModal(undefined);
                }
            }
        }
    };

    const searchController = new AbortController();
    const { signal: searchSignal } = searchController;
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchInService && autoCompleteValue !== '' && autoCompleteValue !== undefined) {
                setLoadingFullTree(true);
                setRepositoriesFromSearch(undefined);
                handleRepository(undefined);
                setRepositoryTree(undefined);
                resetState();
                const organizationsString = organizations
                    ?.map(x => ` org:${x.login}`)
                    .toString()
                    .replaceAll(',', '');
                const queryString = `${autoCompleteValue}${
                    searchingMode === SearchingType.ORGANIZATIONS ? organizationsString : ''
                }${includeForks ? ` fork:true` : ``}`;
                searchRepository(
                    { searchQuery: searchInService.service === 'github' ? queryString : autoCompleteValue },
                    searchSignal,
                    searchInService,
                )
                    .then(res => {
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
            }).then(response => {
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
                files.map(async file => {
                    const buffer = await file.arrayBuffer();
                    const base64 = Buffer.from(buffer).toString('base64');
                    console.log(base64);
                }),
            );
        }
    };

    return (
        <Layout isEditor pageTitle="MDtx Editor">
            {logging && <LoadingModal />}
            {uploadModal && (
                <Modal
                    closeFnc={() => {
                        handleUploadModal(false);
                    }}>
                    <UploadModal images={images} handleImages={handleImages} onUploadSubmit={onUploadSubmit} />
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
                    }}>
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
                    }}>
                    <ChangesModal previewChanges={previewChanges} handlePreviewChanges={handlePreviewChanges} />
                </Modal>
            )}
            {menuModal === MenuModalType.COMMIT && (
                <Modal
                    customClassName="flex flex-col justify-center items-center w-[40rem] h-[30rem]"
                    blockingState={submittingCommit}
                    closeFnc={() => handleMenuModal(undefined)}>
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
                    closeFnc={() => handleMenuModal(undefined)}>
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
                    committableMenu={isFilesTouched && !!selectedRepository && !!repositoryTree}
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
