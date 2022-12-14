import { useState } from 'react';
import Image from 'next/image';
import { UserType } from '@/src/containers';
import { Chevron } from '@/src/assets';
import Link from 'next/link';

export const UserInfo: React.FC<{
  loggedData?: UserType;
  logOut: () => void;
}> = ({ loggedData, logOut }) => {
  const [openMenu, setOpenMenu] = useState(false);
  return (
    <div>
      {loggedData ? (
        <div
          className="relative w-fit flex items-center gap-[0.4rem]"
          onClick={() => {
            setOpenMenu((prev) => !prev);
          }}
        >
          <div className="flex items-center gap-[0.8rem]">
            {loggedData.avatar_url && (
              <Image
                loader={({ src }) => src}
                priority
                width={24}
                height={24}
                className="cursor-pointer rounded-full"
                alt="User Logo"
                src={loggedData.avatar_url}
              />
            )}
            <p className="cursor-pointer text-[1.2rem] text-center font-[400] text-white">
              {loggedData.name ? loggedData.name : loggedData.login}
            </p>
          </div>
          <div
            className={`${
              openMenu ? 'scale-y-[1]' : 'scale-y-[-1]'
            } cursor-pointer transition-all duration-300 min-w-[1.2rem] min-h-[1.2rem] flex justify-center items-center`}
          >
            <Chevron small colorFill="white" />
          </div>
          {openMenu ? (
            <div
              onMouseLeave={() => {
                setOpenMenu(false);
              }}
              className="bg-mdtxBlack pt-[0.8rem] z-[99] border-l-[1px] border-b-[1px] border-r-[1px] rounded-b-[0.8rem] border-t-none border-mdtxOrange1 absolute left-0 top-[2.6rem] w-[100%]"
            >
              <Link
                href={loggedData.html_url + '?tab=repositories'}
                target={'_blank'}
                className="cursor-pointer pl-[1.2rem] py-[0.8rem] text-white w-fit text-[1.2rem] font-[400] hover:underline"
              >
                Go to GitHub
              </Link>
              <p
                onClick={logOut}
                className="cursor-pointer pl-[1.2rem] py-[0.8rem] text-white w-fit text-[1.2rem] font-[400] hover:underline"
              >
                Log out
              </p>
            </div>
          ) : (
            <></>
          )}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
