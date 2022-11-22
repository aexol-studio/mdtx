import { availableBranchType, RepositoryFromSearch } from '@/src/pages/editor';
import React from 'react';
import { PulseLoader } from 'react-spinners';
import { Button, SelectBranch } from '../atoms';

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
    <div className="flex flex-col w-[80%] mx-auto h-full justify-center">
      {downloadZIP ? (
        <div className="flex justify-center items-center flex-col gap-[4.2rem]">
          <p className="text-mdtxWhite uppercase text-[1.2rem] font-[700] select-none">
            Loading repository...
          </p>
          <PulseLoader size={'16px'} color="#FF7200" />
        </div>
      ) : (
        <>
          <div>
            <p className="w-fit text-mdtxWhite uppercase text-[1.2rem] font-[700] select-none">
              Selected repository:{' '}
              <span className="text-mdtxOrange1 font-[500]">
                {selectedRepository?.name}
              </span>
            </p>
            <p className="w-fit mt-[1.6rem] text-mdtxWhite uppercase text-[1.2rem] font-[700] select-none tracking-wide">
              Select branch to work
            </p>
          </div>
          <div className="mt-[0.8rem] flex justify-between gap-[4.2rem]">
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
