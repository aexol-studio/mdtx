import { useState } from 'react';
import Image from 'next/image';
import { UserType } from '@/src/containers';
import { Chevron } from '@/src/assets';

export const UserInfo: React.FC<{
  loggedData?: UserType;
  logOut: () => void;
}> = ({ loggedData, logOut }) => {
  const [openMenu, setOpenMenu] = useState(false);
  return (
    <div>
      {loggedData ? (
        <div
          className="relative w-fit cursor-pointer flex items-center gap-[0.4rem]"
          onClick={() => {
            setOpenMenu((prev) => !prev);
          }}
        >
          <div className="flex items-center gap-[0.8rem]">
            {loggedData.avatar_url && (
              <Image
                priority
                width={24}
                height={24}
                className="rounded-full"
                alt="User Logo"
                src={loggedData.avatar_url}
              />
            )}
            <p className="text-[1.4rem] text-center font-[400] text-white">
              {loggedData.name}
            </p>
          </div>
          <div
            className={`${
              openMenu ? 'scale-y-[1]' : 'scale-y-[-1]'
            } transition-all duration-300 min-w-[1.2rem] min-h-[1.2rem] flex justify-center items-center`}
          >
            <Chevron small colorFill="white" />
          </div>
          {openMenu ? (
            <div className="absolute right-0 top-[2.4rem] w-[80%]">
              <p onClick={logOut} className="text-white w-fit hover:underline text-[1.4rem] font-[400]">
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
