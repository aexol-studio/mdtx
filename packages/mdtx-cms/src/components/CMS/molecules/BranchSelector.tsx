import { Check, MDtxLogo, NotCheck } from '@/src/assets';
import { availableBranchType, RepositoryFromSearch } from '@/src/pages/editor';
import React from 'react';
import { PulseLoader } from 'react-spinners';
import { Button, PermissionsTable, SelectBranch } from '../atoms';

interface IBranchSelector {
  downloadZIP: boolean;
  selectedRepository?: RepositoryFromSearch;
  confirmBranchClick: () => Promise<void>;
  availableBranches: availableBranchType[];
  selectedBranch?: availableBranchType;
  setSelectedBranch: React.Dispatch<
    React.SetStateAction<availableBranchType | undefined>
  >;
}

export const BranchSelector: React.FC<IBranchSelector> = ({
  downloadZIP,
  selectedRepository,
  confirmBranchClick,
  availableBranches,
  selectedBranch,
  setSelectedBranch,
}) => {
  return (
    <div className="flex flex-col w-[80%] mx-auto h-full">
      {downloadZIP ? (
        <div className="flex h-full justify-center items-center flex-col gap-[4.2rem]">
          <p className="text-mdtxWhite uppercase text-[1.2rem] font-[700] select-none">
            Loading repository...
          </p>
          <PulseLoader size={'16px'} color="#FF7200" />
        </div>
      ) : (
        <>
          <div className="absolute top-[1.6rem] left-[1.6rem]">
            <MDtxLogo small />
          </div>
          <div className="mt-[1.6rem] flex items-center justify-center">
            <p className="w-fit mt-[1.6rem] text-mdtxWhite uppercase text-[1.4rem] font-[700] select-none tracking-wide">
              Select branch to work
            </p>
          </div>
          <div className="mt-[4.2rem] flex justify-between">
            <div className="flex flex-col justify-end">
              <p className="w-fit text-mdtxWhite uppercase text-[1.2rem] font-[700] select-none">
                Selected repository:{' '}
                <span className="text-mdtxOrange1 font-[500]">
                  {selectedRepository?.name}
                </span>
              </p>
            </div>
          </div>
          <div>
            <div className="min-w-fit">
              <p className="w-fit mt-[1.6rem] text-mdtxWhite uppercase text-[1.2rem] font-[700] select-none tracking-wide">
                Your access to repository
              </p>
              <PermissionsTable permissions={selectedRepository?.permissions} />
            </div>{' '}
          </div>
          <div className="mt-[2.4rem] flex justify-between gap-[4.2rem]">
            <div className="flex-1">
              <SelectBranch
                onChange={(e) => setSelectedBranch(e)}
                options={availableBranches}
                placeholder={availableBranches[0].name}
                value={selectedBranch}
              />
            </div>
            <div className="flex h-full">
              <Button
                color="orange"
                text="Accept"
                onClick={confirmBranchClick}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
