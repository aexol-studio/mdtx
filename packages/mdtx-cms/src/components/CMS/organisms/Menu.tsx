import { ArrowLeft, MDtxLogo } from '@/src/assets';
import FilterIcon from '@/src/assets/svgs/FilterIcon';
import {
  availableBranchType,
  RepositoryFromSearch,
  useAuthState,
  useFileState,
  useRepositoryState,
} from '@/src/containers';
import { TreeMenu } from '@/src/utils/treeBuilder';
import { useState } from 'react';
import { PulseLoader } from 'react-spinners';
import { LogoInEditor, UserInfo } from '../atoms';
import {
  MenuSearchSection,
  RepositoriesList,
  RepositoryTree,
  SearchingType,
} from '../molecules';
import Image from 'next/image';

export interface MenuInteface {
  autoCompleteValue?: string;
  setAutoCompleteValue: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
  openMenu: boolean;
  setOpenMenu: () => void;
  loadingFullTree: boolean;
  repositoriesFromSearch?: RepositoryFromSearch[];
  backToSearch: () => void;
  repositoryTree?: TreeMenu;
  handleRepositoryPick: (item: RepositoryFromSearch) => Promise<void>;
  includeForks: boolean;
  setIncludeForks: React.Dispatch<React.SetStateAction<boolean>>;
  forksOnRepo?: {
    full_name: string;
  }[];
  searchingMode: SearchingType;
  setSearchingMode: React.Dispatch<React.SetStateAction<SearchingType>>;
  setRepositoryTree: React.Dispatch<React.SetStateAction<TreeMenu | undefined>>;
  handleUploadModal: (p: boolean) => void;
}

