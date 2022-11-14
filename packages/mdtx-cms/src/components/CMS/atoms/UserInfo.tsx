import React from 'react';
import Image from 'next/image';
import { UserType } from '@/src/backend';

export const UserInfo: React.FC<{
  loggedData?: Omit<UserType, 'organizations'>;
}> = ({ loggedData }) => {
  return (
    <div className="flex flex-col items-center">
      {loggedData ? (
        <>
          {loggedData.avatarUrl && (
            <div className="my-[0.8rem] relative w-[6.4rem] h-[6.4rem] rounded-full self-center">
              <Image
                priority
                width={128}
                height={128}
                className="rounded-full"
                alt="User Logo"
                src={loggedData.avatarUrl}
              />
            </div>
          )}
          <p className="text-center font-[700] text-mdtxOrange0">Welcome!</p>
          <p className="text-center font-[400] text-white">{loggedData.name}</p>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};
