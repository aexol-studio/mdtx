import { ICommand } from '@uiw/react-md-editor';
import { utilsType } from '../organisms/Editor';

export const Comment = (utils: utilsType): ICommand => {
  return {
    name: 'comment',
    keyCommand: 'comment',
    shortcuts: 'ctrlcmd+/',
    value: '<!-- -->',
    buttonProps: {
      'aria-label': 'Insert comment (ctrl + /)',
      title: 'Insert comment (ctrl + /)',
      style: { padding: 0, margin: '0 1.6rem' },
    },
    execute: (state, api) => {
      const newSelectionRange = utils.selectWord({
        text: state.text,
        selection: state.selection,
      });
      const state1 = api.setSelectionRange(newSelectionRange);
      const state2 = api.replaceSelection(`<!-- ${state1.selectedText} -->`);
      api.setSelectionRange({
        start: state2.selection.end - 4 - state1.selectedText.length,
        end: state2.selection.end - 4,
      });
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
          d="M12.2222 12.6667L14.8889 10L12.2222 7.33333M7.77778 7.33333L5.11111 10L7.77778 12.6667M6.26667 18H13.7333C15.2268 18 15.9735 18 16.544 17.7094C17.0457 17.4537 17.4537 17.0457 17.7094 16.544C18 15.9735 18 15.2268 18 13.7333V6.26667C18 4.77319 18 4.02646 17.7094 3.45603C17.4537 2.95426 17.0457 2.54631 16.544 2.29065C15.9735 2 15.2268 2 13.7333 2H6.26667C4.77319 2 4.02646 2 3.45603 2.29065C2.95426 2.54631 2.54631 2.95426 2.29065 3.45603C2 4.02646 2 4.77319 2 6.26667V13.7333C2 15.2268 2 15.9735 2.29065 16.544C2.54631 17.0457 2.95426 17.4537 3.45603 17.7094C4.02646 18 4.77319 18 6.26667 18Z"
          stroke="#E1E5EE"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  };
};
