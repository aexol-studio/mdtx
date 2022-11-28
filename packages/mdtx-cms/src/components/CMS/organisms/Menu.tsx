import { MDtxLogo } from '@/src/assets';
import FilterIcon from '@/src/assets/svgs/FilterIcon';
import { useAuthState } from '@/src/containers';
import { availableBranchType, RepositoryFromSearch } from '@/src/pages/editor';
import { TreeMenu } from '@/src/utils/treeBuilder';
import { useState } from 'react';
import { PulseLoader } from 'react-spinners';
import { UserInfo } from '../atoms';
import {
  MenuSearchSection,
  RepositoriesList,
  RepositoryTree,
  SearchingType,
} from '../molecules';

export interface MenuInteface {
  autoCompleteValue?: string;
  setAutoCompleteValue: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
  isOpen: boolean;
  loadingFullTree: boolean;
  repositoriesFromSearch?: RepositoryFromSearch[];
  selectedRepository?: RepositoryFromSearch;
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
}

export const Menu: React.FC<MenuInteface> = ({
  autoCompleteValue,
  setAutoCompleteValue,
  selectedRepository,
  isOpen,
  loadingFullTree,
  repositoriesFromSearch,
  repositoryTree,
  handleRepositoryPick,
  includeForks,
  setIncludeForks,
  forksOnRepo,
  searchingMode,
  setSearchingMode,
}) => {
  const { loggedData, logOut } = useAuthState();
  const [searching, setSearching] = useState(true);
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
            : 'translate-x-[-600px] duration-[300ms]'
        } w-full h-full transition-transform ease-in-out relative flex flex-col`}
      >
        <div className="w-full p-8 flex items-center justify-between">
          <MDtxLogo small />
          <UserInfo logOut={logOut} loggedData={loggedData} />
        </div>
        <div className="mt-[3.2rem] relative w-full">
          <div
            onClick={() => {
              setSearching((prev) => !prev);
            }}
            className={`${
              !searching ? 'border-mdtxWhite' : 'border-mdtxOrange0'
            } cursor-pointer flex justify-center items-center rounded-t-[0.4rem] w-[2.8rem] h-[2.8rem] bg-mdtxBlack border-l-[2px] border-t-[2px] border-r-[2px] absolute bottom-[-4.8rem] right-[0.8rem]`}
          >
            <div className="min-w-[1.6rem] min-h-[1.6rem">
              <FilterIcon active={!searching} />
            </div>
          </div>
          <MenuSearchSection
            searching={searching}
            searchingMode={searchingMode}
            setSearchingMode={setSearchingMode}
            includeForks={includeForks}
            setIncludeForks={setIncludeForks}
            autoCompleteValue={autoCompleteValue}
            setAutoCompleteValue={setAutoCompleteValue}
          />
        </div>
        <div className="mt-[4.8rem] pb-[1.6rem] border-t-[1px] border-mdtxOrange0 w-full flex-1 overflow-y-scroll overflow-x-hidden scrollbar">
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
                forksOnRepo={forksOnRepo}
                selectedRepository={selectedRepository}
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
