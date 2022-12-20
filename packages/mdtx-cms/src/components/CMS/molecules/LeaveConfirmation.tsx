import { Button } from '../atoms';

export const LeaveConfirmation: React.FC<{
  setLeaveWithChanges: React.Dispatch<React.SetStateAction<boolean>>;
  resetContentPath: () => void;
}> = ({ setLeaveWithChanges, resetContentPath }) => {
  return (
    <div className="fixed justify-center items-center w-full h-full z-[3] bg-[#00000099] backdrop-blur-sm">
      <div className="flex h-full w-full items-center justify-around">
        <div className="bg-mdtxWhite rounded-[2.4rem] py-[0.8rem] flex w-[90%] justify-center flex-col items-center">
          <p>You have uncommited changes</p>
          <div className="mt-[1.6rem] flex gap-[1.6rem]">
            <Button
              onClick={() => {
                setLeaveWithChanges(false);
                resetContentPath();
              }}
              text={'Leave'}
            />
            <Button onClick={() => setLeaveWithChanges(false)} text={'Stay'} />
          </div>
        </div>
      </div>
    </div>
  );
};
