import React, { forwardRef, InputHTMLAttributes } from 'react';

export const Input = forwardRef(
    (props: InputHTMLAttributes<HTMLInputElement>, ref: React.ForwardedRef<HTMLInputElement>) => {
        return (
            <input
                {...props}
                ref={ref}
                className={`${
                    props.className ? props.className : ''
                } outline-none bg-editor-black2 rounded-[0.8rem] py-[0.4rem] pl-[0.8rem] text-editor-purple2`}
            />
        );
    },
);
