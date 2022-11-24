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
          <div className="mt-[1.2rem] flex w-full min-w-[2.4rem] min-h-[2.4rem]">
            <div className="gap-[0.4rem] flex justify-center items-center">
              <span>{permissions.admin ? <Check /> : <NotCheck />}</span>
              <p className="text-mdtxWhite uppercase text-[1.2rem] font-[700] select-none tracking-wide">
                admin
              </p>
            </div>
            <div className="ml-[0.8rem] gap-[0.4rem] flex justify-center items-center">
              <span>{permissions.maintain ? <Check /> : <NotCheck />}</span>
              <p className="text-mdtxWhite uppercase text-[1.2rem] font-[700] select-none tracking-wide">
                maintain
              </p>
            </div>
            <div className="ml-[0.8rem] gap-[0.4rem] flex justify-center items-center">
              <span className="flex justify-center items-center">
                {permissions.pull ? <Check /> : <NotCheck />}
              </span>
              <p className="text-mdtxWhite uppercase text-[1.2rem] font-[700] select-none tracking-wide">
                pull
              </p>
            </div>
            <div className="ml-[0.8rem] gap-[0.4rem] flex justify-center items-center">
              <span className="flex justify-center items-center">
                {permissions.push ? <Check /> : <NotCheck />}
              </span>
              <p className="text-mdtxWhite uppercase text-[1.2rem] font-[700] select-none tracking-wide">
                push
              </p>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};
