import React, { useRef, useState } from 'react';
import { CloseIconSvg, Hamburger } from '../assets';
import { useOutsideClick } from '../hooks/useOutsideClick';
import { Layout } from '../layouts';

const test = () => {
  const [optionsMenu, setOptionsMenu] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick(ref, () => setOptionsMenu(false));
  return (
    <div className="max-w-screen min-w-screen min-h-screen overflow-hidden max-h-screen relative">
      <div
        ref={ref}
        onClick={() => {
          setOptionsMenu(true);
        }}
        className={`${
          optionsMenu
            ? 'right-0 bottom-0 cursor-default'
            : 'right-[2.4rem] bottom-[2.4rem] cursor-pointer'
        } select-none flex justify-center items-center z-[99] rounded-full absolute `}
      >
        <div
          className={`${
            optionsMenu
              ? 'w-[24rem] h-[24rem] rounded-lt-full rounded-tl-full border-l-[1px] border-t-[1px] border-mdtxBlack'
              : 'w-[4.2rem] h-[4.2rem] rounded-full'
          } transition-all duration-300 ease-in-out relative flex justify-center items-center bg-mdtxOrange0`}
        >
          <Hamburger small navVisible={optionsMenu} />
          {optionsMenu ? (
            <>
              <div
                className="max-w-[2.4rem] max-h-[2.4rem] cursor-pointer absolute top-[2.4rem] right-[2.4rem]"
                onClick={() => {
                  setOptionsMenu(false);
                }}
              >
                <CloseIconSvg navVisible={optionsMenu} />
              </div>
              <div className="absolute bottom-[4.2rem] left-[6.4rem]">
                <div className="ml-[4.8rem] mb-[1.2rem]">
                  <p className="text-center w-fit text-mdtxWhite uppercase text-[1.4rem] font-[700] select-none hover:underline cursor-pointer">
                    Changes
                  </p>
                </div>
                <div className="ml-[3.2rem] mb-[1.2rem]">
                  <p className="text-center w-fit text-mdtxWhite uppercase text-[1.4rem] font-[700] select-none hover:underline cursor-pointer">
                    Commit
                  </p>
                </div>
                <div className="ml-[1.6rem] mb-[1.2rem]">
                  <p className="text-center w-fit text-mdtxWhite uppercase text-[1.4rem] font-[700] select-none hover:underline cursor-pointer">
                    Pull requests
                  </p>
                </div>
                <div>
                  <p className="text-center w-fit text-mdtxWhite uppercase text-[1.4rem] font-[700] select-none hover:underline cursor-pointer">
                    Fork
                  </p>
                </div>
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default test;
