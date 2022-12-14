import { TextAreaTextApi, TextState } from '@uiw/react-md-editor/lib/commands';
import { utilsType } from '../organisms';

export const Quotes = (utils: utilsType) => {
  return {
    name: 'Quotes',
    keyCommand: 'Quotes',
    buttonProps: { 'aria-label': 'Insert quotes' },
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 16 17"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16 3.44629V7.44629C16 11.7281 14.0655 13.9478 10.0012 15.0368C9.52546 15.1643 9.05834 14.8044 9.05834 14.3119V13.2527C9.05834 12.9384 9.25296 12.6548 9.54856 12.548C11.611 11.803 12.75 11.2605 12.75 8.94629H10.5C9.67156 8.94629 9 8.27473 9 7.44629V3.44629C9 2.61785 9.67156 1.94629 10.5 1.94629H14.5C15.3284 1.94629 16 2.61785 16 3.44629ZM5.5 1.94629H1.5C0.671562 1.94629 0 2.61785 0 3.44629V7.44629C0 8.27473 0.671562 8.94629 1.5 8.94629H3.75C3.75 11.2605 2.61096 11.803 0.548558 12.548C0.252964 12.6548 0.0583389 12.9384 0.0583389 13.2527V14.3119C0.0583389 14.8044 0.525464 15.1643 1.00125 15.0368C5.06546 13.9478 7 11.7281 7 7.44629V3.44629C7 2.61785 6.32844 1.94629 5.5 1.94629Z"
          fill="#E1E5EE"
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
        const breaksBeforeCount = utils.getBreaksNeededForEmptyLineBefore(
          state1.text,
          state1.selection.start,
        );
        const breaksBefore = Array(breaksBeforeCount + 1).join('\n');
        const breaksAfterCount = utils.getBreaksNeededForEmptyLineAfter(
          state1.text,
          state1.selection.end,
        );
        const breaksAfter = Array(breaksAfterCount + 1).join('\n');
        api.replaceSelection(
          `${breaksBefore}> ${state1.selectedText}${breaksAfter}`,
        );
        const selectionStart = state1.selection.start + breaksBeforeCount + 2;
        const selectionEnd = selectionStart + state1.selectedText.length;
        api.setSelectionRange({
          start: selectionStart,
          end: selectionEnd,
        });
      }
    },
  };
};
