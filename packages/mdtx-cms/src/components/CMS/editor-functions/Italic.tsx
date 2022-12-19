import { ICommand } from '@uiw/react-md-editor';
import { commandsType } from '../organisms/Editor';

export const Italic = (commands: commandsType): ICommand => {
  return {
    ...commands.italic,
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16 3H8M12 17H4M12.4998 3L7.49984 17"
          stroke="#E1E5EE"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  };
};
