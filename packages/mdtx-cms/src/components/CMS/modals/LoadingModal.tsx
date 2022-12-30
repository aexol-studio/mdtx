import React from 'react';
import { PulseLoader } from 'react-spinners';

export const LoadingModal: React.FC = () => {
    return (
        <div className="fixed w-screen h-screen top-0 left-0 flex justify-center items-center z-[200] bg-[#11111140] backdrop-blur-[8px]">
            <div className="bg-editor-black1 w-[40rem] h-[25rem] rounded-[0.8rem] border-editor-purple1 border-[2px] flex flex-col justify-center items-center gap-[3.2rem]">
                <p className="text-[1.4rem] leading-[1.8rem] text-editor-light2 select-none">
                    Fetching required data...
                </p>
                <PulseLoader size={16} color="#005EEE" />
            </div>
        </div>
    );
};
