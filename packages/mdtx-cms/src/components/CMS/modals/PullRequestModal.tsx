import { availableBranchType } from '@/src/pages/editor';
import React from 'react';
import {
  Control,
  Controller,
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormRegister,
} from 'react-hook-form';
import { PulseLoader } from 'react-spinners';
import { Button, Input, Select } from '../atoms';

export type PullRequestInput = {
  selectedTargetBranch: string;
  newBranchName: string;
  pullRequestTitle: string;
  pullRequestMessage: string;
  commitHeadlineMessage: string;
  commitBodyMessage: string;
};

interface IPullRequestModal {
  submittingPullRequest: boolean;
  controlPullRequest: Control<PullRequestInput, any>;
  allowedRepositories?: availableBranchType[];
  handleSubmitPullRequest: UseFormHandleSubmit<PullRequestInput>;
  onPullRequestSubmit: SubmitHandler<PullRequestInput>;
}

export const PullRequestModal: React.FC<IPullRequestModal> = ({
  submittingPullRequest,
  controlPullRequest,
  allowedRepositories,
  handleSubmitPullRequest,
  onPullRequestSubmit,
}) => {
  return (
    <div className="w-full h-full justify-center items-center">
      {submittingPullRequest ? (
        <div className="h-full w-full flex justify-center items-center flex-col gap-[4.2rem]">
          <p className="text-mdtxWhite uppercase text-[1.2rem] font-[700] select-none">
            Creating PR && Refetching repository...
          </p>
          <PulseLoader size={'16px'} color="#FF7200" />
        </div>
      ) : (
        <form
          className="w-[80%] h-full mx-auto flex flex-col justify-center"
          onSubmit={handleSubmitPullRequest(onPullRequestSubmit)}
        >
          <p className="mb-[0.8rem] select-none text-center text-white text-[1.6rem] font-[700] uppercase tracking-wider">
            PULL REQUEST
          </p>
          <p className="select-none text-white text-[1.4rem]">Target branch</p>
          <div>
            {allowedRepositories?.length && (
              <Controller
                defaultValue={allowedRepositories[0].name}
                control={controlPullRequest}
                name="selectedTargetBranch"
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                  <Select
                    placeholder={value}
                    value={value}
                    onChange={onChange}
                    options={allowedRepositories.map((x) => x.name)}
                  />
                )}
              />
            )}
          </div>
          <p className="mt-[1.6rem] select-none text-white text-[1.4rem]">
            New branch name
          </p>
          <Controller
            defaultValue=""
            control={controlPullRequest}
            name="newBranchName"
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <Input
                onChange={onChange}
                value={value}
                placeholder="New branch name"
              />
            )}
          />
          <div className="flex w-full gap-[0.8rem]">
            <div className="flex flex-col">
              <p className="mt-[1.6rem] select-none text-white text-[1.4rem]">
                Pull request title
              </p>
              <Controller
                defaultValue=""
                control={controlPullRequest}
                name="pullRequestTitle"
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                  <Input
                    className="w-full"
                    onChange={onChange}
                    value={value}
                    placeholder="Pull request title"
                  />
                )}
              />
            </div>
            <div className="flex flex-col">
              <p className="mt-[1.6rem] select-none text-white text-[1.4rem]">
                Pull request message
              </p>
              <Controller
                control={controlPullRequest}
                defaultValue=""
                name="pullRequestMessage"
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                  <Input
                    className="w-full"
                    onChange={onChange}
                    value={value}
                    placeholder="Pull request message"
                  />
                )}
              />
            </div>
          </div>
          <div className="flex gap-[0.8rem]">
            <div className="flex flex-col">
              <p className="mt-[1.6rem] select-none text-white text-[1.4rem]">
                Commit head message
              </p>
              <Controller
                control={controlPullRequest}
                defaultValue=""
                name="commitHeadlineMessage"
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                  <Input
                    className="w-full"
                    onChange={onChange}
                    value={value}
                    placeholder="Commit head message"
                  />
                )}
              />
            </div>
            <div className="flex flex-col">
              <p className="mt-[1.6rem] select-none text-white text-[1.4rem]">
                Commit body message
              </p>
              <Controller
                control={controlPullRequest}
                defaultValue=""
                name="commitBodyMessage"
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                  <Input
                    className="w-full"
                    onChange={onChange}
                    value={value}
                    placeholder="Commit body message"
                  />
                )}
              />
            </div>
          </div>
          <div className="self-end w-fit">
            <Button
              customClassName="mt-[1.6rem] px-[3.2rem] py-[0.4rem]"
              type="form"
              text="Wyślij"
              color="orange"
            />
          </div>
        </form>
      )}
    </div>
  );
};
