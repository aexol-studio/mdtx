import { Chevron } from '@/src/assets';
import { availableBranchType } from '@/src/containers';
import { useOutsideClick } from '@/src/hooks/useOutsideClick';
import React, { useRef, useState } from 'react';

interface SelectProps<T> {
  value?: T;
  placeholder: string;
  empty?: string;
  options: Array<T>;
  onChange: (value: T) => void;
  open: boolean;
  handleOpen: (p: boolean) => void;
}

export const SelectBranch: React.FC<SelectProps<availableBranchType>> = ({
  value,
  options,
  onChange,
  placeholder,
  open,
  handleOpen,
}) => {
  const currentValue = options.find((o) => o === value);
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick(ref, () => handleOpen(false));
  return (
    <div
      ref={ref}
      className={`${
        open
          ? 'rounded-bl-[0rem] rounded-br-[0rem]'
          : 'rounded-bl-[0.8rem] rounded-br-[0.8rem]'
      } select-none flex justify-center items-center w-full h-full text-[1.4rem] cursor-pointer relative z-[1] bg-editor-black2 rounded-[0.8rem]`}
      onClick={() => handleOpen(!open)}
    >
      <div className="w-full relative flex items-center justify-between py-[0.8rem]">
        <div
          className={`${
            open
              ? 'rounded-bl-[0rem] rounded-br-[0rem]'
              : 'rounded-bl-[0.8rem] rounded-br-[0.8rem]'
          } pl-[1.2rem] rounded-tl-[0.8rem] rounded-tr-[0.8rem]`}
        >
          <p className="text-editor-purple2 text-[1.6rem] font-[400] leading-[1.8rem]">
            {currentValue?.name ? currentValue.name : placeholder}
          </p>
        </div>

        <span
          className={`${
            open ? 'rotate-[-90deg]' : 'rotate-[90deg]'
          } mr-[0.8rem] text-editor-purple2 transition-all duration-500 ease-in-out`}
        >
          <Chevron />
        </span>
        {open && (
          <div
            className={`max-h-[12rem] transition-all duration-300 delay-75 ease-in-out absolute left-0 top-[100%] w-full overflow-hidden rounded-b-[0.8rem]`}
          >
            <div
              className={`scrollbar-branch h-full z-[110] w-full bg-editor-black2 overflow-y-auto rounded-b-[0.8rem]`}
            >
              {options.map((o, idx) => (
                <div
                  className={`${
                    o.name === currentValue?.name
                      ? 'bg-editor-hover1'
                      : 'bg-editor-black2'
                  } py-[0.8rem] px-[0.8rem] transition-all duration-300 hover:bg-editor-hover1`}
                  key={o.name}
                  onClick={() => {
                    handleOpen(false);
                    onChange(o);
                  }}
                >
                  <p className="text-editor-light1 text-[1.6rem] font-[400] leading-[1.8rem]">
                    {o.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
