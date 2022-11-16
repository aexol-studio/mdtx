import React, { useEffect, useState } from 'react';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import dynamic from 'next/dynamic';
import { Layout } from '../layouts';
import { ArrowLeft } from '../assets';
import { useRouter } from 'next/router';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Menu, PullRequestInput } from '../components';
import { useAuthState } from '../containers';
import { CommitInput } from '../components/CMS/molecules/CommitForm';
import { useGithubCalls } from '../utils';
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
  permission: {
    admin: boolean;
    maintain: boolean;
    push: boolean;
    triage: boolean;
    pull: boolean;
  };
};

export type FileArray = {
  content: string;
  dir: boolean;
  name: string;
};

type SearchForm = {
  repositoryName: string;
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
    register: registerSearch,
    handleSubmit: handleSubmitSearch,
    watch: watchSearch,
    reset: resetSearchForm,
    formState: { errors: errorsSearch },
  } = useForm<SearchForm>();
  const {
    register: registerPullRequest,
    handleSubmit: handleSubmitPullRequest,
    watch: watchPullRequest,
    reset: resetPullRequestForm,
    formState: { errors: errorsPullRequest },
  } = useForm<PullRequestInput>();
  const { getGithubUser, getUserOrganizations } = useGithubCalls();
  const router = useRouter();
  const {
    token,
    isLoggedIn,
    setLoggedData,
    loggedData,
    setTokenWithLocal,
    setIsLoggedIn,
  } = useAuthState();
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

  const [commitingMode, setCommitingMode] = useState<CommitingModes>(
    CommitingModes.PULL_REQUEST,
  );

  const [repositoriesFromSearch, setRepositoriesFromSearch] =
    useState<RepositoryFromSearch[]>();

  const [autoCompleteValue, setAutoCompleteValue] = useState<
    string | undefined
  >();

  const [searchingMode, setSearchingMode] = useState<SearchingType>(
    SearchingType.ALL,
  );

  const [loadingFullTree, setLoadingFullTree] = useState(false);
  const [organizations, setOrganizations] = useState<Organization[]>();
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
          console.log(data);
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
  const onCommitSubmit: SubmitHandler<CommitInput> = (data) => {};
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

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (autoCompleteValue !== '') {
        setLoadingFullTree(true);
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
      setLoadingFullTree(false);
      clearTimeout(timer);
    };
  }, [autoCompleteValue]);

  return (
    <Layout isEditor pageTitle="MDtx Editor">
      <div className="max-w-[25vw] relative">
        <Menu
          markdownBase={markdownBase}
          setMarkdownBase={setMarkdownBase}
          markdownEdit={markdownEdit}
          setMarkdownEdit={setMarkdownEdit}
          repositoriesFromSearch={repositoriesFromSearch}
          setRepositoriesFromSearch={setRepositoriesFromSearch}
          commitingMode={commitingMode}
          setCommitingMode={setCommitingMode}
          autoCompleteValue={autoCompleteValue}
          setAutoCompleteValue={setAutoCompleteValue}
          loadingFullTree={loadingFullTree}
          loggedData={loggedData}
          isOpen={openMenu}
          errorsCommit={errorsCommit}
          handleSubmitCommit={handleSubmitCommit}
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
