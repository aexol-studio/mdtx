import { CloseIconSvg } from '@/src/assets';
import { useOutsideClick } from '@/src/hooks/useOutsideClick';
import { useRef } from 'react';

export const Modal: React.FC<{
  children: React.ReactNode;
  closeFnc: () => void;
  blockingState?: boolean;
  customClassName?: string;
}> = ({ children, closeFnc, customClassName, blockingState }) => {
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick(ref, () => !blockingState && closeFnc());
  return (
    <div
      className={`justify-center items-center flex w-screen h-screen fixed z-[100] bg-[#11111140] backdrop-blur-[2px]`}
    >
      <div
        ref={ref}
        className={`${
          customClassName ? customClassName : ''
        } relative bg-mdtxBlack border-mdtxOrange0 border-[1px] rounded-[0.8rem]`}
      >
        <div
          onClick={() => !blockingState && closeFnc()}
          className="z-[101] max-w-[2.4rem] max-h-[2.4rem] cursor-pointer absolute top-[1.2rem] right-[1.2rem] flex justify-center items-center"
        >
          <CloseIconSvg small navVisible />
        </div>
        {children}
      </div>
    </div>
  );
};
