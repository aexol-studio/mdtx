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
          <div className="mt-[4.2rem] flex w-full">
            <p className="w-1/4 rotate-[-90deg] text-mdtxWhite uppercase text-[1.2rem] font-[700] select-none tracking-wide">
              admin
            </p>
            <p className="w-1/4 rotate-[-90deg] text-mdtxWhite uppercase text-[1.2rem] font-[700] select-none tracking-wide">
              maintain
            </p>
            <p className="w-1/4 rotate-[-90deg] text-mdtxWhite uppercase text-[1.2rem] font-[700] select-none tracking-wide">
              pull
            </p>
            <p className="w-1/4 rotate-[-90deg] text-mdtxWhite uppercase text-[1.2rem] font-[700] select-none tracking-wide">
              push
            </p>
          </div>
          <div className="mt-[2.2rem] flex w-full min-w-[2.4rem] min-h-[2.4rem]">
            <span className="w-1/4 flex justify-center items-center">
              {permissions.admin ? <Check /> : <NotCheck />}
            </span>
            <span className="w-1/4 flex justify-center items-center">
              {permissions.maintain ? <Check /> : <NotCheck />}
            </span>
            <span className="w-1/4 flex justify-center items-center">
              {permissions.pull ? <Check /> : <NotCheck />}
            </span>
            <span className="w-1/4 flex justify-center items-center">
              {permissions.push ? <Check /> : <NotCheck />}
            </span>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};
