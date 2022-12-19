import React, { RefObject } from 'react';
import { ThrashIcon } from '@/src/assets';

interface DeleteFileTreeI {
  deletingHandler: () => void;
  refContextMenu: RefObject<HTMLDivElement>;
}

export const DeleteFileTree: React.FC<DeleteFileTreeI> = ({
  refContextMenu,
  deletingHandler,
}) => {
  return (
    <div
      ref={refContextMenu}
      className="z-[102] w-[12rem] py-[1rem] items-center top-[3.4rem] bg-editor-black2 border-editor-purple2 border-[1px] absolute flex flex-col rounded-[0.8rem]"
    >
      <div
        onClick={deletingHandler}
        className="group flex gap-[0.4rem] items-center cursor-pointer w-fit "
      >
        <div className="min-w-[2rem] min-h-[2rem] text-editor-purple2">
          <ThrashIcon />
        </div>
        <p className="group-hover:underline w-fit uppercase text-[1rem] leading-[1.8rem] font-[700] select-none tracking-wider text-mdtxWhite group-hover:text-editor-purple2">
          Delete file
        </p>
      </div>
    </div>
  );
};
