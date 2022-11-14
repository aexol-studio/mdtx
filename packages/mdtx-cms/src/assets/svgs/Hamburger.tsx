import * as React from 'react';

export const Hamburger: React.FC<{
  navVisible: boolean;
}> = ({ navVisible }) => (
  <svg
    className={`${
      navVisible ? 'opacity-0 invisible' : 'opacity-1 visible'
    } transition-all ease-in-out duration-300 absolute`}
    viewBox="0 0 24 24"
    width={36}
    height={36}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path fill="white" d="M4 6H20V8H4zM4 11H20V13H4zM4 16H20V18H4z" />
  </svg>
);
