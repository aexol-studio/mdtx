import * as React from 'react';
import { SVGProps } from 'react';

export const ArrowLeft = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={24}
    height={24}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M22.5 12a.75.75 0 0 0-.75-.75H4.06l4.72-4.719A.751.751 0 0 0 7.72 5.47l-6 6a.75.75 0 0 0 0 1.062l6 6A.752.752 0 0 0 9 18.001a.751.751 0 0 0-.22-.532L4.06 12.75H21.75a.75.75 0 0 0 .75-.75Z"
      fill="#FFF"
    />
  </svg>
);
