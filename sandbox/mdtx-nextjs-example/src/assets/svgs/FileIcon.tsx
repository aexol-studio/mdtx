import * as React from 'react';
import { SVGProps } from 'react';

export const FileIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={24}
    height={24}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M6 0h8.25v1.5H6A1.5 1.5 0 0 0 4.5 3v18A1.5 1.5 0 0 0 6 22.5h12a1.5 1.5 0 0 0 1.5-1.5V6.75H21V21a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V3a3 3 0 0 1 3-3Z"
      fill="#FFF"
    />
    <path
      d="M14.25 4.5V0L21 6.75h-4.5a2.25 2.25 0 0 1-2.25-2.25ZM16.415 9h-8.83L7.5 12h.75c.27-1.644.534-1.788 2.541-1.852l.44-.015v7.634c0 .706-.15.873-1.348.983v.75h4.232v-.75c-1.204-.11-1.354-.276-1.354-.981v-7.636l.447.015c2.006.064 2.27.21 2.54 1.852h.75l-.085-3h.002Z"
      fill="#FFF"
    />
  </svg>
);
