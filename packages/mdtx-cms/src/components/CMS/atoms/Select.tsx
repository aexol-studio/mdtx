import { Chevron } from '@/src/assets';
import { useState } from 'react';

interface SelectProps<T> {
    value?: T;
    placeholder: string;
    additionalClass?: string;
    empty?: string;
    options: Array<T>;
    onChange: (value: T) => void;
}

export const Select: React.FC<SelectProps<string>> = ({ value, options, onChange, placeholder, additionalClass }) => {
    const [open, setOpen] = useState(false);
    const currentValue = options.find(o => o === value);
    return (
        <div
            className={`${
                open ? 'rounded-t-[0.8rem]' : 'rounded-[0.8rem]'
            } bg-editor-black2 text-editor-purple2 select-none w-full h-full text-[1.4rem] cursor-pointer relative z-[99]`}
            onMouseLeave={() => {
                setTimeout(() => {
                    setOpen(false);
                }, 500);
            }}
            onClick={() => setOpen(!open)}>
            <div
                className={`${
                    open ? 'translate-y-[-50%] rotate-[90deg]' : 'translate-y-[-50%] rotate-[180deg]'
                } absolute right-[0.8rem] top-[50%] transition-all duration-300 ease-in-out`}>
                <Chevron color="#9A99AD" />
            </div>
            {currentValue ? (
                <div
                    className={`${
                        open ? 'rounded-bl-[0rem] rounded-br-[0rem]' : 'rounded-bl-[0.5rem] rounded-br-[0.5rem]'
                    } py-[0.4rem] px-[0.4rem] rounded-tl-[0.5rem] rounded-tr-[0.5rem] `}>
                    <p className="w-fit pl-[0.8rem] text-[1.2rem]">{currentValue}</p>
                </div>
            ) : (
                <div
                    className={`${
                        open ? 'rounded-bl-[0rem] rounded-br-[0rem]' : 'rounded-bl-[0.5rem] rounded-br-[0.5rem]'
                    } py-[0.4rem] px-[1.2rem] rounded-tl-[0.5rem] rounded-tr-[0.5rem]`}>
                    <p className="w-fit pl-[0.8rem] text-[1.2rem]">{placeholder}</p>
                </div>
            )}
            {open && (
                <div
                    className={`${
                        additionalClass ? additionalClass : 'max-h-[30rem]'
                    } absolute z-[101] w-[100%] overflow-y-auto rounded-b-[0.8rem] top-[2.6rem]`}>
                    {options.map((o, idx) => (
                        <div
                            className={`${idx !== 0 && ''} ${
                                o === currentValue
                                    ? 'after:bg-editor-hover0 after:absolute after:w-full after:h-full after:content-[""] after:top-0 after:left-0'
                                    : ''
                            } overflow-hidden bg-editor-black2 py-[0.4rem] pl-[1.2rem] transition-all duration-[250] group hover:bg-editor-purple1 relative`}
                            key={o}
                            onClick={() => {
                                setOpen(false);
                                onChange(o);
                            }}>
                            <p
                                className={`${
                                    o === currentValue ? 'text-editor-light1' : ''
                                } w-fit text-[1.2rem] group-hover:text-editor-light1`}>
                                {o}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
