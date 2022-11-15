import React from 'react';
import {
  FieldErrorsImpl,
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormRegister,
} from 'react-hook-form';

export type CommitInput = {
  commitMessage: string;
};

export const CommitForm: React.FC<{
  markdownEdit?: string;
  markdownBase?: string;
  registerCommit: UseFormRegister<CommitInput>;
  handleSubmitCommit: UseFormHandleSubmit<CommitInput>;
  errorsCommit: Partial<FieldErrorsImpl<CommitInput>>;
  onCommitSubmit: SubmitHandler<CommitInput>;
}> = ({
  registerCommit,
  handleSubmitCommit,
  onCommitSubmit,
  markdownBase,
  markdownEdit,
}) => {
  return (
    <form
      className="flex flex-col"
      onSubmit={handleSubmitCommit(onCommitSubmit)}
    >
      <p className="text-white italic font-bold">Commit</p>
      <input
        {...registerCommit('commitMessage', {
          required: true,
        })}
        placeholder="Commit message"
      />
      {markdownBase !== markdownEdit ? (
        <input className="text-white" type="submit" />
      ) : (
        <div>
          <p className="text-white">There are no changes to commit</p>
        </div>
      )}
    </form>
  );
};
