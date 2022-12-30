import { CloseIconSvg } from '@/src/assets';
import { useOutsideClick } from '@/src/hooks/useOutsideClick';
import { useEffect, useRef } from 'react';

export const Modal: React.FC<{
    children: React.ReactNode;
    closeFnc: () => void;
    blockingState?: boolean;
    customClassName?: string;
}> = ({ children, closeFnc, customClassName, blockingState }) => {
    const ref = useRef<HTMLDivElement>(null);
    const handleUserKeyPress = (event: any) => {
        const { key } = event;
        if (key === 'Escape') !blockingState && closeFnc();
    };
    useEffect(() => {
        window.addEventListener('keydown', handleUserKeyPress);
        return () => window.removeEventListener('keydown', handleUserKeyPress);
    });
    useOutsideClick(ref, () => !blockingState && closeFnc());
    return (
        <div
            className={`justify-center items-center flex w-screen h-screen fixed z-[200] bg-[#0000000D] backdrop-blur-[3px]`}>
            <div
                ref={ref}
                className={`${
                    customClassName ? customClassName : ''
                } relative bg-editor-black1 border-editor-blue2 border-[1px] rounded-[0.8rem]`}>
                <div
                    onClick={() => !blockingState && closeFnc()}
                    className="z-[101] max-w-[2rem] max-h-[2rem] cursor-pointer absolute top-[1.2rem] right-[1.2rem] flex justify-center items-center">
                    <CloseIconSvg />
                </div>
                {children}
            </div>
        </div>
    );
};
