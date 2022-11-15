import { MDtxLogo } from '@/src/assets';
import {
  RepositoriesType,
  RepositoryContentType,
  RepositoryType,
  SingleFileType,
  UserType,
} from '@/src/backend';
import { useAuthState } from '@/src/containers';
import { CommitingModes } from '@/src/pages/editor';
import React, { useState } from 'react';
import {
  UseFormRegister,
  UseFormHandleSubmit,
  FieldErrorsImpl,
  SubmitHandler,
} from 'react-hook-form';
import { PulseLoader } from 'react-spinners';
import { Button, Switcher, UserInfo } from '../atoms';
import {
  CommitForm,
  CommitInput,
  LeaveConfirmation,
  MenuModeSection,
  MenuModeSectionInterface,
  Mode,
  PullRequestForm,
  PullRequestInput,
} from '../molecules';

type Omitted = Omit<
  Omit<Omit<MenuModeSectionInterface, 'setMode'>, 'setLeaveWithChanges'>,
  'sameMarkdown'
>;

export interface MenuInteface extends Omitted {
  filteredRepositories?: RepositoriesType;
  isOpen: boolean;
  loadingFullTree: boolean;
  loggedData?: Omit<UserType, 'organizations'>;
  selectedRepositoryContent?: RepositoryContentType;
  handleRepositoryPick: (repository: RepositoryType) => void;
  handlePress: (input: SingleFileType) => void;
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
}

export const Menu: React.FC<MenuInteface> = ({
  contentPath,
  selectedFile,
  filteredRepositories,
  autoCompleteValue,
  setAutoCompleteValue,
  selectedBranch,
  setSelectedBranch,
  selectedOrganization,
  setSelectedOrganization,
  isOpen,
  loadingFullTree,
  setLoadingFullTree,
  loggedData,
  organizationList,
  selectedRepository,
  selectedRepositoryContent,
  handleRepositoryPick,
  handlePress,
  resetContentPath,
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
}) => {
  const { logOut } = useAuthState();

  const [mode, setMode] = useState<Mode | undefined>();
  const [leaveWithChanges, setLeaveWithChanges] = useState(false);

  return (
    <div
      className={`${
        isOpen ? 'w-[20vw]' : 'invisible w-0'
      } relative transition-all duration-500 ease-in-out select-none h-screen bg-mdtxBlack border-r-[2px] border-r-solid border-r-mdtxOrange0 flex flex-col items-center`}
    >
      <div
        className={`${
          isOpen
            ? 'translate-x-[0%] duration-[900ms]'
            : 'translate-x-[-25vw] duration-[300ms]'
        } w-full h-full transition-transform ease-in-out relative`}
      >
        {leaveWithChanges && (
          <LeaveConfirmation
            setLeaveWithChanges={setLeaveWithChanges}
            resetContentPath={resetContentPath}
          />
        )}
        <div className="mt-[1.6rem] mb-[2.4rem] flex w-full justify-center items-center">
          <MDtxLogo />
        </div>
        <div className="w-full flex justify-around relative my-[1.6rem]">
          <Button onClick={() => logOut()} text={'Logout'} color={'orange'} />
        </div>
        <div className="border-t-[1px] py-[1.6rem] border-b-[1px] border-mdtxOrange0">
          <UserInfo loggedData={loggedData} />
        </div>
        <div className="relative w-full border-b-[1px] border-mdtxOrange0 pb-[5.6rem]">
          <MenuModeSection
            sameMarkdown={markdownBase === markdownEdit}
            contentPath={contentPath}
            selectedFile={selectedFile}
            mode={mode}
            setMode={setMode}
            selectedRepository={selectedRepository}
            organizationList={organizationList}
            selectedOrganization={selectedOrganization}
            setSelectedOrganization={setSelectedOrganization}
            selectedBranch={selectedBranch}
            setSelectedBranch={setSelectedBranch}
            autoCompleteValue={autoCompleteValue}
            setAutoCompleteValue={setAutoCompleteValue}
            setLoadingFullTree={setLoadingFullTree}
            resetContentPath={resetContentPath}
            setLeaveWithChanges={setLeaveWithChanges}
          />
        </div>
        <div className="w-full h-full flex">
          {loadingFullTree ? (
            <div className="mt-[4.2rem] flex justify-center w-full">
              <PulseLoader size={'16px'} color="#FF7200" />
            </div>
          ) : (
            <div className="pl-[1.6rem] pt-[1.6rem] overflow-y-scroll max-h-[57.5vh] scrollbar flex flex-col gap-[0.4rem] justify-start w-full">
              {!selectedFile ? (
                <>
                  {selectedRepository ? (
                    <>
                      {selectedRepositoryContent?.object?.entries &&
                      selectedRepositoryContent?.object?.entries.length > 0 ? (
                        selectedRepositoryContent?.object?.entries?.map(
                          (content) => (
                            <div
                              className="w-fit"
                              key={content.name}
                              onClick={() => {
                                handlePress(content);
                              }}
                            >
                              <p className="text-white hover:underline cursor-pointer">
                                {content.name}
                              </p>
                            </div>
                          ),
                        )
                      ) : (
                        <></>
                      )}
                    </>
                  ) : (
                    <>
                      {filteredRepositories?.nodes &&
                      filteredRepositories?.nodes.length > 0 ? (
                        filteredRepositories?.nodes.map((repository) => (
                          <div
                            className="w-fit"
                            key={repository.name}
                            onClick={() => {
                              handleRepositoryPick(repository);
                            }}
                          >
                            <p className="text-white hover:underline cursor-pointer">
                              {repository.name}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div></div>
                      )}
                    </>
                  )}
                </>
              ) : (
                <>
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
                        selectedRepository={selectedRepository}
                      />
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
