import React from 'react';
import Image from 'next/image';
import { UserType } from '@/src/containers';

export const UserInfo: React.FC<{
  loggedData?: UserType;
}> = ({ loggedData }) => {
  return (
    <div className="flex items-center gap-4 ">
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

          <p className="text-2xl text-center font-[400] text-white">
            {loggedData.name}
          </p>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};
