import React from 'react';
import {
  UseFormRegister,
  UseFormHandleSubmit,
  FieldErrorsImpl,
  SubmitHandler,
} from 'react-hook-form';

export type PullRequestInput = {
  selectedTargetBranch: string;
  pullRequestMessage: string;
  pullRequestTitle: string;
  commitMessage: string;
  newBranchName: string;
};

export const PullRequestForm: React.FC<{
  markdownEdit?: string;
  markdownBase?: string;
  registerPullRequest: UseFormRegister<PullRequestInput>;
  handleSubmitPullRequest: UseFormHandleSubmit<PullRequestInput>;
  errorsPullRequest: Partial<FieldErrorsImpl<PullRequestInput>>;
  onPullRequestSubmit: SubmitHandler<PullRequestInput>;
}> = ({
  markdownBase,
  markdownEdit,
  registerPullRequest,
  handleSubmitPullRequest,
  errorsPullRequest,
  onPullRequestSubmit,
}) => {
  return (
    <>
      {/* {selectedRepository?.refs?.nodes &&
      selectedRepository?.refs?.nodes?.length > 0 ? (
        <form
          className="flex flex-col"
          onSubmit={handleSubmitPullRequest(onPullRequestSubmit)}
        >
          <p className="text-white italic font-bold">Pull request</p>
          <select
            {...registerPullRequest('selectedTargetBranch', { required: true })}
          >
            {selectedRepository.refs?.nodes?.map((branch) => {
              return (
                <option key={branch.name} value={branch.name}>
                  {branch.name}
                </option>
              );
            })}
          </select>
          <input
            {...registerPullRequest('newBranchName', { required: true })}
            placeholder="New branch name"
          />
          <input
            {...registerPullRequest('pullRequestTitle', { required: true })}
            placeholder="Pull request title"
          />
          <input
            {...registerPullRequest('pullRequestMessage', { required: true })}
            placeholder="Pull request message"
          />
          <input
            {...registerPullRequest('commitMessage', { required: true })}
            placeholder="Commit message"
          />
          {markdownBase !== markdownEdit ? (
            <input className="text-white" type="submit" />
          ) : (
            <div>
              <p className="text-white">There are no changes</p>
            </div>
          )}
        </form>
      ) : (
        <div>
          <p className="text-white">We need branch to make pull request to</p>
        </div>
      )} */}
    </>
  );
};
