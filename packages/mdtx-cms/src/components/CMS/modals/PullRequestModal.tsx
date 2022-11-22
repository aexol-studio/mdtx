import { availableBranchType } from '@/src/pages/editor';
import React from 'react';
import {
  Control,
  Controller,
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormRegister,
} from 'react-hook-form';
import { Button, Select } from '../atoms';

export type PullRequestInput = {
  selectedTargetBranch: string;
  newBranchName: string;
  pullRequestTitle: string;
  pullRequestMessage: string;
  commitHeadlineMessage: string;
  commitBodyMessage: string;
};

interface IPullRequestModal {
  controlPullRequest: Control<PullRequestInput, any>;
  allowedRepositories?: availableBranchType[];
  registerPullRequest: UseFormRegister<PullRequestInput>;
  handleSubmitPullRequest: UseFormHandleSubmit<PullRequestInput>;
  onPullRequestSubmit: SubmitHandler<PullRequestInput>;
}

export const PullRequestModal: React.FC<IPullRequestModal> = ({
  controlPullRequest,
  allowedRepositories,
  registerPullRequest,
  handleSubmitPullRequest,
  onPullRequestSubmit,
}) => {
  return (
    <div className="w-full h-full justify-center items-center">
      <form
        className="w-[80%] h-full mx-auto flex flex-col gap-[1.2rem] justify-center"
        onSubmit={handleSubmitPullRequest(onPullRequestSubmit)}
      >
        <p className="mb-[0.8rem] select-none text-center text-white text-[1.6rem] font-[700] uppercase tracking-wider">
          PULL REQUEST
        </p>
        <p className="select-none text-white text-[1.4rem]">Target branch</p>
        <div>
          {allowedRepositories?.length && (
            <Controller
              control={controlPullRequest}
              name="selectedTargetBranch"
              render={({ field: { onChange, value } }) => (
                <Select
                  placeholder={value ? value : allowedRepositories[0].name}
                  value={value ? value : allowedRepositories[0].name}
                  onChange={onChange}
                  options={allowedRepositories.map((x) => x.name)}
                />
              )}
            />
          )}
        </div>
        <p className="select-none text-white text-[1.4rem]">New branch name</p>
        <input
          {...registerPullRequest('newBranchName', {
            required: true,
          })}
          placeholder="Commit message"
        />
        <p className="select-none text-white text-[1.4rem]">
          Pull request title
        </p>
        <input
          {...registerPullRequest('pullRequestTitle', {
            required: true,
          })}
          placeholder="Commit message"
        />
        <p className="select-none text-white text-[1.4rem]">
          Pull request message
        </p>
        <input
          {...registerPullRequest('pullRequestMessage', {
            required: true,
          })}
          placeholder="Commit message"
        />
        <p className="select-none text-white text-[1.4rem]">
          Commit head message
        </p>
        <input
          {...registerPullRequest('commitHeadlineMessage', {
            required: true,
          })}
          placeholder="Commit message"
        />
        <p className="mt-[0.8rem] select-none text-white text-[1.4rem]">
          Commit body message
        </p>
        <input
          {...registerPullRequest('commitBodyMessage', {
            required: true,
          })}
          placeholder="Commit message"
        />
        <div className="self-end w-fit">
          <Button
            customClassName="mt-[0.8rem] px-[3.2rem] py-[0.4rem]"
            type="form"
            text="Wyślij"
            color="orange"
          />
        </div>
      </form>
    </div>
  );
};
