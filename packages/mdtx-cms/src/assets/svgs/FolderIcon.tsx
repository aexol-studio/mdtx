import * as React from 'react';
import { SVGProps } from 'react';

export const FolderIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={24}
    height={24}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M14.742 6a4.5 4.5 0 0 1-3.18-1.319L10.317 3.44A1.5 1.5 0 0 0 9.259 3H3.75a1.5 1.5 0 0 0-1.5 1.471L2.319 6h-1.5L.75 4.5a3 3 0 0 1 3-3h5.508a3 3 0 0 1 2.121.879l1.242 1.242a3 3 0 0 0 2.121.879V6Z"
      fill="#FFF"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M20.715 6H3.285A1.5 1.5 0 0 0 1.79 7.635l.956 10.5A1.5 1.5 0 0 0 4.238 19.5h15.523a1.5 1.5 0 0 0 1.492-1.365l.956-10.5A1.5 1.5 0 0 0 20.715 6ZM3.285 4.5A3 3 0 0 0 .295 7.771l.956 10.5A3 3 0 0 0 4.238 21h15.523a3 3 0 0 0 2.986-2.729l.956-10.5A3 3 0 0 0 20.715 4.5H3.285Z"
      fill="#FFF"
    />
  </svg>
);
