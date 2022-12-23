import { Chevron, ImageIcon, SettingsIcon } from '@/src/assets';
import {
  RepositoryFromSearch,
  useAuthState,
  useFileState,
  useRepositoryState,
} from '@/src/containers';
import { TreeMenu } from '@/src/utils/treeBuilder';
import { PulseLoader } from 'react-spinners';
import { LogoInEditor } from '../atoms';
import {
  MenuSearchSection,
  RepositoriesList,
  RepositoryTree,
  SearchingType,
  SettingsSection,
} from '../molecules';
import Image from 'next/image';
import { CommitableIcon, SearchMenuIcon } from '@/src/assets/menu-icons';
import { useEffect, useState } from 'react';
import { MenuModalType, MenuType } from '@/src/pages/editor';
type ConnectionType = {
  url?: string;
  applicationId?: string;
  id: string;
  name: string;
  token: string;
  service: string;
};
export interface MenuInteface {
  commitableMenu: boolean;
  autoCompleteValue?: string;
  setAutoCompleteValue: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
  openMenu: boolean;
  setOpenMenu: (p: boolean) => void;
  loadingFullTree: boolean;
  repositoriesFromSearch?: RepositoryFromSearch[];
  backToSearch: () => void;
  repositoryTree?: TreeMenu;
  setRepositoryTree: React.Dispatch<React.SetStateAction<TreeMenu | undefined>>;
  handleRepositoryPick: (item: RepositoryFromSearch) => Promise<void>;
  includeForks: boolean;
  setIncludeForks: React.Dispatch<React.SetStateAction<boolean>>;
  forksOnRepo?: {
    full_name: string;
  }[];
  searchingMode: SearchingType;
  setSearchingMode: React.Dispatch<React.SetStateAction<SearchingType>>;
  handleUploadModal: (p: boolean) => void;
  handleMenuModal: (p?: MenuModalType) => void;
  searchInService?: ConnectionType;
  handleSearchInService: (p?: ConnectionType) => void;
  menuType: MenuType | undefined;
  handleMenuType: (p?: MenuType) => void;
}

