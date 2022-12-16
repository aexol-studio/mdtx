import { TextAreaTextApi, TextState } from '@uiw/react-md-editor/lib/commands';
import { utilsType } from '../organisms';

export const Italic = (utils: utilsType) => {
  return {
    name: 'Italic',
    keyCommand: 'Italic',
    buttonProps: { 'aria-label': 'Insert italic' },
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
