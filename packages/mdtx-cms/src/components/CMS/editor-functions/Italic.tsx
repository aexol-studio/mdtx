import { TextAreaTextApi, TextState } from '@uiw/react-md-editor/lib/commands';
import { utilsType } from '../organisms';

export const Italic = (utils: utilsType) => {
  return {
    name: 'Italic',
    keyCommand: 'Italic',
    buttonProps: { 'aria-label': 'Insert italic' },
    icon: (
      <svg
        width="24"
        height="25"
        viewBox="0 0 24 25"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M19 4.5H10M14 20.5H5M15 4.5L9 20.5"
          stroke="#E1E5EE"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    execute: (state: TextState, api: TextAreaTextApi) => {
      if (utils) {
        const newSelectionRange = utils.selectWord({
          text: state.text,
          selection: state.selection,
        });
        const state1 = api.setSelectionRange(newSelectionRange);
        const state2 = api.replaceSelection(`*${state1.selectedText}*`);
        api.setSelectionRange({
          start: state2.selection.end - 1 - state1.selectedText.length,
          end: state2.selection.end - 1,
        });
      }
    },
  };
};
