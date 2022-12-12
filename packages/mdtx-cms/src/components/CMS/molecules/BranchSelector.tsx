import { MDtxLogo, PullRequestIcon } from '@/src/assets';
import {
  availableBranchType,
  PullRequestsType,
  RepositoryFromSearch,
} from '@/src/pages/editor';
import Image from 'next/image';
import React, { useState } from 'react';
import { PulseLoader } from 'react-spinners';
import { Button, PermissionsTable, SelectBranch } from '../atoms';

interface IBranchSelector {
  foundedFork: boolean;
  downloadZIP: boolean;
  selectedRepository?: RepositoryFromSearch;
  confirmBranchClick: () => Promise<void>;
  availableBranches: availableBranchType[];
  availablePullRequests?: PullRequestsType[];
  selectedBranch?: availableBranchType;
  setSelectedBranch: React.Dispatch<
    React.SetStateAction<availableBranchType | undefined>
  >;
  doForkFunction: (fullName: string) => void;
  doingFork: boolean;
}

export const BranchSelector: React.FC<IBranchSelector> = ({
  foundedFork,
  downloadZIP,
  selectedRepository,
  confirmBranchClick,
  availablePullRequests,
  availableBranches,
  selectedBranch,
  setSelectedBranch,
  doForkFunction,
  doingFork,
}) => {
  const [pullRequestView, setPullRequestView] = useState(false);
  return (
    <div className="flex flex-col w-[80%] mx-auto h-full overflow-hidden">
      {downloadZIP || doingFork ? (
        <div className="flex h-full justify-center items-center flex-col gap-[4.2rem]">
          <p className="text-mdtxWhite uppercase text-[1.2rem] font-[700] select-none">
            {doingFork ? 'Doing fork...' : 'Loading repository...'}
          </p>
          <PulseLoader size={'16px'} color="#FF7200" />
        </div>
      ) : (
        <>
          <div className="absolute top-[1.6rem] left-[1.6rem]">
            <MDtxLogo small />
          </div>
          {
            <>
              {availablePullRequests && availablePullRequests.length > 0 && (
                <>
                  {!pullRequestView ? (
                    <div
                      onClick={() => {
                        setPullRequestView(true);
                      }}
                      className="absolute bottom-[1.6rem] left-[1.6rem]"
                    >
                      <p className="hover:underline cursor-pointer w-fit text-mdtxWhite uppercase text-[1rem] font-[700] select-none tracking-wider">
                        <span className="text-mdtxOrange1 font-[500] text-[1rem]">{`<<`}</span>{' '}
                        See pull requests
                      </p>
                    </div>
                  ) : (
                    <div
                      onClick={() => {
                        setPullRequestView(false);
                      }}
                      className="z-[102] absolute bottom-[1.6rem] right-[1.6rem]"
                    >
                      <p className="hover:underline cursor-pointer w-fit text-mdtxWhite uppercase text-[1rem] font-[700] select-none tracking-wider">
                        See branches{' '}
                        <span className="text-mdtxOrange1 font-[500] text-[1rem]">{`>>`}</span>
                      </p>
                    </div>
                  )}
                </>
              )}
            </>
          }
          <div className="mt-[3.2rem] flex items-center justify-center">
            <p className="w-fit mt-[1.6rem] text-mdtxWhite uppercase text-[1.4rem] font-[700] select-none tracking-wide">
              {pullRequestView ? 'Select PR to work' : 'Select branch to work'}
            </p>
          </div>
          <div className="mt-[2.4rem] flex justify-between">
            <div className="flex flex-col justify-end">
              <p className="w-fit text-mdtxWhite uppercase text-[1.2rem] font-[700] select-none">
                Selected repository:{' '}
                <span className="ml-[0.4rem] text-mdtxOrange1 font-[500]">
                  {selectedRepository?.full_name}
                </span>
              </p>
            </div>
          </div>
          <div
            className={`${
              !pullRequestView
                ? 'translate-x-[200%] invisible h-0'
                : 'translate-x-0 visible'
            } h-full transition-transform duration-300 ease-in-out w-full flex-col`}
          >
            <div className="mt-[0.8rem] max-h-[20rem] h-full overflow-y-scroll scrollbar">
              {availablePullRequests?.map((pr, idx) => (
                <div
                  key={idx}
                  className={`${
                    idx !== 0 ? 'border-t-[1px] pt-[1.6rem]' : ''
                  } mt-[1.6rem] select-none flex flex-col`}
                >
                  <div className="flex items-center gap-[0.8rem]">
                    <PullRequestIcon />
                    <div className="flex text-mdtxWhite">
                      <p className="text-[1.2rem] font-[700]">From</p>&nbsp;
                      <p className="text-[1.2rem] font-[700]">{pr.head.ref}</p>
                      &nbsp;
                      <p className="text-[1.2rem] font-[700]">to</p>&nbsp;
                      <p className="text-[1.2rem] font-[700]">{pr.base.ref}</p>
                    </div>
                  </div>
                  <div className="mt-[0.8rem] text-mdtxWhite">
                    <p className="text-[1.2rem]">
                      Last update: {pr.updated_at.split('T')[0]}&nbsp;
                      {pr.updated_at.split('T')[1].replace('Z', '')}
                    </p>
                  </div>
                  <div className="mt-[0.8rem] text-mdtxWhite">
                    <p className="text-[1.2rem]">
                      Pull request title: {pr.title}
                    </p>
                  </div>
                  <div className="mt-[0.8rem] text-mdtxWhite">
                    <p className="text-[1.2rem]">
                      Pull request body: {pr.body}
                    </p>
                  </div>

                  <div className="w-full justify-between mt-[1.2rem] flex">
                    <div className="flex items-center gap-[0.8rem] ">
                      {pr?.user?.avatar_url && (
                        <Image
                          priority
                          width={24}
                          height={24}
                          className="rounded-full"
                          alt="User Logo"
                          src={pr.user.avatar_url}
                        />
                      )}
                      <p className="select-none text-[1.2rem] text-center font-[400] text-white">
                        Authored by: {pr?.user?.login}
                      </p>
                    </div>
                    <Button
                      onClick={() => {
                        const found = availableBranches.find(
                          (x) => x.name === pr.head.ref,
                        );
                        setSelectedBranch(found);
                        confirmBranchClick();
                      }}
                      color="orange"
                      text="Select"
                      customClassName="mr-[0.8rem]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div
            className={`${
              pullRequestView
                ? 'translate-x-[-200%] invisible '
                : 'translate-x-0 visible'
            } transition-transform duration-300 ease-in-out`}
          >
            <div className="mt-[4.8rem] ">
              <div className="w-full flex items-end">
                <p className="w-fit mt-[1.6rem] text-mdtxWhite uppercase text-[1.2rem] font-[700] select-none tracking-wide">
                  Your access to repository:{' '}
                </p>
                {!foundedFork && (
                  <p className="ml-[4.2rem] w-fit mt-[1.6rem] text-mdtxWhite uppercase text-[1rem] font-[700] select-none tracking-wide">
                    Do you need more access?{' '}
                    <span
                      onClick={() => {
                        if (selectedRepository)
                          doForkFunction(selectedRepository.full_name);
                      }}
                      className={`ml-[0.4rem] text-[1rem] hover:underline cursor-pointer text-mdtxOrange1`}
                    >
                      Do fork!
                    </span>
                  </p>
                )}
              </div>

              <PermissionsTable permissions={selectedRepository?.permissions} />
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
          </div>
        </>
      )}
    </div>
  );
};
