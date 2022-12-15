import Link from 'next/link';
import { useEffect, useState } from 'react';
import { GithubIcon, MDtxLogo } from '@/src/assets';
import { NavigationData } from '@/src/datas/NavigationData';
import { GithubStars, MobileNavbar } from '@/src/components/Site/atoms/';

const getRepositoryMDtx = async () => {
  const response = await fetch(
    'https://api.github.com/repos/aexol-studio/mdtx',
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  const responseParse = await response.json();
  return responseParse;
};

const LoginLink = `https://github.com/login/oauth/authorize?scope=repo%20read:user%20write:org%20read:org&client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_REDIRECT_URI}`;

export const NavigationBar = () => {
  const [stars, setStars] = useState<number>();
  const [hideNavbar, setHideNavbar] = useState(false);

  useEffect(() => {
    if (!stars)
      getRepositoryMDtx().then((response) => {
        const { stargazers_count } = response;
        setStars(stargazers_count);
      });
  }, []);

  useEffect(() => {
    const scrollHandler = () => {
      const thisWindow: typeof window & {
        oldScroll?: number;
        scrollY?: number;
      } = window;
      if (thisWindow.innerWidth < 768) return;
      const scrolledTop =
        thisWindow.scrollY < 128 ||
        (thisWindow.oldScroll || 0) > thisWindow.scrollY;
      scrolledTop ? setHideNavbar(false) : setHideNavbar(true);
      thisWindow.oldScroll = thisWindow.scrollY;
    };
    document.addEventListener('scroll', scrollHandler);
    return () => {
      document.removeEventListener('scroll', scrollHandler);
    };
  }, []);

  return (
    <nav
      className={`
        z-[99] top-0 max-w-[1024px] w-full left-[50%] translate-x-[-50%] flex justify-center items-center h-[6.4rem] bg-landing-background fixed transition-all duration-300'
        ${hideNavbar ? 'opacity-0' : 'opacity-1'}
      `}
    >
      <div className="mx-auto w-full xl:max-w-[976px] flex justify-between items-center relative">
        <div className="w-full h-full absolute right-[0]">
          <MobileNavbar />
        </div>
        <div className="z-[99] min-w-[8.4rem] min-h-[3.4rem] flex items-center justify-center">
          <Link aria-label="MDtx" href={'/'}>
            <MDtxLogo />
          </Link>
        </div>
        <div className="z-[99] mr-[4.8rem] md:mr-0 flex items-center justify-center">
          <Link
            className="z-[99] hover:no-underline"
            href={'https://github.com/aexol-studio/mdtx/stargazers'}
          >
            <GithubStars stars={stars} />
          </Link>
          <div className="hidden md:flex items-center">
            <Link
              className="w-fit flex items-center gap-[0.4rem] select-none ml-[1.2rem] [font-[400] text-[1.6rem] leading-[2.4rem] text-landing-gray0"
              href={LoginLink}
            >
              Login with GitHub
              <div>
                <GithubIcon />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
