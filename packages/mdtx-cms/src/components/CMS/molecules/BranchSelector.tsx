import { PullRequestIcon } from '@/src/assets';
import { availableBranchType, ToastType, useAuthState, useRepositoryState, useToasts } from '@/src/containers';
import { PullRequestsType } from '@/src/pages/editor';
import { useGitLab } from '@/src/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { PulseLoader } from 'react-spinners';
import { Button, PermissionsTable, SelectBranch } from '../atoms';
import { Gitlab as GitLabApi } from '@gitbeaker/browser';

interface IBranchSelector {
    foundedFork: boolean;
    downloadZIP: boolean;
    confirmBranchClick: (branchName?: string) => Promise<boolean | undefined>;
    availableBranches: availableBranchType[];
    availablePullRequests?: PullRequestsType[];
    doForkFunction: (fullName: string) => void;
    doingFork: boolean;
}

export const BranchSelector: React.FC<IBranchSelector> = ({
    foundedFork,
    downloadZIP,
    confirmBranchClick,
    availablePullRequests,
    availableBranches,
    doForkFunction,
    doingFork,
}) => {
    const router = useRouter();
    const [pullRequestView, setPullRequestView] = useState(false);
    const [block, setBlock] = useState(true);
    const [openSelect, setOpenSelect] = useState(false);
    const handleSelect = (p: boolean) => setOpenSelect(p);
    const { selectedRepository, selectedBranch, handleBranch, handleRepository } = useRepositoryState();
    const { requestForAccess, getGitLabRepositoryInfo } = useGitLab();
    const { searchInService } = useAuthState();
    const { createToast } = useToasts();
    return (
        <div className={`${openSelect ? '' : block ? 'overflow-hidden' : ''} pt-[3.2rem] flex flex-col h-full`}>
            {downloadZIP || doingFork ? (
                <div className="flex h-full justify-center items-center flex-col gap-[4.2rem]">
                    <p className="text-mdtxWhite uppercase text-[1.2rem] font-[700] select-none">
                        {doingFork ? 'Doing fork...' : 'Loading repository...'}
                    </p>
                    <PulseLoader size={'12px'} color="#005EEE" />
                </div>
            ) : (
                <>
                    {availablePullRequests && availablePullRequests.length > 0 && (
                        <>
                            {!pullRequestView ? (
                                <div
                                    onClick={() => {
                                        setPullRequestView(true);
                                        setBlock(true);
                                    }}
                                    className="absolute bottom-[1.6rem] left-[1.6rem]">
                                    <p className="group cursor-pointer w-fit text-editor-light1 text-[1.2rem] font-[500] select-none">
                                        <span className="group-hover:animate-pulse text-editor-blue2 font-[400] text-[1.2rem]">{`<<`}</span>{' '}
                                        See pull requests
                                    </p>
                                </div>
                            ) : (
                                <div
                                    onClick={() => {
                                        setPullRequestView(false);
                                        setBlock(true);
                                    }}
                                    className="z-[102] absolute bottom-[1.6rem] right-[1.6rem]">
                                    <p className="group cursor-pointer w-fit text-editor-light1 text-[1.2rem] font-[500] select-none">
                                        See branches{' '}
                                        <span className="group-hover:animate-pulse text-editor-blue2 font-[400] text-[1.2rem]">{`>>`}</span>
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                    <div className="flex px-[10.8rem]">
                        <p className="select-none text-[2.4rem] font-[700] leading-[2.8rem] text-editor-light1">
                            {pullRequestView ? 'Select PR to work' : 'Select branch to work'}
                        </p>
                    </div>
                    <div className="mt-[3.6rem] flex justify-between px-[10.8rem]">
                        <div className="flex flex-col justify-end">
                            <p className="w-fit text-editor-purple2 text-[1.6rem] font-[400] select-none">
                                Selected repository:{' '}
                                <span className="ml-[0.4rem] text-editor-light1 font-[500]">
                                    {selectedRepository?.full_name}
                                </span>
                            </p>
                        </div>
                    </div>
                    <div
                        onTransitionEnd={() => setBlock(false)}
                        className={`${
                            !pullRequestView ? 'translate-x-[200%] invisible h-0' : 'translate-x-0 visible'
                        } max-h-[21.4rem] transition-transform duration-300 ease-in-out w-full flex-col`}>
                        <div className="mt-[1.6rem] h-full overflow-y-scroll scrollbar">
                            {availablePullRequests?.map((pr, idx) => (
                                <div
                                    key={idx}
                                    className={`${
                                        idx !== 0 ? 'border-t-[1px] pt-[1.6rem]' : ''
                                    } px-[2.4rem] mt-[1.6rem] select-none flex flex-col`}>
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
                                        <p className="text-[1.2rem]">Pull request title: {pr.title}</p>
                                    </div>
                                    <div className="mt-[0.8rem] text-mdtxWhite">
                                        <p className="text-[1.2rem]">Pull request body: {pr.body}</p>
                                    </div>

                                    <div className="w-full justify-between mt-[1.2rem] flex">
                                        <div className="flex items-center gap-[0.8rem] ">
                                            {pr?.user?.avatar_url && (
                                                <Image
                                                    loader={({ src }) => src}
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
                                                const found = availableBranches.find(x => x.name === pr.head.ref);
                                                if (found) {
                                                    handleBranch(found);
                                                    confirmBranchClick();
                                                } else {
                                                    createToast(ToastType.ERROR, 'We cannot open this pr right now');
                                                }
                                            }}
                                            text="Select"
                                            customClassName="mr-[0.8rem]"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div
                        onTransitionEnd={() => setBlock(false)}
                        className={`${
                            pullRequestView ? 'translate-x-[-200%] invisible ' : 'translate-x-0 visible'
                        } px-[10.8rem] transition-transform duration-300 ease-in-out`}>
                        <div className="">
                            {searchInService?.service === 'github' && (
                                <div className="w-full flex items-end">
                                    <p className="min-w-fit mt-[1.6rem] text-editor-purple2 text-[1.6rem] font-[500] select-none">
                                        Your access to repository:{' '}
                                    </p>

                                    <div className="ml-[0.8rem]">
                                        <PermissionsTable permissions={selectedRepository?.permissions} />
                                    </div>
                                </div>
                            )}
                            {!foundedFork && (
                                <p className="w-fit mt-[1.6rem] text-editor-purple2 text-[1.6rem] font-[400] select-none">
                                    Need more access?{' '}
                                    <span
                                        onClick={() => {
                                            if (selectedRepository) doForkFunction(selectedRepository.full_name);
                                        }}
                                        className={`ml-[1.6rem] text-[1.6rem] font-[600] leading-[1.92rem] hover:underline cursor-pointer text-editor-blue2`}>
                                        Fork repository
                                    </span>
                                </p>
                            )}
                            {searchInService?.service === 'gitlab' &&
                                !selectedRepository?.permissions?.gitlabPermission && (
                                    <>
                                        <p className="w-fit mt-[1.6rem] text-editor-purple2 text-[1.6rem] font-[400] select-none">
                                            You need more access to work with this repository
                                        </p>
                                        <span
                                            onClick={async () => {
                                                if (selectedRepository) {
                                                    const host =
                                                        searchInService.url &&
                                                        searchInService.url[searchInService.url.length - 1] === '/'
                                                            ? searchInService.url?.slice(
                                                                  0,
                                                                  searchInService.url.length - 1,
                                                              )
                                                            : searchInService.url;
                                                    const gitlabApi = new GitLabApi({
                                                        host,
                                                        token: searchInService.token,
                                                    });
                                                    const res = await requestForAccess(
                                                        {
                                                            owner: selectedRepository?.full_name.split('/')[0],
                                                            repo: selectedRepository?.full_name.split('/')[1],
                                                        },
                                                        gitlabApi,
                                                    );
                                                    if (!res)
                                                        createToast(ToastType.ERROR, 'Your request cannot be applied');
                                                    if (res) {
                                                        const newData = await getGitLabRepositoryInfo(
                                                            {
                                                                owner: selectedRepository?.full_name.split('/')[0],
                                                                repo: selectedRepository?.full_name.split('/')[1],
                                                            },
                                                            gitlabApi,
                                                        );
                                                        if (newData) {
                                                            handleRepository(newData);
                                                            createToast(ToastType.SUCCESS, 'Your request is pending');
                                                        }
                                                    }
                                                }
                                            }}
                                            className={`text-[1.6rem] font-[600] leading-[1.92rem] hover:underline cursor-pointer text-editor-blue2`}>
                                            Request for permissions
                                        </span>
                                    </>
                                )}
                        </div>
                        {!pullRequestView && (
                            <div
                                className={`${
                                    !foundedFork ? 'mt-[4.2rem]' : 'mt-[6.6rem]'
                                } flex items-end justify-between gap-[4.2rem]`}>
                                <div className="flex flex-col flex-1">
                                    <p className="text-editor-light1 text-[1.4rem] leading-[1.8rem] font-[500] mb-[0.8rem]">
                                        Branch
                                    </p>
                                    <div className="">
                                        <SelectBranch
                                            open={openSelect}
                                            handleOpen={handleSelect}
                                            onChange={e => handleBranch(e)}
                                            options={availableBranches}
                                            placeholder={availableBranches[0].name}
                                            value={selectedBranch}
                                        />
                                    </div>
                                </div>
                                <div className="flex h-full">
                                    <Button
                                        blocked={
                                            searchInService?.service === 'github'
                                                ? false
                                                : searchInService?.service === 'gitlab' &&
                                                  selectedRepository?.permissions?.gitlabPermission
                                                ? false
                                                : true
                                        }
                                        text="Accept"
                                        onClick={confirmBranchClick}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};
