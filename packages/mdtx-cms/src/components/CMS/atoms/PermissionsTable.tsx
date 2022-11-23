import { Check, NotCheck } from '@/src/assets';
import React from 'react';

export const PermissionsTable: React.FC<{
  permissions?: {
    admin: boolean;
    maintain: boolean;
    push: boolean;
    triage: boolean;
    pull: boolean;
  };
}> = ({ permissions }) => {
  return (
    <div className="flex flex-col w-full">
      {permissions ? (
        <>
          <div className="mt-[2.2rem] flex w-full min-w-[2.4rem] min-h-[2.4rem]">
            <div className="flex justify-center items-center">
              <p className="text-mdtxWhite uppercase text-[1.2rem] font-[700] select-none tracking-wide">
                admin
              </p>
              <span>{permissions.admin ? <Check /> : <NotCheck />}</span>
            </div>
            <div className="flex justify-center items-center">
              <p className="text-mdtxWhite uppercase text-[1.2rem] font-[700] select-none tracking-wide">
                maintain
              </p>
              <span>{permissions.maintain ? <Check /> : <NotCheck />}</span>
            </div>
            <div className="flex justify-center items-center">
              <p className="text-mdtxWhite uppercase text-[1.2rem] font-[700] select-none tracking-wide">
                pull
              </p>
              <span className="flex justify-center items-center">
                {permissions.pull ? <Check /> : <NotCheck />}
              </span>
            </div>
            <div className="flex justify-center items-center">
              <p className="text-mdtxWhite uppercase text-[1.2rem] font-[700] select-none tracking-wide">
                push
              </p>
              <span className="flex justify-center items-center">
                {permissions.push ? <Check /> : <NotCheck />}
              </span>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};
