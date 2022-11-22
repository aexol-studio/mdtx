import { Loupe } from '@/src/assets';
import React, { useEffect } from 'react';
export enum Mode {
  ORGANIZATIONS = 'ORGANIZATIONS',
  SEARCHING = 'SEARCHING',
}

export interface MenuModeSectionInterface {
  autoCompleteValue?: string;
  setAutoCompleteValue: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
  mode?: Mode;
  setMode: React.Dispatch<React.SetStateAction<Mode | undefined>>;
}

export const MenuModeSection: React.FC<MenuModeSectionInterface> = ({
  autoCompleteValue,
  setAutoCompleteValue,
  mode,
  setMode,
}) => {
  useEffect(() => {
    setAutoCompleteValue('');
  }, [mode]);
  return (
    <>
      <div
        className={`${'translate-x-0'} transition-all duration-500 ease-in-out`}
      >
        <div
          className={`${
            mode === undefined ? '' : 'translate-x-[-200%]'
          } transition-all duration-500 ease-in-out left-[1.6rem] top-[1.6rem] absolute`}
        >
          <p className="text-white"></p>
        </div>
        <div
          className={`${
            mode === Mode.SEARCHING ? '' : 'translate-x-[-200%]'
          } transition-all duration-500 ease-in-out left-[1.6rem] top-[0.4rem] absolute`}
        >
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
          <div
            onClick={() => {
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
      </div>
    </>
  );
};
