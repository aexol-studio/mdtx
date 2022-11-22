import { Chevron } from '@/src/assets';
import { useOutsideClick } from '@/src/hooks/useOutsideClick';
import { availableBranchType } from '@/src/pages/editor';
import React, { useRef, useState } from 'react';

interface SelectProps<T> {
  value?: T;
  placeholder: string;
  empty?: string;
  options: Array<T>;
  onChange: (value: T) => void;
}

export const SelectBranch: React.FC<SelectProps<availableBranchType>> = ({
  value,
  options,
  onChange,
  placeholder,
}) => {
  const [open, setOpen] = useState(false);
  const currentValue = options.find((o) => o === value);
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick(ref, () => setOpen(false));
  return (
    <div
      ref={ref}
      className="select-none flex justify-center items-center w-full h-full text-[1.4rem] cursor-pointer relative z-[1] bg-mdtxWhite border-[1px] border-mdtxOrange0"
      onClick={() => setOpen(!open)}
    >
      <div className="w-full relative flex items-center justify-between py-[0.4rem]">
        <div
          className={`${
            open
              ? 'rounded-bl-[0rem] rounded-br-[0rem]'
              : 'rounded-bl-[0.5rem] rounded-br-[0.5rem]'
          } ml-[1.2rem] rounded-tl-[0.5rem] rounded-tr-[0.5rem] text-mdtxBlack`}
        >
          {currentValue?.name ? currentValue.name : placeholder}
        </div>

        <div
          className={`${
            open ? 'scale-y-[-1]' : 'scale-y-[1]'
          } mr-[0.8rem] transition-all duration-300 ease-in-out`}
        >
          <Chevron />
        </div>

        <div
          className={`${
            open ? 'opacity-1 visible' : 'opacity-0 invisible'
          } transition-all duration-300 delay-75 ease-in-out left-[-1px] top-[calc(100%-1px)] absolute z-[101] w-[calc(100%+2px)] bg-mdtxWhite border-[1px] border-mdtxOrange0 max-h-[30rem] overflow-y-auto rounded-b-[0.8rem]`}
        >
          {options.map((o, idx) => (
            <div
              className={`${idx !== 0 && 'border-t-[1px]'} ${
                o.name === currentValue?.name
                  ? 'bg-mdtxOrange0'
                  : 'bg-mdtxWhite'
              } py-[0.4rem] px-[1.2rem] transition-all duration-[250] hover:bg-mdtxOrange0`}
              key={o.name}
              onClick={() => {
                setOpen(false);
                onChange(o);
              }}
            >
              {o.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
