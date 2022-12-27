import React, { RefObject } from 'react';
import { EditIcon } from '@/src/assets/editor-icons';
interface OptionsMenuTreeI {
    addingHandler: () => void;
    creatingFile: boolean;
    handleCreateFile: (p: boolean) => void;
    refInput: RefObject<HTMLInputElement>;
    fileName?: string;
    handleFileName: (p: string) => void;
}

export const AddNewFileTree: React.FC<OptionsMenuTreeI> = ({
    addingHandler,
    creatingFile,
    handleCreateFile,
    refInput,
    fileName,
    handleFileName,
}) => {
    return (
        <>
            {creatingFile && (
                <div className="flex items-center ml-[1rem] text-editor-purple2 relative">
                    <span className="w-[1.6rem] h-[1.6rem]">
                        <EditIcon />
                    </span>
                    <input
                        type="text"
                        ref={refInput}
                        className="w-[16rem] text-mdtxWhite ml-[0.8rem] my-[0.8rem] pl-[0.8rem] bg-transparent border-editor-purple2 border-[1px] focus:outline-none rounded-[0.8rem] relative"
                        value={fileName ? fileName : ''}
                        onBlur={() => {
                            handleCreateFile(false);
                        }}
                        onKeyDown={e => {
                            if (e.code === 'Enter' || e.code === 'NumpadEnter') {
                                addingHandler();
                            }
                        }}
                        onChange={e => {
                            handleFileName(e.target.value);
                        }}
                    />
                    <div className="min-w-fit ml-[0.4rem]" onClick={addingHandler}>
                        <p className=" text-editor-purple2 text-[1rem] uppercase tracking-wide font-[700]">enter</p>
                    </div>
                </div>
            )}
        </>
    );
};
