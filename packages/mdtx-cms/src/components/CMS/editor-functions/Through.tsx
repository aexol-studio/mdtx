import { ICommand } from '@uiw/react-md-editor';
import { commandsType } from '../organisms/Editor';

export const Through = (commands: commandsType): ICommand => {
    return {
        ...commands.strikethrough,
        buttonProps: {
            ...commands.strikethrough.buttonProps,
            style: { padding: 0, margin: '0 1.6rem' },
        },
        icon: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M4.66667 13.5C4.66667 15.433 6.25854 17 8.22222 17H11.7778C13.7415 17 15.3333 15.433 15.3333 13.5C15.3333 11.567 13.7415 10 11.7778 10M15.3333 6.5C15.3333 4.567 13.7415 3 11.7778 3H8.22222C6.25854 3 4.66667 4.567 4.66667 6.5M2 10H18"
                    stroke="#E1E5EE"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        ),
    };
};
