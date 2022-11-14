import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import {
  GithubStar,
  Hamburger,
  CloseIconSvg,
  GithubIcon,
  AexolAsSvg,
} from '@/src/assets';
import { NavigationData } from '@/src/datas/NavigationData';
import { GithubStars } from './GithubStars';

export const MobileNavbar: React.FC<{ stars?: number }> = ({ stars }) => {
  const [navVisible, setNavVisible] = useState(false);
  useEffect(() => {
    document.body.style.overflowY = navVisible ? 'hidden' : 'scroll';
    return () => {
      document.body.style.overflowY = 'scroll';
    };
  }, [navVisible]);
  return (
    <div className="flex items-center flex-row-reverse w-full h-full md:hidden relative">
      <div
        onClick={() => {
          setNavVisible((prev) => !prev);
        }}
        className="select-none z-[99] relative w-fit cursor-pointer"
      >
        <Hamburger navVisible={navVisible} />
        <CloseIconSvg navVisible={navVisible} />
      </div>

      <div
        className={`${
          navVisible ? 'translate-x-[0%]' : 'translate-x-[100%]'
        } transition-all ease-in-out duration-500 h-screen w-[100%] bg-mdtxBlack fixed top-0 left-0 flex`}
      >
        <div className="relative mt-[12.4rem]">
          <div className="flex gap-[2.4rem] flex-col ">
            {NavigationData.links.map((data) => (
              <Link
                key={data.link}
                className="w-fit select-none ml-[4.2rem] font-[400] text-[2.4rem] leading-[3.2rem] text-mdtxWhite"
                href={data.href}
              >
                {data.link}
              </Link>
            ))}
            <Link
              className="w-fit flex items-center gap-[1.6rem] select-none ml-[4.2rem] font-[400] text-[2.4rem] leading-[2.4rem] text-mdtxWhite"
              href={'/api/githublogin'}
            >
              Sign in with GitHub
              <div className="mb-[0.6rem]">
                <GithubIcon />
              </div>
            </Link>
          </div>
        </div>
        <div className="bottom-[12vh] right-[2.4rem] absolute">
          <Link href={'https://aexol.com/'}>
            <p className="select-none font-[500] text-[1.2rem] leading-[2.4rem] text-mediumGray">
              powered by
            </p>
            <div className="mt-[0.8rem]">
              <AexolAsSvg />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
