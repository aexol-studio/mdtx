import * as React from 'react';

export const CloseIconSvg: React.FC<{
  navVisible: boolean;
}> = ({ navVisible }) => (
  <svg
    className={`${
      navVisible ? 'opacity-1 visible' : 'opacity-0 invisible'
    } transition-all ease-in-out duration-300`}
    viewBox="0 0 24 24"
    width={36}
    height={36}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill="white"
      d="M16.192 6.344L11.949 10.586 7.707 6.344 6.293 7.758 10.535 12 6.293 16.242 7.707 17.656 11.949 13.414 16.192 17.656 17.606 16.242 13.364 12 17.606 7.758z"
    />
  </svg>
);
