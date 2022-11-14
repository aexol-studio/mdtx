import { MDtxLogo } from '@/src/assets';
import { UserType } from '@/src/backend';
import { useAuthState } from '@/src/containers';
import React, { useState } from 'react';
import { ClipLoader } from 'react-spinners';
import { Button, UserInfo } from '../atoms';
import { MenuModeSection, Mode } from '../molecules';

export const Menu: React.FC<{
  autoCompleteValue?: string;
  setAutoCompleteValue: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
  selectedOrganization: string;
  setSelectedOrganization: React.Dispatch<React.SetStateAction<string>>;
  isOpen: boolean;
  loadingMenu: boolean;
  loggedData?: Omit<UserType, 'organizations'>;
  organizationList?: Pick<UserType, 'organizations'>;
}> = ({
  autoCompleteValue,
  setAutoCompleteValue,
  selectedOrganization,
  setSelectedOrganization,
  isOpen,
  loadingMenu,
  loggedData,
  organizationList,
}) => {
  const { logOut } = useAuthState();

  const [mode, setMode] = useState<Mode | undefined>();

  return (
    <div
      className={`${
        isOpen ? 'w-[20vw]' : 'invisible w-0'
      } relative transition-all duration-500 ease-in-out select-none h-screen bg-mdtxBlack border-r-[2px] border-r-solid border-r-mdtxOrange0 flex flex-col items-center`}
    >
      {!loadingMenu ? (
        <div
          className={`${
            isOpen
              ? 'translate-x-[0%] duration-[900ms]'
              : 'translate-x-[-25vw] duration-[300ms]'
          } w-full h-full transition-transform ease-in-out`}
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
              organizationList={organizationList}
              selectedOrganization={selectedOrganization}
              setSelectedOrganization={setSelectedOrganization}
              autoCompleteValue={autoCompleteValue}
              setAutoCompleteValue={setAutoCompleteValue}
            />
          </div>
          <div className="ml-[1.6rem] mt-[1.6rem]">
            <p className="text-mdtxWhite">Ogromna lista</p>
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex justify-center items-center">
          <ClipLoader size={'64px'} color="white" />
        </div>
      )}
    </div>
  );
};
