import React from 'react';
import Image from 'next/image';
import { UserType } from '@/src/containers';

export const UserInfo: React.FC<{
  loggedData?: UserType;
  logOut: () => void;
}> = ({ loggedData, logOut }) => {
  return (
    <div className="flex items-center gap-[1.6rem] ">
      {loggedData ? (
        <>
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
          <p
            onClick={logOut}
            className="text-[1.4rem] text-center font-[400] text-white"
          >
            {loggedData.name}
          </p>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};
