import { ICommand } from '@uiw/react-md-editor';
import { commandsType } from '../organisms/Editor';

export const EditorHelp = (commands: commandsType): ICommand => {
  return commands.group([], {
    name: 'EditorHelp',
    buttonProps: {
      'aria-label': 'Get help about editor',
      title: 'Get help about editor',
      style: { marginRight: '0.4rem' },
    },
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7 8.99809C7 7.34107 8.34315 5.99779 10 5.99779C11.6569 5.99779 13 7.34107 13 8.99809C13 10.6551 11.6569 11.9984 10 11.9984V14.9928M9.98903 18H10.0261M6.99024 17.406C4.06358 16.2175 2 13.3474 2 9.99558C2 5.57974 5.58172 2 10 2C14.4183 2 18 5.57974 18 9.99558C18 13.3474 15.9364 16.2175 13.0098 17.406"
          stroke="#E1E5EE"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  });
};
