import { Chevron } from '@/src/assets';
import { availableBranchType } from '@/src/pages/editor';
import React, { useState } from 'react';

interface SelectProps<T> {
  value?: T;
  placeholder: string;
  empty?: string;
  options: Array<T>;
  onChange: (value: T) => void;
}

export const Select: React.FC<SelectProps<string>> = ({
  value,
  options,
  onChange,
  placeholder,
}) => {
  const [open, setOpen] = useState(false);
  const currentValue = options.find((o) => o === value);
  return (
    <div
      className="select-none w-full h-full text-[1.4rem] cursor-pointer relative z-[1] bg-mdtxWhite border-[1px] border-mdtxOrange0"
      onMouseLeave={() => {
        setTimeout(() => {
          setOpen(false);
        }, 500);
      }}
      onClick={() => setOpen(!open)}
    >
      <div
        className={`${
          open ? 'translate-y-[-50%] scale-y-[-1]' : 'translate-y-[-50%]'
        } absolute right-[0.8rem] top-[50%] transition-all duration-300 ease-in-out`}
      >
        <Chevron />
      </div>
      {currentValue ? (
        <div
          className={`${
            open
              ? 'rounded-bl-[0rem] rounded-br-[0rem]'
              : 'rounded-bl-[0.5rem] rounded-br-[0.5rem]'
          } py-[0.4rem] px-[0.4rem] rounded-tl-[0.5rem] rounded-tr-[0.5rem] text-mdtxBlack`}
        >
          {currentValue}
        </div>
      ) : (
        <div
          className={`${
            open
              ? 'rounded-bl-[0rem] rounded-br-[0rem]'
              : 'rounded-bl-[0.5rem] rounded-br-[0.5rem]'
          } py-[0.4rem] px-[1.2rem] rounded-tl-[0.5rem] rounded-tr-[0.5rem]`}
        >
          {placeholder}
        </div>
      )}
      {open && (
        <div className="absolute z-[101] w-[100%] bg-mdtxWhite border-[1px] max-h-[30rem] overflow-y-auto rounded-b-[0.8rem] top-[2.8rem]">
          {options.map((o, idx) => (
            <div
              className={`${idx !== 0 && 'border-t-[1px]'} ${
                o === currentValue ? 'bg-mdtxOrange0' : 'bg-mdtxWhite'
              } py-[0.4rem] px-[1.2rem] transition-all duration-[250] hover:bg-mdtxOrange0`}
              key={o}
              onClick={() => {
                setOpen(false);
                onChange(o);
              }}
            >
              {o}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