export const Menu: React.FC<MenuInteface> = ({
  commitableMenu,
  autoCompleteValue,
  setAutoCompleteValue,
  openMenu,
  setOpenMenu,
  loadingFullTree,
  repositoriesFromSearch,
  backToSearch,
  repositoryTree,
  setRepositoryTree,
  handleRepositoryPick,
  includeForks,
  setIncludeForks,
  forksOnRepo,
  searchingMode,
  setSearchingMode,
  handleUploadModal,
  handleMenuModal,
  searchInService,
  handleSearchInService,
  menuType,
  handleMenuType,
}) => {
  const { selectedRepository, selectedBranch } = useRepositoryState();
  const { modifiedFiles, files } = useFileState();
  const { loggedData } = useAuthState();

  useEffect(() => {
    if (!commitableMenu && modifiedFiles.length === 0) {
      handleMenuType(MenuType.SEARCH);
    }
  }, [commitableMenu, modifiedFiles]);
  const onlyIMGRef = /(.*)\.(png|jpg|jpeg|gif|webp)$/;
  const onlyIMG = (p: string) => !!p.match(onlyIMGRef);
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
          <LogoInEditor
            state={openMenu}
            onClick={() => {
              if (!openMenu) {
                setOpenMenu(true);
                handleMenuType(MenuType.SEARCH);
              }
              if (openMenu) {
                setOpenMenu(false);
                handleMenuType(undefined);
              }
            }}
          />
        </div>
        <div className="flex w-full h-full">
          <div
            className={`relative min-w-[5.2rem] max-w-[5.2rem] h-full w-full flex flex-col items-center border-r-[2px] border-editor-black3 pt-[1.6rem] z-[10] bg-editor-black1`}
          >
            <div
              onClick={() => {
                if (!openMenu) {
                  setOpenMenu(true);
                  handleMenuType(MenuType.SEARCH);
                }
                if (openMenu && menuType === MenuType.SEARCH) {
                  setOpenMenu(false);
                  handleMenuType(undefined);
                }
                handleMenuType(MenuType.SEARCH);
              }}
              className="cursor-pointer min-w-[2rem] min-h-[2rem] relative"
            >
              <div
                className={`${
                  menuType === MenuType.SEARCH ? 'h-full' : 'h-0'
                } transition-all duration-500 ease-in-out left-[-0.8rem] absolute h-full rounded-[0.8rem] w-[0.4rem] bg-landing-blue`}
              />
              <SearchMenuIcon />
            </div>

            <div
              onClick={() => {
                if (commitableMenu) {
                  if (!openMenu) {
                    setOpenMenu(true);
                    handleMenuType(MenuType.COMMITABLE);
                  }
                  if (openMenu && menuType === MenuType.COMMITABLE) {
                    setOpenMenu(false);
                    handleMenuType(undefined);
                  }
                  handleMenuType(MenuType.COMMITABLE);
                }
              }}
              className={`${
                commitableMenu
                  ? 'cursor-pointer'
                  : 'cursor-not-allowed opacity-[0.4]'
              } relative mt-[2.4rem] min-w-[2rem] min-h-[2rem] transition-all duration-200 ease-in-out`}
            >
              <div
                className={`${
                  menuType === MenuType.COMMITABLE ? 'h-full' : 'h-0'
                } transition-all duration-500 ease-in-out left-[-0.8rem] absolute h-full rounded-[0.8rem] w-[0.4rem] bg-landing-blue`}
              />
              <CommitableIcon />
              <div className="absolute bottom-[-0.8rem] left-[1.2rem] bg-editor-blue1 w-[1.6rem] h-[1.6rem] rounded-full flex justify-center items-center">
                <p className="text-editor-light1 text-[0.9rem]">
                  {modifiedFiles.length}
                </p>
              </div>
            </div>
            <div
              onClick={() => {
                if (!openMenu) {
                  setOpenMenu(true);
                }
                if (openMenu && menuType === MenuType.SETTINGS) {
                  setOpenMenu(false);
                  handleMenuType(undefined);
                }
                handleMenuType(MenuType.SETTINGS);
              }}
              className={`mt-[2.4rem] cursor-pointer min-w-[2rem] min-h-[2rem] relative`}
            >
              <div
                className={`${
                  menuType === MenuType.SETTINGS ? 'h-full' : 'h-0'
                } transition-all duration-500 ease-in-out left-[-0.8rem] absolute h-full rounded-[0.8rem] w-[0.4rem] bg-landing-blue`}
              />
              <SettingsIcon />
            </div>
          </div>

          <SettingsSection
            active={openMenu && menuType === MenuType.SETTINGS}
          />

          <div
            className={`${
              openMenu && menuType === MenuType.COMMITABLE
                ? 'translate-x-[0%] duration-[900ms]'
                : 'translate-x-[-600px] duration-[300ms]'
            } w-full h-full transition-transform ease-in-out left-[5.2rem] absolute flex flex-col z-[1]`}
          >
            <div className="relative mt-[0.8rem] mx-[0.8rem]">
              <p className="select-none text-[1.6rem] leading-[2.4rem] font-[500] text-editor-light2">
                What you want to do ?
              </p>
              <div className="ml-[0.4rem] mt-[1.6rem] flex flex-col gap-[0.2rem]">
                <div
                  onClick={() => {
                    handleMenuModal(MenuModalType.CHANGES);
                  }}
                  className="cursor-pointer group flex gap-[0.8rem] items-center"
                >
                  <span className="group-hover:bg-editor-blue1 w-[0.4rem] h-[0.4rem] bg-editor-purple2 rounded-full" />
                  <p className="group-hover:underline select-none text-[1.4rem] leading-[2.4rem] font-[500] text-editor-light2">
                    See changes
                  </p>
                </div>
                <div
                  onClick={() => {
                    handleMenuModal(MenuModalType.COMMIT);
                  }}
                  className="cursor-pointer group flex gap-[0.8rem] items-center"
                >
                  <span className="group-hover:bg-editor-blue1 w-[0.4rem] h-[0.4rem] bg-editor-purple2 rounded-full" />
                  <p className="group-hover:underline select-none text-[1.4rem] leading-[2.4rem] font-[500] text-editor-light2">
                    Commit
                  </p>
                </div>
                <div
                  onClick={() => {
                    handleMenuModal(MenuModalType.PULL_REQUEST);
                  }}
                  className="cursor-pointer group flex gap-[0.8rem] items-center"
                >
                  <span className="group-hover:bg-editor-blue1 w-[0.4rem] h-[0.4rem] bg-editor-purple2 rounded-full" />
                  <p className="group-hover:underline select-none text-[1.4rem] leading-[2.4rem] font-[500] text-editor-light2">
                    Pull request
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div
            className={`${
              openMenu && menuType === MenuType.SEARCH
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
                className="text-editor-light2 w-fit group cursor-pointer flex gap-[0.4rem] items-center"
                onClick={backToSearch}
              >
                <div className="rotate-[-180deg] min-w-[2rem] min-h-[2rem]">
                  <Chevron />
                </div>
                <p className="select-none text-[1.4rem] leading-[1.8rem] font-[500] w-fit">
                  New search
                </p>
              </div>
              <div className="mt-[1.6rem] relative w-full flex items-center justify-between">
                <div className="flex justify-center items-start gap-[0.8rem]">
                  {selectedRepository && (
                    <Image
                      loader={({ src }) => src}
                      priority
                      width={20}
                      height={20}
                      className="rounded-full"
                      alt="User Logo"
                      src={selectedRepository?.owner?.avatar_url || ''}
                    />
                  )}
                  <div className="flex flex-col">
                    <p className="select-none text-[1.2rem] leading-[1.8rem] font-[500] text-editor-light2">
                      Selected repository:{' '}
                      <span className="text-editor-light1">
                        {selectedRepository?.name}
                      </span>
                    </p>

                    <div className="mt-[0.4rem]" />
                    {selectedRepository?.full_name.includes(
                      loggedData ? loggedData.login : '',
                    ) ? (
                      <p className="select-none text-[1.2rem] leading-[1.8rem] font-[500] text-editor-light2">
                        Owner: <span className="text-editor-light1">You</span>
                      </p>
                    ) : (
                      <p className="select-none text-[1.2rem] leading-[1.8rem] font-[500] text-editor-light2">
                        Owner:{' '}
                        <span className="text-editor-light1">
                          {selectedRepository?.owner?.login}
                        </span>
                      </p>
                    )}

                    <p className="mt-[0.4rem] select-none text-[1.2rem] leading-[1.8rem] font-[500] text-editor-light2">
                      Orginal respository:{' '}
                      <span className="text-editor-light1">
                        {!selectedRepository?.fork ? 'yes' : 'no'}
                      </span>
                    </p>
                    {forksOnRepo?.find((x) =>
                      x.full_name.includes(loggedData ? loggedData.login : ''),
                    ) && (
                      <p className="mt-[0.4rem] select-none text-[1.2rem] leading-[1.8rem] font-[500] text-editor-light2">
                        Already forked by logged user:{' '}
                        <span className="text-editor-light1">yes</span>
                      </p>
                    )}
                    {!selectedRepository?.full_name.includes(
                      loggedData ? loggedData.login : '',
                    ) && (
                      <p className="mt-[0.4rem] select-none text-[1.2rem] leading-[1.8rem] font-[500] text-editor-light2">
                        Is your repository:{' '}
                        <span className="text-editor-light1">no</span>
                      </p>
                    )}

                    <p className="mt-[0.4rem] select-none text-[1.2rem] leading-[1.8rem] font-[500] text-editor-light2">
                      Current branch:{' '}
                      <span className="text-editor-light1">
                        {selectedBranch?.name}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div
              className={`${
                selectedRepository && repositoryTree
                  ? 'translate-x-[-200%]'
                  : ''
              } mt-[2.8rem] max-w-[26.6rem] pl-[1.6rem] transition-all duration-300 ease-in-out relative w-full`}
            >
              <MenuSearchSection
                searchInService={searchInService}
                handleSearchInService={handleSearchInService}
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
              className="relative mt-[1.6rem] pb-[1.6rem] border-t-[1px] border-editor-black3 w-full flex-1 overflow-y-scroll overflow-x-hidden scrollbar"
            >
              {loadingFullTree ? (
                <div className="mt-[4.2rem] flex justify-center w-full">
                  <PulseLoader size={'16px'} color="#9A99AD" />
                </div>
              ) : (
                <div className="flex flex-col gap-[0.4rem] justify-start w-full">
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
                <div className="mt-[1.6rem] px-[1.6rem]">
                  <p className="text-mdtxWhite text-[1.4rem]">
                    Type something to start explore GitHub repositories
                  </p>
                </div>
              )}
              {!loadingFullTree &&
                repositoryTree?.length === 0 &&
                !repositoriesFromSearch && (
                  <div className="mt-[1.6rem] px-[1.6rem]">
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
