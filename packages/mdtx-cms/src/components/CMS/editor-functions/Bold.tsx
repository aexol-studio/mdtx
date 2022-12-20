import { ICommand } from '@uiw/react-md-editor';
import { commandsType } from '../organisms/Editor';

export const Bold = (commands: commandsType): ICommand => {
  return {
    ...commands.bold,
    buttonProps: {
      ...commands.bold.buttonProps,
      style: { padding: 0, margin: '0 1.6rem' },
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
          d="M5 10H11.1538C12.8532 10 14.2308 8.433 14.2308 6.5C14.2308 4.567 12.8532 3 11.1538 3H5V10ZM5 10H11.9231C13.6224 10 15 11.567 15 13.5C15 15.433 13.6224 17 11.9231 17H5V10Z"
          stroke="#E1E5EE"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  };
};
