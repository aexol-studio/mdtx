import React from 'react';
import Image from 'next/image';
import { UserType } from '@/src/backend';

export const UserInfo: React.FC<{
  loggedData?: Omit<UserType, 'organizations'>;
}> = ({ loggedData }) => {
  return (
    <div className="flex items-center gap-4 ">
      {loggedData ? (
        <>
          {loggedData.avatarUrl && (
            <Image
              priority
              width={24}
              height={24}
              className="rounded-full"
              alt="User Logo"
              src={loggedData.avatarUrl}
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
