export const Chevron: React.FC<{ rotateIcon?: boolean; color?: string }> = ({
  rotateIcon,
  color,
}) => (
  <svg
    width={20}
    height={20}
    fill="none"
    className={`${
      rotateIcon ? 'rotate-90' : ''
    } transition-all duration-200 ease-in-out`}
  >
    <g clipPath="url(#someuniversalid3)">
      <path
        d="m8 15 5-5-5-5"
        stroke={color ? color : 'currentColor'}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="someuniversalid33">
        <path fill={color ? color : 'currentColor'} d="M0 0h20v20H0z" />
      </clipPath>
    </defs>
  </svg>
);
