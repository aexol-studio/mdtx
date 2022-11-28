import { availableBranchType } from '@/src/pages/editor';
import {
  Control,
  Controller,
  SubmitHandler,
  UseFormHandleSubmit,
} from 'react-hook-form';
import { PulseLoader } from 'react-spinners';
import { Button, Input } from '../atoms';

export type CommitInput = {
  commitHeadlineMessage: string;
  commitBodyMessage: string;
};

interface ICommitModal {
  selectedBranch?: availableBranchType;
  submittingCommit: boolean;
  controlCommit: Control<CommitInput, any>;
  onCommitSubmit: SubmitHandler<CommitInput>;
  handleSubmitCommit: UseFormHandleSubmit<CommitInput>;
}

export const CommitModal: React.FC<ICommitModal> = ({
  controlCommit,
  submittingCommit,
  onCommitSubmit,
  handleSubmitCommit,
  selectedBranch,
}) => (
  <div className="w-full h-full justify-center items-center">
    {submittingCommit ? (
      <div className="h-full w-full flex justify-center items-center flex-col gap-[4.2rem]">
        <p className="text-mdtxWhite uppercase text-[1.2rem] font-[700] select-none">
          Creating commit && Refetching repository...
        </p>
        <PulseLoader size={'16px'} color="#FF7200" />
      </div>
    ) : (
      <form
        className="w-[80%] h-full mx-auto flex flex-col gap-[1.2rem] justify-center"
        onSubmit={handleSubmitCommit(onCommitSubmit)}
      >
        <p className="select-none text-center text-white text-[1.6rem] font-[700] uppercase tracking-wider">
          COMMIT
        </p>
        <p className="select-none text-white text-[1.2rem] font-[700] uppercase tracking-wider">
          {`Commiting to ${selectedBranch?.name}`}
        </p>
        <p className="select-none text-white text-[1.4rem]">
          Commit head message
        </p>
        <Controller
          defaultValue=""
          control={controlCommit}
          name="commitHeadlineMessage"
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <Input
              value={value}
              onChange={onChange}
              placeholder="Commit head message"
            />
          )}
        />

        <p className="mt-[0.8rem] select-none text-white text-[1.4rem]">
          Commit body message
        </p>
        <Controller
          defaultValue=""
          control={controlCommit}
          name="commitBodyMessage"
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <Input
              value={value}
              onChange={onChange}
              placeholder="Commit body message"
            />
          )}
        />
        <div className="self-end w-fit">
          <Button
            customClassName="mt-[0.8rem] px-[3.2rem] py-[0.4rem]"
            type="form"
            text="Send"
            color="orange"
          />
        </div>
      </form>
    )}
  </div>
);
