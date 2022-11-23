import { Hamburger, CloseIconSvg } from '@/src/assets';
import { useFileState } from '@/src/containers';
import { useOutsideClick } from '@/src/hooks/useOutsideClick';
import { RepositoryFromSearch } from '@/src/pages/editor';
import React, { useRef, useState } from 'react';
export enum MenuModalType {
  COMMIT = 'COMMIT',
  PULL_REQUEST = 'PULL_REQUEST',
  FORK = 'FORK',
  CHANGES = 'CHANGES',
}
export const ButtonMenu: React.FC<{
  permissions?: {
    admin: boolean;
    maintain: boolean;
    push: boolean;
    triage: boolean;
    pull: boolean;
  };
  setMenuModal: React.Dispatch<React.SetStateAction<MenuModalType | undefined>>;
}> = ({ permissions, setMenuModal }) => {
  const { modifiedFiles } = useFileState();
  const [optionsMenu, setOptionsMenu] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick(ref, () => setOptionsMenu(false));
  const onlyView =
    permissions?.triage &&
    !permissions.admin &&
    !permissions.maintain &&
    !permissions.pull &&
    !permissions.push;
  return (
    <div
      onClick={() => {
        !optionsMenu && setOptionsMenu(true);
      }}
      className={`${
        optionsMenu
          ? 'right-0 bottom-0 cursor-default'
          : 'right-[2.4rem] bottom-[2.4rem] cursor-pointer'
      } transition-all duration-300 ease-in-out select-none flex justify-center items-center z-[99] rounded-full absolute `}
    >
      <div
        ref={ref}
        className={`${
          optionsMenu
            ? 'w-[24rem] h-[24rem] rounded-lt-full rounded-tl-full border-l-[1px] border-t-[1px] border-mdtxBlack'
            : 'w-[4.2rem] h-[4.2rem] rounded-full'
        } transition-all duration-300 ease-in-out relative flex justify-center items-center bg-mdtxOrange0 z-[100]`}
      >
        <Hamburger small navVisible={optionsMenu} />
        <div
          className={`${
            optionsMenu
              ? 'visible duration-300 delay-300 transition-all ease-in-out'
              : 'invisible'
          }`}
        >
          <div
            className="min-w-[2.4rem] min-h-[2.4rem] max-w-[2.4rem] max-h-[2.4rem] cursor-pointer absolute top-[3.2rem] right-[2.4rem] z-[101]"
            onClick={() => {
              optionsMenu && setOptionsMenu(false);
            }}
          >
            <CloseIconSvg small navVisible={optionsMenu} />
          </div>
          <div className="absolute bottom-[4.2rem] left-[6.4rem]">
            <div
              onClick={() => {
                setMenuModal(MenuModalType.CHANGES);
                setOptionsMenu(false);
              }}
              className="w-fit ml-[4.8rem] mb-[1.2rem]"
            >
              <p className="text-center w-fit text-mdtxWhite uppercase text-[1.4rem] font-[700] select-none hover:underline cursor-pointer">
                Changed (
                <span className="text-[1.2rem]">{modifiedFiles.length}</span>)
              </p>
            </div>
            <div
              onClick={() => {
                if (!onlyView && permissions?.push) {
                  setMenuModal(MenuModalType.COMMIT);
                  setOptionsMenu(false);
                }
              }}
              className="w-fit ml-[3.2rem] mb-[1.2rem]"
            >
              <p
                className={`${
                  permissions?.push
                    ? 'text-mdtxWhite hover:underline cursor-pointer'
                    : 'text-mdtxBlack line-through'
                } text-center w-fit uppercase text-[1.4rem] font-[700] select-none`}
              >
                Commit
              </p>
            </div>
            <div
              onClick={() => {
                // setMenuModal(MenuModalType.FORK);
                // setOptionsMenu(false);
              }}
              className="w-fit ml-[1.6rem] mb-[1.2rem]"
            >
              <p className="text-center w-fit text-mdtxBlack uppercase text-[1.4rem] font-[700] select-none line-through">
                Fork
              </p>
            </div>
            <div
              onClick={() => {
                if (!onlyView && permissions?.pull) {
                  setMenuModal(MenuModalType.PULL_REQUEST);
                  setOptionsMenu(false);
                }
              }}
              className="w-fit"
            >
              <p
                className={`${
                  permissions?.pull
                    ? 'text-mdtxWhite hover:underline cursor-pointer'
                    : 'text-mdtxBlack line-through'
                } text-center w-fit uppercase text-[1.4rem] font-[700] select-none`}
              >
                Pull request
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
