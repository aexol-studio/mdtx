import { ICommand } from '@uiw/react-md-editor';
import { UnorderedListCommand, OrderedListCommand, CheckedListCommand } from '.';
import { commandsType } from '../organisms/Editor';

export const Lists = (commands: commandsType): ICommand => {
    return commands.group(
        [UnorderedListCommand(commands), OrderedListCommand(commands), CheckedListCommand(commands)],
        {
            name: 'lists',
            groupName: 'lists',
            liProps: { id: 'lists' },
            buttonProps: {
                'aria-label': 'Open lists types',
                title: 'Open lists types',
                style: { margin: '0 1.6rem' },
            },
            icon: (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M18 10L7.33333 10M18 4.85714L7.33333 4.85714M18 15.1429L7.33333 15.1429M3.77778 10C3.77778 10.4734 3.37981 10.8571 2.88889 10.8571C2.39797 10.8571 2 10.4734 2 10C2 9.52661 2.39797 9.14286 2.88889 9.14286C3.37981 9.14286 3.77778 9.52661 3.77778 10ZM3.77778 4.85714C3.77778 5.33053 3.37981 5.71429 2.88889 5.71429C2.39797 5.71429 2 5.33053 2 4.85714C2 4.38376 2.39797 4 2.88889 4C3.37981 4 3.77778 4.38376 3.77778 4.85714ZM3.77778 15.1429C3.77778 15.6162 3.37981 16 2.88889 16C2.39797 16 2 15.6162 2 15.1429C2 14.6695 2.39797 14.2857 2.88889 14.2857C3.37981 14.2857 3.77778 14.6695 3.77778 15.1429Z"
                        stroke="#E1E5EE"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            ),
        },
    );
};
