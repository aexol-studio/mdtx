import { Loupe } from '@/src/assets';
import { UserType } from '@/src/backend';
import React from 'react';
export enum Mode {
  ORGANIZATIONS = 'ORGANIZATIONS',
  SEARCHING = 'SEARCHING',
}
interface MenuModeSectionInterface {
  autoCompleteValue?: string;
  setAutoCompleteValue: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
  selectedOrganization: string;
  setSelectedOrganization: React.Dispatch<React.SetStateAction<string>>;
  mode?: Mode;
  setMode: React.Dispatch<React.SetStateAction<Mode | undefined>>;
  organizationList?: Pick<UserType, 'organizations'>;
}

export const MenuModeSection: React.FC<MenuModeSectionInterface> = ({
  autoCompleteValue,
  setAutoCompleteValue,
  selectedOrganization,
  setSelectedOrganization,
  mode,
  setMode,
  organizationList,
}) => {
  return (
    <>
      <div
        className={`${
          mode === undefined ? '' : 'translate-x-[-200%]'
        } transition-all duration-500 ease-in-out left-[1.6rem] top-[1.6rem] absolute`}
      >
        <p className="text-white">
          {selectedOrganization === '---'
            ? 'Your repositories'
            : `${selectedOrganization}`}
        </p>
      </div>
      <div
        className={`${
          mode === Mode.ORGANIZATIONS ? '' : 'translate-x-[-200%]'
        } transition-all duration-500 ease-in-out left-[1.6rem] top-[1.6rem] absolute`}
      >
        <select
          className="outline-none border-none"
          defaultValue={selectedOrganization}
          onChange={(e) => {
            setSelectedOrganization(e.target.value);
          }}
        >
          <option>---</option>
          {organizationList?.organizations.nodes?.map((x) => {
            return (
              <option key={x.login} value={x.login}>
                {x.login}
              </option>
            );
          })}
        </select>
      </div>

      <div
        className={`${
          mode === Mode.SEARCHING ? '' : 'translate-x-[-200%]'
        } transition-all duration-500 ease-in-out left-[1.6rem] top-[0.4rem] absolute`}
      >
        <p className="text-white text-[1.2rem]">
          Searching in:{' '}
          <span className="font-[700]">
            {selectedOrganization === '---'
              ? 'your repositories'
              : `${selectedOrganization}`}
          </span>
        </p>
        <input
          className="outline-none border-none mt-[0.2rem]"
          placeholder={`Type to search`}
          value={autoCompleteValue}
          onChange={(e) => {
            setAutoCompleteValue(e.target.value);
          }}
        />
      </div>

      <div className="absolute right-[1.6rem] flex gap-[0.8rem]">
        {organizationList?.organizations.nodes &&
          organizationList.organizations.nodes.length > 0 && (
            <div
              onClick={() => {
                setAutoCompleteValue('');
                if (mode === Mode.ORGANIZATIONS) {
                  setMode(undefined);
                } else {
                  setMode(Mode.ORGANIZATIONS);
                }
              }}
              className={`${
                mode === Mode.ORGANIZATIONS ? 'bg-mdtxOrange0' : 'bg-mdtxWhite'
              } cursor-pointer flex justify-center items-center h-[4.2rem] w-[3.2rem] border-t-[1px] border-mdtxOrange0 rounded-b-[1.2rem]`}
            >
              <p className="mb-[0.2rem] rotate-[-90deg] text-[1rem] font-[700]">
                ORGS
              </p>
            </div>
          )}

        <div
          onClick={() => {
            setAutoCompleteValue('');
            if (mode === Mode.SEARCHING) {
              setMode(undefined);
            } else {
              setMode(Mode.SEARCHING);
            }
          }}
          className={`${
            mode === Mode.SEARCHING ? 'bg-mdtxOrange0' : 'bg-mdtxWhite'
          } cursor-pointer flex justify-center items-center h-[4.2rem] w-[3.2rem]  border-t-[1px] border-mdtxOrange0 rounded-b-[1.2rem]`}
        >
          <div className="mb-[0.4rem]">
            <Loupe />
          </div>
        </div>
      </div>
    </>
  );
};
