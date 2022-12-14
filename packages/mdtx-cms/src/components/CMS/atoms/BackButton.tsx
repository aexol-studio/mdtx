import { ArrowLeft } from '@/src/assets';

export const BackButton: React.FC<{ state: boolean; onClick: () => void }> = ({
  state,
  onClick,
}) => {
  return (
    <div
      className="self-end cursor-pointer select-none z-[100] flex justify-center items-center  w-[3.2rem] h-[3.2rem] rounded-full bg-mdtxOrange0"
      onClick={onClick}
    >
      <div
        className={`${
          state ? 'rotate-0' : 'rotate-[-180deg]'
        } flex justify-center items-center max-w-[1.6rem] max-h-[1.6rem] transition-all duration-500 ease-in-out`}
      >
        <ArrowLeft />
      </div>
    </div>
  );
};
