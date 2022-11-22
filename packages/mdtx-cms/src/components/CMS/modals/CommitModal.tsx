import React from 'react';
import {
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormRegister,
} from 'react-hook-form';
import { Button } from '../atoms';

export type CommitInput = {
  commitHeadlineMessage: string;
  commitBodyMessage: string;
};

interface ICommitModal {
  onCommitSubmit: SubmitHandler<CommitInput>;
  registerCommit: UseFormRegister<CommitInput>;
  handleSubmitCommit: UseFormHandleSubmit<CommitInput>;
}

export const CommitModal: React.FC<ICommitModal> = ({
  onCommitSubmit,
  registerCommit,
  handleSubmitCommit,
}) => {
  return (
    <div className="w-full h-full justify-center items-center">
      <form
        className="w-[80%] h-full mx-auto flex flex-col gap-[1.2rem] justify-center"
        onSubmit={handleSubmitCommit(onCommitSubmit)}
      >
        <p className="mb-[0.8rem] select-none text-center text-white text-[1.6rem] font-[700] uppercase tracking-wider">
          COMMIT
        </p>
        <p className="select-none text-white text-[1.4rem]">
          Commit head message
        </p>
        <input
          {...registerCommit('commitHeadlineMessage', {
            required: true,
          })}
          placeholder="Commit message"
        />
        <p className="mt-[0.8rem] select-none text-white text-[1.4rem]">
          Commit body message
        </p>
        <input
          {...registerCommit('commitBodyMessage', {
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
