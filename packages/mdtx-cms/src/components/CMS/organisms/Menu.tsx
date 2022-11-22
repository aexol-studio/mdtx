import { MDtxLogo } from '@/src/assets';
import { useAuthState } from '@/src/containers';
import { availableBranchType, RepositoryFromSearch } from '@/src/pages/editor';
import { useGithubCalls } from '@/src/utils';
import { TreeMenu } from '@/src/utils/treeBuilder';
import React, { useState } from 'react';
import { PulseLoader } from 'react-spinners';
import { UserInfo } from '../atoms';
import {
  MenuModeSection,
  MenuModeSectionInterface,
  Mode,
  RepositoriesList,
  RepositoryTree,
} from '../molecules';

type Omitted = Omit<
  Omit<Omit<MenuModeSectionInterface, 'setMode'>, 'setLeaveWithChanges'>,
  'sameMarkdown'
>;

export interface MenuInteface extends Omitted {
  isOpen: boolean;
  loadingFullTree: boolean;
  repositoriesFromSearch?: RepositoryFromSearch[];
  setAvailableBranches: React.Dispatch<
    React.SetStateAction<availableBranchType[] | undefined>
  >;
  selectedBranch?: availableBranchType;
  setSelectedBranch: React.Dispatch<
    React.SetStateAction<availableBranchType | undefined>
  >;
  repositoryTree?: TreeMenu;
  setSelectedRepository: React.Dispatch<
    React.SetStateAction<RepositoryFromSearch | undefined>
  >;
  setDownloadModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Menu: React.FC<MenuInteface> = ({
  autoCompleteValue,
  setAutoCompleteValue,
  isOpen,
  loadingFullTree,
  setSelectedRepository,
  repositoriesFromSearch,
  setAvailableBranches,
  setSelectedBranch,
  repositoryTree,
  setDownloadModal,
}) => {
  const { token, loggedData, logOut } = useAuthState();
  const { getRepositoryBranches } = useGithubCalls();

  const [mode, setMode] = useState<Mode | undefined>(Mode.SEARCHING);

  const handleRepositoryPick = async (item: RepositoryFromSearch) => {
    setSelectedRepository(item);
    if (token) {
      const response = await getRepositoryBranches(token, item.full_name);
      if (response) {
        setDownloadModal(true);
        setAvailableBranches(response);
        setSelectedBranch(response[0]);
      }
    }
  };

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
        <div className="relative w-full border-b-[1px] border-mdtxOrange0 pb-[5.6rem]">
          <MenuModeSection
            mode={mode}
            setMode={setMode}
            autoCompleteValue={autoCompleteValue}
            setAutoCompleteValue={setAutoCompleteValue}
          />
        </div>
        <div className="w-full flex-1 overflow-y-scroll overflow-x-hidden scrollbar">
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
              <RepositoryTree key={x.name} root tree={x} />
            ))}
        </div>
      </div>
    </div>
  );
};