export const Menu: React.FC<MenuInteface> = ({
  autoCompleteValue,
  setAutoCompleteValue,
  openMenu,
  setOpenMenu,
  loadingFullTree,
  repositoriesFromSearch,
  repositoryTree,
  backToSearch,
  handleRepositoryPick,
  includeForks,
  setIncludeForks,
  forksOnRepo,
  searchingMode,
  setSearchingMode,
  setRepositoryTree,
  handleUploadModal,
}) => {
  const { selectedRepository, selectedBranch } = useRepositoryState();
  const { loggedData, logOut } = useAuthState();
  return (
    <div className="flex">
      <div
        className={`${
          openMenu ? 'w-[41rem]' : 'w-[5.2rem]'
        } overflow-hidden relative transition-all duration-500 ease-in-out select-none h-screen bg-editor-black1 flex flex-col border-r-[2px] border-editor-black3`}
      >
        <div
          className={`mt-[1rem] flex w-full pl-[0.8rem] pb-[1rem] border-b-[2px] border-editor-black3`}
        >
          <LogoInEditor state={openMenu} onClick={setOpenMenu} />
        </div>
        <div className="flex w-full h-full">
          <div
            className={`min-w-[5.2rem] max-w-[5.2rem] h-full w-full flex flex-col items-center border-r-[2px] border-editor-black3 pt-[1.6rem] z-[10] bg-editor-black1`}
          >
            <div
              onClick={setOpenMenu}
              className="cursor-pointer min-w-[2rem] min-h-[2rem]"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.0023 8.8V5.84C15.0023 4.49587 15.0023 3.82381 14.7479 3.31042C14.5242 2.85883 14.1673 2.49168 13.7282 2.26158C13.2291 2 12.5757 2 11.2689 2H6.73333C5.42654 2 4.77315 2 4.27402 2.26158C3.83498 2.49168 3.47802 2.85883 3.25432 3.31042C3 3.82381 3 4.49587 3 5.84V14.16C3 15.5041 3 16.1762 3.25432 16.6896C3.47802 17.1412 3.83498 17.5083 4.27402 17.7384C4.77315 18 5.42654 18 6.73333 18H8.83333M17 18L15.8333 16.8M16.6111 14.8C16.6111 16.3464 15.3923 17.6 13.8889 17.6C12.3854 17.6 11.1667 16.3464 11.1667 14.8C11.1667 13.2536 12.3854 12 13.8889 12C15.3923 12 16.6111 13.2536 16.6111 14.8Z"
                  stroke="#E1E5EE"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <div
            className={`${
              openMenu
                ? 'translate-x-[0%] duration-[900ms]'
                : 'translate-x-[-600px] duration-[300ms]'
            } w-full h-full transition-transform ease-in-out relative flex flex-col z-[1]`}
          >
            <div
              className={`${
                !(selectedRepository && repositoryTree)
                  ? 'translate-x-[200%] invisible'
                  : 'left-[50%] translate-x-[-50%]'
              } mt-[0.8rem] w-[90%] transition-all duration-300 ease-in-out absolute py-[0.2rem] px-[0.8rem]`}
            >
              <div
                className="w-fit group cursor-pointer flex gap-[0.8rem] items-center"
                onClick={backToSearch}
              >
                <div className="min-w-[2rem] min-h-[2rem]">
                  <ArrowLeft small />
                </div>
                <p className="text-white select-none text-[1.2rem] group-hover:underline w-fit">
                  Back to search
                </p>
              </div>
              <div className="mt-[1.6rem] relative w-full flex items-center justify-between">
                <div className="flex justify-center items-center gap-[0.8rem]">
                  {selectedRepository && (
                    <Image
                      loader={({ src }) => src}
                      priority
                      width={24}
                      height={24}
                      className="rounded-full"
                      alt="User Logo"
                      src={selectedRepository?.owner?.avatar_url || ''}
                    />
                  )}
                  <p className="text-white select-none text-center text-[1.2rem]">
                    {selectedRepository?.owner?.login}
                  </p>
                </div>
              </div>
              <p className="mt-[0.8rem] text-white select-none text-[1.2rem]">
                Repository name: <strong>{selectedRepository?.name}</strong>
              </p>
              <p className="text-white select-none text-[1.2rem]">
                Is orginal respository:{' '}
                <strong>{!selectedRepository?.fork ? 'yes' : 'no'}</strong>
              </p>
              {forksOnRepo?.find((x) =>
                x.full_name.includes(loggedData ? loggedData.login : ''),
              ) && (
                <p className="text-white select-none text-[1.2rem]">
                  Already forked by logged user: <strong>yes</strong>
                </p>
              )}

              <p className="text-white select-none text-[1.2rem]">
                Is your repository:{' '}
                <strong>
                  {selectedRepository?.full_name.includes(
                    loggedData ? loggedData.login : '',
                  )
                    ? 'yes'
                    : 'no'}
                </strong>
              </p>
              <p className="text-white select-none text-[1.2rem]">
                Current branch: <strong>{selectedBranch?.name}</strong>
              </p>
            </div>
            <div
              className={`${
                selectedRepository && repositoryTree
                  ? 'translate-x-[-200%]'
                  : ''
              } mt-[2.4rem] max-w-[26.6rem] pl-[1.6rem] transition-all duration-300 ease-in-out relative w-full`}
            >
              <MenuSearchSection
                searchingMode={searchingMode}
                setSearchingMode={setSearchingMode}
                includeForks={includeForks}
                setIncludeForks={setIncludeForks}
                autoCompleteValue={autoCompleteValue}
                setAutoCompleteValue={setAutoCompleteValue}
              />
            </div>
            <div
              onContextMenu={(e) => {
                e.preventDefault();
              }}
              className="mt-[1.6rem] pb-[1.6rem] border-t-[1px] border-editor-black3 w-full flex-1 overflow-y-scroll overflow-x-hidden scrollbar"
            >
              {loadingFullTree ? (
                <div className="mt-[4.2rem] flex justify-center w-full">
                  <PulseLoader size={'16px'} color="#9A99AD" />
                </div>
              ) : (
                <div className="pl-[1.6rem] pt-[1.6rem] flex flex-col gap-[0.4rem] justify-start w-full">
                  {repositoriesFromSearch &&
                    repositoriesFromSearch.length > 0 && (
                      <RepositoriesList
                        repositories={repositoriesFromSearch}
                        handleRepositoryPick={handleRepositoryPick}
                      />
                    )}
                </div>
              )}
              {repositoryTree &&
                repositoryTree.length > 0 &&
                repositoryTree.map((x) => (
                  <RepositoryTree
                    handleUploadModal={handleUploadModal}
                    setRepositoryTree={setRepositoryTree}
                    key={x.name}
                    root
                    tree={x}
                  />
                ))}
              {!loadingFullTree && !repositoryTree && !repositoriesFromSearch && (
                <div className="px-[1.6rem] mt-[2.4rem]">
                  <p className="text-mdtxWhite text-[1.4rem]">
                    Type something to start explore GitHub repositories
                  </p>
                </div>
              )}
              {!loadingFullTree &&
                repositoryTree?.length === 0 &&
                !repositoriesFromSearch && (
                  <div className="px-[1.6rem] mt-[2.4rem]">
                    <p className="text-mdtxWhite text-[1.4rem]">
                      {`No markdown files in ${selectedRepository?.name}`}
                    </p>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
{
  /* <div
className={`${
  openMenu ? 'w-[32rem]' : 'w-[0rem]'
} overflow-hidden relative transition-all duration-500 ease-in-out select-none h-screen bg-editor-black1 border-r-[2px] border-r-solid border-r-mdtxBlack flex flex-col`}
>
<div
  className={`${
    openMenu
      ? 'translate-x-[0%] duration-[900ms]'
      : 'translate-x-[-600px] duration-[300ms]'
  } border-t-[2px] border-t-solid border-t-mdtxBlack mt-[5.4rem] w-full h-full transition-transform ease-in-out relative flex flex-col`}
>
  <div className="w-full p-8 flex items-center justify-between">
    <UserInfo logOut={logOut} loggedData={loggedData} />
  </div>
  <div
    className={`${
      !(selectedRepository && repositoryTree)
        ? 'translate-x-[200%] invisible'
        : 'left-[50%] translate-x-[-50%]'
    } top-[5.4rem] w-[90%] transition-all duration-300 ease-in-out absolute py-[0.2rem] px-[0.8rem]`}
  >
    <div
      className="w-fit group cursor-pointer flex gap-[0.8rem] items-center"
      onClick={backToSearch}
    >
      <div className="min-w-[2rem] min-h-[2rem]">
        <ArrowLeft small />
      </div>
      <p className="text-white select-none text-[1.2rem] group-hover:underline w-fit">
        Back to search
      </p>
    </div>
    <div className="mt-[1.6rem] relative w-full flex items-center justify-between">
      <div className="flex justify-center items-center gap-[0.8rem]">
        {selectedRepository && (
          <Image
            loader={({ src }) => src}
            priority
            width={24}
            height={24}
            className="rounded-full"
            alt="User Logo"
            src={selectedRepository?.owner?.avatar_url || ''}
          />
        )}
        <p className="text-white select-none text-center text-[1.2rem]">
          {selectedRepository?.owner?.login}
        </p>
      </div>
    </div>
    <p className="mt-[0.8rem] text-white select-none text-[1.2rem]">
      Repository name: <strong>{selectedRepository?.name}</strong>
    </p>
    <p className="text-white select-none text-[1.2rem]">
      Is orginal respository:{' '}
      <strong>{!selectedRepository?.fork ? 'yes' : 'no'}</strong>
    </p>
    {forksOnRepo?.find((x) =>
      x.full_name.includes(loggedData ? loggedData.login : ''),
    ) && (
      <p className="text-white select-none text-[1.2rem]">
        Already forked by logged user: <strong>yes</strong>
      </p>
    )}

    <p className="text-white select-none text-[1.2rem]">
      Is your repository:{' '}
      <strong>
        {selectedRepository?.full_name.includes(
          loggedData ? loggedData.login : '',
        )
          ? 'yes'
          : 'no'}
      </strong>
    </p>
    <p className="text-white select-none text-[1.2rem]">
      Current branch: <strong>{selectedBranch?.name}</strong>
    </p>
  </div>
  <div
    className={`${
      selectedRepository && repositoryTree ? 'translate-x-[-200%]' : ''
    } transition-all duration-300 ease-in-out relative w-full`}
  >
    <MenuSearchSection
      searchingMode={searchingMode}
      setSearchingMode={setSearchingMode}
      includeForks={includeForks}
      setIncludeForks={setIncludeForks}
      autoCompleteValue={autoCompleteValue}
      setAutoCompleteValue={setAutoCompleteValue}
    />
  </div>
  <div
    onContextMenu={(e) => {
      e.preventDefault();
    }}
    className="mt-[1.6rem] pb-[1.6rem] border-t-[1px] border-mdtxOrange0 w-full flex-1 overflow-y-scroll overflow-x-hidden scrollbar"
  >
    {loadingFullTree ? (
      <div className="mt-[4.2rem] flex justify-center w-full">
        <PulseLoader size={'16px'} color="#FF7200" />
      </div>
    ) : (
      <div className="pl-[1.6rem] pt-[1.6rem] flex flex-col gap-[0.4rem] justify-start w-full">
        {repositoriesFromSearch &&
          repositoriesFromSearch.length > 0 && (
            <RepositoriesList
              repositories={repositoriesFromSearch}
              handleRepositoryPick={handleRepositoryPick}
            />
          )}
      </div>
    )}
    {repositoryTree &&
      repositoryTree.length > 0 &&
      repositoryTree.map((x) => (
        <RepositoryTree
          handleUploadModal={handleUploadModal}
          setRepositoryTree={setRepositoryTree}
          key={x.name}
          root
          tree={x}
        />
      ))}
    {!loadingFullTree && !repositoryTree && !repositoriesFromSearch && (
      <div className="px-[1.6rem] mt-[2.4rem]">
        <p className="text-mdtxWhite text-[1.4rem]">
          Type something to start explore GitHub repositories
        </p>
      </div>
    )}
    {!loadingFullTree &&
      repositoryTree?.length === 0 &&
      !repositoriesFromSearch && (
        <div className="px-[1.6rem] mt-[2.4rem]">
          <p className="text-mdtxWhite text-[1.4rem]">
            {`No markdown files in ${selectedRepository?.name}`}
          </p>
        </div>
      )}
  </div>
</div>
</div> */
}
