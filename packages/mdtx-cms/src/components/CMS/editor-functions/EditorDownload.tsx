import { ICommand } from '@uiw/react-md-editor';

export const EditorDownload = (
  handleDownload: (text: string) => void,
): ICommand => {
  return {
    name: 'downloadfile',
    keyCommand: 'downloadfile',
    shortcuts: 'ctrlcmd+shift+d',
    buttonProps: {
      'aria-label': 'Download md file (ctrl + shift + d)',
      title: 'Download md file (ctrl + shift + d)',
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
          d="M16.1765 10.4V5.84C16.1765 4.49587 16.1765 3.82381 15.9072 3.31042C15.6703 2.85883 15.2924 2.49168 14.8275 2.26158C14.299 2 13.6072 2 12.2235 2H6.95294C5.56928 2 4.87745 2 4.34896 2.26158C3.88409 2.49168 3.50614 2.85883 3.26928 3.31042C3 3.82381 3 4.49587 3 5.84V14.16C3 15.5041 3 16.1762 3.26928 16.6896C3.50614 17.1412 3.88409 17.5083 4.34896 17.7384C4.87745 18 5.56924 18 6.95282 18H10M12.0588 15.6L14.5294 18M14.5294 18L17 15.6M14.5294 18V13.2"
          stroke="#E1E5EE"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    execute: (state) => handleDownload(state.text),
  };
};
