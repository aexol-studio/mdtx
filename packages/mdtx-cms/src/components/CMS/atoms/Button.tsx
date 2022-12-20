import Link from 'next/link';
import { useState } from 'react';
interface ButtonInterface {
  type?: 'form' | 'link';
  href?: string;
  text: string;
  customClassName?: string;
  withAnimation?: boolean;
  onClick?: () => void;
}

export const Button: React.FC<ButtonInterface> = ({
  type,
  href,
  text,
  withAnimation,
  onClick,
}) => {
  if (type && type === 'link' && !href)
    throw new Error('Add href tag if you want to use Link');
  return (
    <div
      onClick={() => onClick && onClick()}
      className={`${
        withAnimation ? 'transition-all duration-300 ease-in-out' : ''
      } after:absolute after:content-[''] after:top-0 after:left-0 after:rounded-[0.8rem] after:bg-editor-purple1 after:w-0 hover:after:w-full after:h-full 
      relative z-[102] cursor-pointer flex justify-center items-center rounded-[0.8rem] overflow-hidden w-fit bg-editor-blue2 after:transition-all after:duration-500 after:ease-in-out`}
    >
      {type ? (
        type === 'form' ? (
          <input
            className="z-[103] px-[6.4rem] py-[0.8rem] appearance-none cursor-pointer hover:no-underline text-[1.4rem] text-editor-black3 font-[400] leading-[1.8rem]"
            type="submit"
            value={text}
          />
        ) : (
          type === 'link' && (
            <Link
              className="z-[103] px-[6.4rem] py-[0.8rem] hover:no-underline text-[1.4rem] text-editor-black3 font-[400] leading-[1.8rem]"
              href={href!}
            >
              {text}
            </Link>
          )
        )
      ) : (
        <button className="z-[103] px-[6.4rem] py-[0.8rem] appearance-none hover:no-underline text-[1.4rem] text-editor-black3 font-[400] leading-[1.8rem]">
          {text}
        </button>
      )}
    </div>
  );
};
