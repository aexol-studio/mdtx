import { useAuthState } from '@/src/containers/AuthContainer';
import { ICommand } from '@uiw/react-md-editor';
import Link from 'next/link';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { commandsType } from '../organisms/Editor';
import { useOutsideClick } from '@/src/hooks/useOutsideClick';

export const UserInfo = (commands: commandsType): ICommand => {
  return commands.group([], {
    name: 'UserHolder',
    groupName: 'UserHolder',
    buttonProps: {
      'aria-label': 'UserHolder',
    },
    icon: <></>,
    render: () => {
      const { loggedData, logOut } = useAuthState();
      const [open, setOpen] = useState(false);
      const ref = useRef<HTMLDivElement>(null);
      const handleMenu = () => setOpen(!open);
      useOutsideClick(ref, () => setOpen(false));
      return (
        loggedData && (
          <div
            ref={ref}
            onClick={handleMenu}
            className="z-[100] relative py-[0.8rem] bg-transparent mx-[1.6rem]"
          >
            <div className="cursor-pointer flex gap-[0.8rem] items-center">
              <Image
                loader={({ src }) => src}
                priority
                width={24}
                height={24}
                className="cursor-pointer rounded-full"
                alt="User Logo"
                src={loggedData.avatar_url}
              />

              <p className="text-[1.6rem] leading-[1.8rem] font-[400] text-editor-light1">
                {loggedData.name ? loggedData.name : loggedData.login}
              </p>
            </div>
            {open && (
              <div className="absolute w-[calc(100%+0.4rem)] bg-editor-black1 border-editor-black3 border-b-[2px] border-l-[2px] border-r-[2px] rounded-bl-[0.8rem] rounded-br-[0.8rem] top-[4.2rem] shadow-xl">
                <div className="mt-[0.8rem] px-[1.6rem]">
                  <Link
                    href={loggedData.html_url + '?tab=repositories'}
                    target={'_blank'}
                    className="hover:underline cursor-pointer w-fit text-[1.4rem] leading-[1.8rem] font-[400] text-editor-light1"
                  >
                    Go to GitHub
                  </Link>
                </div>
                <div className="mt-[0.8rem] mb-[1.6rem] px-[1.6rem]">
                  <p
                    onClick={logOut}
                    className="hover:underline cursor-pointer w-fit text-[1.4rem] leading-[1.8rem] font-[400] text-editor-light1"
                  >
                    Log out
                  </p>
                </div>
              </div>
            )}
          </div>
        )
      );
    },
  });
};
