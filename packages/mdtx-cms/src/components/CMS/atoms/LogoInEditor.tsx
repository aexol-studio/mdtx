export const LogoInEditor: React.FC<{
  state: boolean;
  onClick: () => void;
}> = ({ state, onClick }) => {
  return (
    <div
      className="cursor-pointer select-none z-[100] flex items-center gap-[0.8rem]"
      onClick={onClick}
    >
      <svg
        width="34"
        height="34"
        viewBox="0 0 34 34"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2.00977 9.53674e-07L13.0645 13L14.0695 12L12.0595 2L2.00977 9.53674e-07Z"
          fill="#005EEE"
        />
        <path
          d="M2.00977 34L13.0645 21L14.0695 22L12.0595 32L2.00977 34Z"
          fill="#005EEE"
        />
        <path
          d="M10.0498 17L15.0747 12L20.0996 17L15.0747 22L10.0498 17Z"
          fill="#005EEE"
        />
        <path
          d="M5.02441 17L9.04431 13H12.0592L8.03934 17L12.0592 21H9.04431L5.02441 17Z"
          fill="#005EEE"
        />
        <path
          d="M0 17L4.0199 13H7.03483L3.01493 17L7.03483 21H4.0199L0 17Z"
          fill="#005EEE"
        />
        <path
          d="M32.1602 9.53674e-07L21.1054 13L20.1005 12L22.1104 2L32.1602 9.53674e-07Z"
          fill="white"
        />
        <path
          d="M32.1602 34L21.1054 21L20.1005 22L22.1104 32L32.1602 34Z"
          fill="white"
        />
        <path
          d="M24.1201 17L19.0952 12L14.0704 17L19.0952 22L24.1201 17Z"
          fill="white"
        />
        <path
          d="M29.1445 17L25.1246 13H22.1097L26.1296 17L22.1097 21H25.1246L29.1445 17Z"
          fill="white"
        />
        <path
          d="M34.1699 17L30.15 13H27.1351L31.155 17L27.1351 21H30.15L34.1699 17Z"
          fill="white"
        />
      </svg>

      <p
        className={`${
          state ? 'opacity-1' : 'opacity-0'
        } transition-opacity duration-300 delay-75 ease-in-out font-ivymode font-[700] text-[1.4rem] leading-[1.8rem] text-editor-light1`}
      >
        MDTX
      </p>
    </div>
  );
};
