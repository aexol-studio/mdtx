import { ICommand } from '@uiw/react-md-editor';
import { commandsType } from '../organisms/Editor';

export const EditorLink = (commands: commandsType): ICommand => {
  return {
    ...commands.link,
    buttonProps: {
      ...commands.link.buttonProps,
      style: { padding: 0, marginRight: '0.8rem' },
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
          d="M6.4 6H6C3.79086 6 2 7.79086 2 10C2 12.2091 3.79086 14 6 14H7.6C9.80914 14 11.6 12.2091 11.6 10M13.6 14H14C16.2091 14 18 12.2091 18 10C18 7.79086 16.2091 6 14 6H12.4C10.1909 6 8.4 7.79086 8.4 10"
          stroke="#E1E5EE"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  };
};
