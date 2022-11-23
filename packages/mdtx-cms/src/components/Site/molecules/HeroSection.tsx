import Link from 'next/link';
import React from 'react';
import { HeaderLeft, HeaderRight } from '@/src/assets';

export const HeroSection = () => {
  return (
    <header className="select-none overflow-hidden relative items-center w-full min-h-[62.5rem] flex flex-col pt-[2.4rem] mt-[2.4rem] md:pt-[6.4rem] md:mt-[6.4rem]">
      <div className="w-full h-full absolute top-0 left-0 bg-gradientBlue0 opacity-[0.12] z-[2]" />
      <div className="hidden md:block absolute left-[-3.2rem] top-[9.6rem] z-[1]">
        <HeaderLeft />
      </div>
      <div className="absolute right-[-32.6rem] lg:right-[-9.6rem] top-[16.2rem] md:top-[6.4rem] z-[1]">
        <HeaderRight />
      </div>
      <div className="absolute mt-[12.8rem] max-w-[90%] mx-auto w-full xl:max-w-[1068px] flex flex-col items-center sm:items-start z-[3]">
        <p className="text-mdtxOrange0 text-[1.2rem] leading-[2.4rem] font-[600] uppercase text-center sm:text-left">
          WELCOME TO
        </p>
        <h1 className="mt-[0.8rem] text-mdtxWhite text-[4.8rem] leading-[6.4rem] font-[700] text-center sm:text-left">
          MDTX: Markdown Transformer
        </h1>
        <p className="mt-[1.6rem] max-w-[36.5rem] text-gray3 text-[1.6rem] leading-[2.4rem] font-[400] text-center sm:text-left">
          Use our CMS easily transform your markdown any way you want to.
        </p>
        <Link
          href="/api/githublogin"
          className="hover:no-underline hover:scale-[1.02] scale-[0.98] transition-all duration-1000 mt-[9.6rem] select-none max-w-fit uppercase text-mdtxWhite text-[1.6rem] leading-[1.9rem] font-[600] bg-mdtxOrange1 rounded-[6px] px-[4.8rem] py-[0.8rem]"
        >
          Get started now
        </Link>
      </div>
    </header>
  );
};
