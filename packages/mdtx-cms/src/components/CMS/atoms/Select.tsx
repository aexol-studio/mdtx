import { Chevron } from '@/src/assets';
import { useState } from 'react';

interface SelectProps<T> {
  value?: T;
  placeholder: string;
  empty?: string;
  options: Array<T>;
  onChange: (value: T) => void;
  customClassName?: string;
}

export const Select: React.FC<SelectProps<string>> = ({
  value,
  options,
  onChange,
  placeholder,
  customClassName,
}) => {
  const [open, setOpen] = useState(false);
  const currentValue = options.find((o) => o === value);
  return (
    <div
      className={`${
        customClassName ? customClassName : 'bg-mdtxWhite'
      } select-none w-full h-full text-[1.4rem] cursor-pointer relative z-[1] border-[1px] border-mdtxOrange1`}
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
        <Chevron colorFill="#FFFFFF" />
      </div>
      {currentValue ? (
        <div
          className={`${
            open
              ? 'rounded-bl-[0rem] rounded-br-[0rem]'
              : 'rounded-bl-[0.5rem] rounded-br-[0.5rem]'
          } py-[0.4rem] px-[0.4rem] rounded-tl-[0.5rem] rounded-tr-[0.5rem] ${
            customClassName ? customClassName : 'text-mdtxBlack'
          }`}
        >
          <p className="w-fit text-[1.2rem]"> {currentValue}</p>
        </div>
      ) : (
        <div
          className={`${
            open
              ? 'rounded-bl-[0rem] rounded-br-[0rem]'
              : 'rounded-bl-[0.5rem] rounded-br-[0.5rem]'
          } py-[0.4rem] px-[1.2rem] rounded-tl-[0.5rem] rounded-tr-[0.5rem]`}
        >
          <p className="w-fit text-[1.2rem]"> {placeholder}</p>
        </div>
      )}
      {open && (
        <div
          className={`absolute z-[101] w-[100%] ${
            customClassName ? 'border-mdtxOrange1' : 'border-mdtxWhite'
          } border-[1px] max-h-[30rem] overflow-y-auto rounded-b-[0.8rem] top-[2.6rem]`}
        >
          {options.map((o, idx) => (
            <div
              className={`${idx !== 0 && 'border-t-[1px]'} ${
                o === currentValue
                  ? 'bg-mdtxOrange0'
                  : customClassName
                  ? 'bg-mdtxBlack border-mdtxBlack'
                  : 'bg-mdtxWhite'
              } py-[0.4rem] px-[1.2rem] transition-all duration-[250] hover:bg-mdtxOrange0`}
              key={o}
              onClick={() => {
                setOpen(false);
                onChange(o);
              }}
            >
              <p className="w-fit text-[1.2rem]">{o}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
