import React, { RefObject } from 'react';
import { AddFileIcon } from '@/src/assets';

interface FolderOptionsTree {
  modalRef: RefObject<HTMLDivElement>;
  handleCreateFile: (p: boolean) => void;
  handleCreatingModal: (p: boolean) => void;
}

export const FolderOptionsTree: React.FC<FolderOptionsTree> = ({
  modalRef,
  handleCreateFile,
  handleCreatingModal,
}) => {
  return (
    <div
      ref={modalRef}
      className="z-[100] flex flex-col px-[1.6rem] py-[1rem] rounded-[0.8rem] justify-center bg-editor-black2 top-[3.2rem] right-[0] absolute border-editor-purple2 border-[1px]"
    >
      <div
        onClick={() => {
          handleCreateFile(true);
          handleCreatingModal(false);
        }}
        className="flex cursor-pointer group gap-[0.8rem] justify-end"
      >
        <div>
          <AddFileIcon />
        </div>
        <p className="group-hover:underline cursor-pointer w-fit uppercase text-[1rem] leading-[1.8rem] font-[700] select-none tracking-wider text-editor-light1 group-hover:text-editor-purple2">
          Add new MD file
        </p>
      </div>
    </div>
  );
};
