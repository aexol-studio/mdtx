import { ICommand } from '@uiw/react-md-editor';
import { commandsType } from '../organisms/Editor';

export const EditPreview = (commands: commandsType): ICommand => {
    return {
        ...commands.codeEdit,
        buttonProps: {
            ...commands.codeEdit.buttonProps,
            style: { padding: '0.4rem', margin: '0 1.2rem' },
        },
        icon: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M12.6667 2V18M6.26667 2H13.7333C15.2268 2 15.9735 2 16.544 2.29065C17.0457 2.54631 17.4537 2.95426 17.7094 3.45603C18 4.02646 18 4.77319 18 6.26667V13.7333C18 15.2268 18 15.9735 17.7094 16.544C17.4537 17.0457 17.0457 17.4537 16.544 17.7094C15.9735 18 15.2268 18 13.7333 18H6.26667C4.77319 18 4.02646 18 3.45603 17.7094C2.95426 17.4537 2.54631 17.0457 2.29065 16.544C2 15.9735 2 15.2268 2 13.7333V6.26667C2 4.77319 2 4.02646 2.29065 3.45603C2.54631 2.95426 2.95426 2.54631 3.45603 2.29065C4.02646 2 4.77319 2 6.26667 2Z"
                    stroke="#E1E5EE"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        ),
    };
};
