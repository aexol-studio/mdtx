import React, { PropsWithChildren } from 'react';

export const MenuButton: React.FC<
    PropsWithChildren<{
        badgeValue?: number;
        onClick: () => void;
        menuState: boolean;
        blocked?: boolean;
        withSpacing?: boolean;
    }>
> = ({ children, badgeValue, onClick, menuState, blocked, withSpacing }) => {
    return (
        <div
            onClick={onClick}
            className={`${!blocked ? 'cursor-pointer' : 'cursor-not-allowed opacity-[0.4]'} ${
                withSpacing ? 'mt-[2.4rem]' : ''
            } relative min-w-[2rem] min-h-[2rem] transition-all duration-200 ease-in-out`}>
            <div
                className={`${
                    menuState ? 'h-full' : 'h-0'
                } transition-all duration-500 ease-in-out left-[-0.8rem] absolute h-full rounded-[0.8rem] w-[0.4rem] bg-landing-blue`}
            />
            {children}
            {badgeValue ? (
                <div className="absolute bottom-[-0.8rem] left-[1.2rem] bg-editor-blue1 w-[1.6rem] h-[1.6rem] rounded-full flex justify-center items-center">
                    <p className="text-editor-light1 text-[0.9rem]">{badgeValue}</p>
                </div>
            ) : (
                <></>
            )}
        </div>
    );
};
