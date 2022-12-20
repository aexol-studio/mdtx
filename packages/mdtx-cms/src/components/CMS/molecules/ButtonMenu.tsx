import { Hamburger, CloseIconSvg } from '@/src/assets';
import {
  useAuthState,
  useFileState,
  useRepositoryState,
} from '@/src/containers';
import { useOutsideClick } from '@/src/hooks/useOutsideClick';
import { useRef, useState } from 'react';

export enum MenuModalType {
  COMMIT = 'COMMIT',
  PULL_REQUEST = 'PULL_REQUEST',
  FORK = 'FORK',
  CHANGES = 'CHANGES',
  UPLOAD = 'UPLOAD',
}
export const ButtonMenu: React.FC<{
  forksOnRepo?: {
    full_name: string;
  }[];
  setMenuModal: React.Dispatch<React.SetStateAction<MenuModalType | undefined>>;
}> = ({ setMenuModal, forksOnRepo }) => {
  const { selectedRepository } = useRepositoryState();
  const { loggedData } = useAuthState();
  const { modifiedFiles } = useFileState();
  const [optionsMenu, setOptionsMenu] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick(ref, () => setOptionsMenu(false));
  const { permissions } = selectedRepository!;
  const onlyView =
    permissions?.triage &&
    !permissions.admin &&
    !permissions.maintain &&
    !permissions.pull &&
    !permissions.push;
  const canDoFork =
    !forksOnRepo?.find((x) =>
      x.full_name.includes(loggedData ? loggedData.login : ''),
    ) &&
    !selectedRepository?.full_name.includes(loggedData ? loggedData.login : '');

  return (
    <div
      onClick={() => !optionsMenu && setOptionsMenu(true)}
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
            {optionsMenu && <CloseIconSvg />}
          </div>
          <div className="top-[65%] translate-y-[-50%] absolute right-[3.2rem] flex flex-col gap-[0.8rem] w-[50%]">
            <div
              className="flex justify-end"
              onClick={() => {
                setMenuModal(MenuModalType.CHANGES);
                setOptionsMenu(false);
              }}
            >
              <p className="w-fit text-right text-mdtxWhite uppercase text-[1.4rem] font-[700] select-none hover:underline cursor-pointer">
                Changed&nbsp;
                <span className="text-[1.2rem] leading-[1.2rem]">
                  ({modifiedFiles.length})
                </span>
              </p>
            </div>
            <div
              className="flex justify-end"
              onClick={() => {
                if (!onlyView && permissions?.push) {
                  setMenuModal(MenuModalType.COMMIT);
                  setOptionsMenu(false);
                }
              }}
            >
              <p
                className={`${
                  permissions?.push
                    ? 'text-mdtxWhite hover:underline cursor-pointer'
                    : 'text-mdtxBlack line-through'
                } w-fit text-right uppercase text-[1.4rem] font-[700] select-none`}
              >
                Commit
              </p>
            </div>
            {/* <div
              className="flex justify-end"
              onClick={() => {
                if (canDoFork) {
                  setMenuModal(MenuModalType.FORK);
                  setOptionsMenu(false);
                }
              }}
            >
              <p
                className={`${
                  canDoFork
                    ? 'text-mdtxWhite hover:underline cursor-pointer'
                    : 'text-mdtxBlack line-through'
                } w-fit text-right uppercase text-[1.4rem] font-[700] select-none`}
              >
                Fork
              </p>
            </div> */}
            <div
              className="flex justify-end"
              onClick={() => {
                if (!onlyView && permissions?.pull) {
                  setMenuModal(MenuModalType.PULL_REQUEST);
                  setOptionsMenu(false);
                }
              }}
            >
              <p
                className={`${
                  permissions?.pull
                    ? 'text-mdtxWhite hover:underline cursor-pointer'
                    : 'text-mdtxBlack line-through'
                } w-fit text-right uppercase text-[1.4rem] font-[700] select-none`}
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
