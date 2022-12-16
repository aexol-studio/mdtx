import Link from 'next/link';
import { AexolAsSvg } from '@/src/assets';

export const Footer = () => (
  <footer className="overflow-hidden relative w-full h-[9.2rem] flex justify-center items-center">
    <div className="left-[50%] translate-x-[-50%] absolute h-full w-full mx-auto bg-landing-blue z-[4] mix-blend-color-burn opacity-[0.1]"></div>
    <div className="left-[50%] translate-x-[-50%] absolute h-full w-[1200px] mx-auto bg-landing-blue z-[4] mix-blend-color-burn opacity-[0.1]"></div>
    <div className="left-[50%] translate-x-[-50%] absolute h-full w-[1112px] mx-auto bg-landing-blue z-[4] mix-blend-color-burn opacity-[0.1]"></div>
    <div className="left-[50%] translate-x-[-50%] absolute h-full max-w-[1024px] w-full mx-auto bg-landing-blue z-[5]">
      <div className="font-lato h-full max-w-[90%] mx-auto w-full xl:max-w-[976px] flex items-center">
        <p className="select-none font-[400] text-[1.4rem] leading-[2rem] text-landing-gray-text">
          Supported by
        </p>
        <Link
          href={'https://aexol.com/'}
          className="ml-[0.6rem] mr-[0.8rem] w-[5.8rem] h-[5.8rem]"
        >
          <AexolAsSvg />
        </Link>
        <p className="select-none font-[400] text-[1.4rem] leading-[2rem] text-landing-gray-text">
          Innovative Software Development studio © 2022
        </p>
      </div>
    </div>
  </footer>
);
