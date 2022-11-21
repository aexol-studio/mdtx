import { MDtxLogo } from '@/src/assets';
import { useFileState, useAuthState } from '@/src/containers';
import { RepositoryFromSearch } from '@/src/pages/editor';
import { useGithubCalls } from '@/src/utils';
import { treeBuilder, TreeMenu } from '@/src/utils/treeBuilder';
import React, { useState } from 'react';
import { PulseLoader } from 'react-spinners';
import { Button, UserInfo } from '../atoms';
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
  selectedRepository?: RepositoryFromSearch;
  repositoriesFromSearch?: RepositoryFromSearch[];
  setSelectedRepository: React.Dispatch<
    React.SetStateAction<RepositoryFromSearch | undefined>
  >;
  setRepositoriesFromSearch: React.Dispatch<
    React.SetStateAction<RepositoryFromSearch[] | undefined>
  >;
}

export const Menu: React.FC<MenuInteface> = ({
  autoCompleteValue,
  setAutoCompleteValue,
  isOpen,
  loadingFullTree,
  selectedRepository,
  setSelectedRepository,
  repositoriesFromSearch,
  setRepositoriesFromSearch,
}) => {
  const { token, loggedData, logOut } = useAuthState();
  const { setFiles, setOrginalFiles } = useFileState();
  const { getRepository, getRepositoryAsZIP } = useGithubCalls();
  const [repositoryTree, setRepositoryTree] = useState<TreeMenu>();
  const [mode, setMode] = useState<Mode | undefined>(Mode.SEARCHING);
  const [availableBranches, setAvailableBranches] =
    useState<availableBranchType[]>();
  const [selectedBranch, setSelectedBranch] = useState<availableBranchType>();

  const handleRepositoryPick = async (item: RepositoryFromSearch) => {
    setSelectedRepository(item);
    if (token) {
      const response = await getRepository(token, item.full_name);
      if (response) {
        setAvailableBranches(response);
        setSelectedBranch(response[0]);
      }
    }
  };

  const confirmBranchClick = async () => {
    if (token && selectedRepository && selectedBranch) {
      const JSONResponse = await getRepositoryAsZIP(
        token,
        selectedRepository?.full_name,
        selectedBranch?.name,
      );
      if (JSONResponse) {
        const paths = JSONResponse.fileArray.filter((z) =>
          z.name.includes('.md'),
        );
        const tree = treeBuilder(paths);
        setFiles(paths);
        setOrginalFiles(paths);
        setRepositoryTree(tree);
        setAutoCompleteValue('');
        setAvailableBranches(undefined);
        setRepositoriesFromSearch(undefined);
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
        {availableBranches && (
          <div className="w-full h-full fixed z-[2] bg-[#ffffff90]">
            <select
              defaultValue={availableBranches[0].name}
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
                onClick={confirmBranchClick}
              />
            </div>
          </div>
        )}
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
        <div className="w-full flex-1 overflow-y-auto">
          {loadingFullTree ? (
            <div className="mt-[4.2rem] flex justify-center w-full">
              <PulseLoader size={'16px'} color="#FF7200" />
            </div>
          ) : (
            <div className="pl-[1.6rem] pt-[1.6rem] overflow-y-scroll scrollbar flex flex-col gap-[0.4rem] justify-start w-full">
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
