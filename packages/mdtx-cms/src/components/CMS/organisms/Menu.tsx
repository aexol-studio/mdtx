import { ArrowLeft, MDtxLogo } from '@/src/assets';
import FilterIcon from '@/src/assets/svgs/FilterIcon';
import { useAuthState, useFileState } from '@/src/containers';
import { availableBranchType, RepositoryFromSearch } from '@/src/pages/editor';
import { TreeMenu } from '@/src/utils/treeBuilder';
import { useState } from 'react';
import { PulseLoader } from 'react-spinners';
import { BackButton, UserInfo } from '../atoms';
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
  selectedRepository?: RepositoryFromSearch;
  backToSearch: () => void;
  selectedBranch?: availableBranchType;
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
}

export const Menu: React.FC<MenuInteface> = ({
  autoCompleteValue,
  setAutoCompleteValue,
  selectedRepository,
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
}) => {
  const { loggedData, logOut } = useAuthState();
  return (
    <div
      className={`${
        openMenu ? 'w-[32rem]' : 'w-[4.2rem]'
      } overflow-hidden relative transition-all duration-500 ease-in-out select-none h-screen bg-mdtxBlack border-r-[2px] border-r-solid border-r-mdtxBlack flex flex-col items-center`}
    >
      <BackButton state={openMenu} onClick={setOpenMenu} />
      <div
        className={`${
          openMenu
            ? 'translate-x-[0%] duration-[900ms]'
            : 'translate-x-[-600px] duration-[300ms]'
        } w-full h-full transition-transform ease-in-out relative flex flex-col`}
      >
        <div className="w-full p-8 flex items-center justify-between">
          <MDtxLogo small />
          <UserInfo logOut={logOut} loggedData={loggedData} />
        </div>
        <div
          className={`${
            !(selectedRepository && repositoryTree)
              ? 'translate-x-[200%] invisible'
              : 'left-[50%] translate-x-[-50%]'
          } top-[5.4rem] w-[90%] transition-all duration-300 ease-in-out absolute py-[1.6rem] px-[0.8rem]`}
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
              {repositoriesFromSearch && repositoriesFromSearch.length > 0 && (
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
  );
};
