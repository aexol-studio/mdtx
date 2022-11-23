import React, { ForwardedRef, forwardRef } from 'react';
interface IInputField {
  value: string;
  onChange: (...event: any[]) => void;
  placeholder?: string;
  className?: string;
}

export const Input = forwardRef(
  ({ onChange, value, className, placeholder }: IInputField, ref) => {
    return (
      <input
        onChange={onChange}
        placeholder={placeholder}
        value={value}
        className={`${
          className ? className : ''
        } outline-none border-mdtxOrange1 border-[1px] bg-mdtxBlack py-[0.4rem] pl-[0.8rem] text-mdtxWhite`}
      />
    );
  },
);
