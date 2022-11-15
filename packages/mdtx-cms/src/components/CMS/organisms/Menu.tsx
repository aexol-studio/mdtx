import { MDtxLogo } from '@/src/assets';
import {
  RepositoriesType,
  RepositoryContentType,
  RepositoryType,
  SingleFileType,
  UserType,
} from '@/src/backend';
import { useAuthState } from '@/src/containers';
import React, { useState } from 'react';
import { PulseLoader } from 'react-spinners';
import { Button, UserInfo } from '../atoms';
import { MenuModeSection, MenuModeSectionInterface, Mode } from '../molecules';

export interface MenuInteface
  extends Omit<MenuModeSectionInterface, 'setMode'> {
  filteredRepositories?: RepositoriesType;

  isOpen: boolean;
  loadingFullTree: boolean;
  loggedData?: Omit<UserType, 'organizations'>;
  selectedRepositoryContent?: RepositoryContentType;
  handleRepositoryPick: (repository: RepositoryType) => void;
  handlePress: (input: SingleFileType) => void;
}

export const Menu: React.FC<MenuInteface> = ({
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
}) => {
  const { logOut } = useAuthState();

  const [mode, setMode] = useState<Mode | undefined>();

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
        <div className="mt-[1.6rem] mb-[2.4rem] flex w-full justify-center items-center">
          <MDtxLogo />
        </div>
        <div className="w-full flex justify-around relative my-[1.6rem]">
          <Button onClick={() => logOut()} text={'Logout'} color={'orange'} />
          <Button
            href={process.env.NEXT_PUBLIC_INSTALLATION_LINK}
            type="link"
            text={'Install more'}
            color={'white'}
          />
        </div>
        <div className="border-t-[1px] py-[1.6rem] border-b-[1px] border-mdtxOrange0">
          <UserInfo loggedData={loggedData} />
        </div>
        <div className="relative w-full border-b-[1px] border-mdtxOrange0 pb-[5.6rem]">
          <MenuModeSection
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
          />
        </div>
        <div className="w-full h-full flex">
          {loadingFullTree ? (
            <div className="mt-[4.2rem] flex justify-center w-full">
              <PulseLoader size={'16px'} color="#FF7200" />
            </div>
          ) : (
            <div className="pl-[1.6rem] pt-[1.6rem] overflow-y-scroll max-h-[57.5vh] scrollbar flex flex-col gap-[0.4rem] justify-start w-full">
              {selectedRepository ? (
                <>
                  {selectedRepositoryContent?.object?.entries?.map(
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
                  )}
                </>
              ) : (
                <>
                  {filteredRepositories?.nodes?.map((repository) => (
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
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
