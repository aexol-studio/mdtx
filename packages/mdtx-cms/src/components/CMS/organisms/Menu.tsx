import { MDtxLogo } from '@/src/assets';
import { useAuthState, UserType } from '@/src/containers';
import {
  CommitingModes,
  FileArray,
  RepositoryFromSearch,
} from '@/src/pages/editor';
import React, { useState } from 'react';
import {
  UseFormRegister,
  UseFormHandleSubmit,
  FieldErrorsImpl,
  SubmitHandler,
} from 'react-hook-form';
import { PulseLoader } from 'react-spinners';
import { Button, UserInfo } from '../atoms';
import {
  CommitInput,
  MenuModeSection,
  MenuModeSectionInterface,
  Mode,
  PullRequestInput,
} from '../molecules';

type Omitted = Omit<
  Omit<Omit<MenuModeSectionInterface, 'setMode'>, 'setLeaveWithChanges'>,
  'sameMarkdown'
>;

type availableBranchType = {
  commit: {
    sha: string;
    url: string;
  };
  name: string;
  protected: false;
};

export interface MenuInteface extends Omitted {
  isOpen: boolean;
  loadingFullTree: boolean;
  loggedData?: UserType;
  setCommitingMode: React.Dispatch<React.SetStateAction<CommitingModes>>;
  markdownEdit?: string;
  markdownBase?: string;
  registerCommit: UseFormRegister<CommitInput>;
  handleSubmitCommit: UseFormHandleSubmit<CommitInput>;
  errorsCommit: Partial<FieldErrorsImpl<CommitInput>>;
  onCommitSubmit: SubmitHandler<CommitInput>;
  commitingMode: CommitingModes;
  registerPullRequest: UseFormRegister<PullRequestInput>;
  handleSubmitPullRequest: UseFormHandleSubmit<PullRequestInput>;
  errorsPullRequest: Partial<FieldErrorsImpl<PullRequestInput>>;
  onPullRequestSubmit: SubmitHandler<PullRequestInput>;
  repositoriesFromSearch?: RepositoryFromSearch[];
  setRepositoriesFromSearch: React.Dispatch<
    React.SetStateAction<RepositoryFromSearch[] | undefined>
  >;
  setMarkdownBase: React.Dispatch<React.SetStateAction<string | undefined>>;
  setMarkdownEdit: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export const Menu: React.FC<MenuInteface> = ({
  autoCompleteValue,
  setAutoCompleteValue,
  isOpen,
  loadingFullTree,
  loggedData,
  setCommitingMode,
  registerCommit,
  handleSubmitCommit,
  onCommitSubmit,
  markdownBase,
  markdownEdit,
  errorsCommit,
  commitingMode,
  registerPullRequest,
  handleSubmitPullRequest,
  errorsPullRequest,
  onPullRequestSubmit,
  repositoriesFromSearch,
  setRepositoriesFromSearch,
  setMarkdownBase,
  setMarkdownEdit,
}) => {
  const { token } = useAuthState();

  const [mode, setMode] = useState<Mode | undefined>(Mode.SEARCHING);
  const [leaveWithChanges, setLeaveWithChanges] = useState(false);
  const [repositoryTree, setRepositoryTree] = useState<FileArray[]>();
  const [availableBranches, setAvailableBranches] =
    useState<availableBranchType[]>();
  const [selectedBranch, setSelectedBranch] = useState<availableBranchType>();
  const [selectedRepository, setSelectedRepository] =
    useState<RepositoryFromSearch>();

  console.log(selectedBranch);
  return (
    <div
      className={`${
        isOpen ? 'w-[300px]' : 'invisible w-0'
      } relative transition-all duration-500 ease-in-out select-none h-screen bg-mdtxBlack border-r-[2px] border-r-solid border-r-mdtxOrange0 flex flex-col items-center`}
    >
      <div
        className={`${
          isOpen
            ? 'translate-x-[0%] duration-[900ms]'
            : 'translate-x-[-25vw] duration-[300ms]'
        } w-full h-full transition-transform ease-in-out relative flex flex-col`}
      >
        {availableBranches && (
          <div className="w-full h-full fixed z-[2] bg-[#ffffff90]">
            <select
              defaultValue={JSON.stringify(availableBranches[0])}
              onChange={(e) => setSelectedBranch(JSON.parse(e.target.value))}
            >
              {availableBranches.map((branch) => (
                <option key={branch.name} value={JSON.stringify(branch)}>
                  {branch.name}
                </option>
              ))}
            </select>
            <div>
              <Button
                color="orange"
                text="Accept"
                onClick={async () => {
                  const response = await fetch('/api/getRepositoryAsZip', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      token: token,
                      fullName: selectedRepository?.full_name,
                      branchName: selectedBranch?.name,
                    }),
                  });
                  const JsonResponse: { fileArray: FileArray[] } =
                    await response.json();
                  if (JsonResponse) {
                    setRepositoryTree(JsonResponse.fileArray);
                    // setLoadingFullTree(false);
                    setAutoCompleteValue('');
                    setAvailableBranches(undefined);
                    setRepositoriesFromSearch(undefined);
                  }
                }}
              />
            </div>
          </div>
        )}
        <div className="w-full p-8 flex items-center justify-between">
          <MDtxLogo small />
          <UserInfo loggedData={loggedData} />
        </div>
        <div className="relative w-full border-b-[1px] border-mdtxOrange0 pb-[5.6rem]">
          <MenuModeSection
            mode={mode}
            setMode={setMode}
            autoCompleteValue={autoCompleteValue}
            setAutoCompleteValue={setAutoCompleteValue}
          />
        </div>
        <div className="w-full flex-1 overflow-y-auto">
          {loadingFullTree ? (
            <div className="mt-[4.2rem] flex justify-center w-full">
              <PulseLoader size={'16px'} color="#FF7200" />
            </div>
          ) : (
            <div className="pl-[1.6rem] pt-[1.6rem] overflow-y-scroll scrollbar flex flex-col gap-[0.4rem] justify-start w-full">
              <>
                {repositoriesFromSearch && repositoriesFromSearch.length > 0
                  ? repositoriesFromSearch.map((item) => (
                      <div
                        onClick={async () => {
                          // setLoadingFullTree(true);
                          setSelectedRepository(item);
                          const response = await fetch(
                            `https://api.github.com/repos/${item.full_name}/branches`,
                            {
                              method: 'GET',
                              headers: {
                                Accept: 'application/vnd.github+json',
                                Authorization: `Bearer ${token}`,
                              },
                            },
                          );
                          const availableBranchesResponse =
                            await response.json();

                          if (availableBranchesResponse) {
                            setAvailableBranches(availableBranchesResponse);
                          }
                        }}
                        key={item.full_name}
                      >
                        <p className="text-white">{item.full_name}</p>
                      </div>
                    ))
                  : repositoryTree &&
                    repositoryTree.length > 0 &&
                    repositoryTree
                      .filter((x) => {
                        const mdRegex = /(.*)\.md$/;
                        return mdRegex.test(x.name);
                      })
                      .map((item) => (
                        <div
                          onClick={() => {
                            setMarkdownEdit(item.content);
                            setMarkdownBase(item.content);
                          }}
                          key={item.name}
                        >
                          <p className="text-white">
                            {item.name.slice(item.name.indexOf('/') + 1)}
                          </p>
                        </div>
                      ))}
              </>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

{
  /* <>
                  <div>
                    <div className="flex">
                      <Switcher
                        handlingFunction={() => {
                          setCommitingMode((prev) => {
                            if (prev === CommitingModes.COMMIT) {
                              return CommitingModes.PULL_REQUEST;
                            } else {
                              return CommitingModes.COMMIT;
                            }
                          });
                        }}
                      />
                    </div>
                    {commitingMode === 'COMMIT' ? (
                      <CommitForm
                        markdownBase={markdownBase}
                        markdownEdit={markdownEdit}
                        errorsCommit={errorsCommit}
                        handleSubmitCommit={handleSubmitCommit}
                        onCommitSubmit={onCommitSubmit}
                        registerCommit={registerCommit}
                      />
                    ) : (
                      <PullRequestForm
                        markdownBase={markdownBase}
                        markdownEdit={markdownEdit}
                        errorsPullRequest={errorsPullRequest}
                        handleSubmitPullRequest={handleSubmitPullRequest}
                        onPullRequestSubmit={onPullRequestSubmit}
                        registerPullRequest={registerPullRequest}
                      />
                    )}
                  </div>
                </> */
}
