import { ArrowLeft } from '@/src/assets';

export const BackButton: React.FC<{ state: boolean; onClick: () => void }> = ({
  state,
  onClick,
}) => {
  return (
    <div
      className="cursor-pointer select-none z-[99] flex justify-center items-center absolute bottom-[1.6rem] right-[-1.6rem] w-[3.2rem] h-[3.2rem] rounded-full bg-mdtxOrange0"
      onClick={onClick}
    >
      <div
        className={`${
          state ? 'rotate-0' : 'ml-[0.8rem] rotate-[-180deg]'
        } flex justify-center items-center max-w-[1.6rem] max-h-[1.6rem] transition-all duration-500 ease-in-out`}
      >
        <ArrowLeft />
      </div>
    </div>
  );
};
