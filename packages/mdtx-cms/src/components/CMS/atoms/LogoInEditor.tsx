import { ArrowLeft } from '@/src/assets';

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
        className="min-w-[3.4rem] min-h-[3.4rem]"
        width="34"
        height="34"
        viewBox="0 0 34 34"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2 9.53674e-07L13 13L14 12L12 2L2 9.53674e-07Z"
          fill="#0056DF"
        />
        <path d="M2 34L13 21L14 22L12 32L2 34Z" fill="#0056DF" />
        <path d="M10 17L15 12L20 17L15 22L10 17Z" fill="#0056DF" />
        <path d="M5 17L9 13H12L8 17L12 21H9L5 17Z" fill="#0056DF" />
        <path d="M0 17L4 13H7L3 17L7 21H4L0 17Z" fill="#0056DF" />
        <path
          d="M32 9.53674e-07L21 13L20 12L22 2L32 9.53674e-07Z"
          fill="#F4FD3A"
        />
        <path d="M32 34L21 21L20 22L22 32L32 34Z" fill="#F4FD3A" />
        <path d="M24 17L19 12L14 17L19 22L24 17Z" fill="#F4FD3A" />
        <path d="M29 17L25 13H22L26 17L22 21H25L29 17Z" fill="#F4FD3A" />
        <path d="M34 17L30 13H27L31 17L27 21H30L34 17Z" fill="#F4FD3A" />
      </svg>
      {state && (
        <p className="font-ivymode font-[700] text-[1.4rem] leading-[1.8rem] text-editor-light1">
          MDTX
        </p>
      )}
    </div>
  );
};
