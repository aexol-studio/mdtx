import { TextAreaTextApi, TextState } from '@uiw/react-md-editor/lib/commands';
import { utilsType } from '../organisms';

export const Through = (utils: utilsType) => {
  return {
    name: 'Through',
    keyCommand: 'Through',
    buttonProps: { 'aria-label': 'Insert Through' },
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 16 17"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15.5 9.50017H0.5C0.223844 9.50017 0 9.27633 0 9.00017V8.00017C0 7.72402 0.223844 7.50017 0.5 7.50017H15.5C15.7762 7.50017 16 7.72402 16 8.00017V9.00017C16 9.27633 15.7762 9.50017 15.5 9.50017ZM8.79169 10.0002C9.6435 10.4045 10.2456 10.8965 10.2456 11.7578C10.2456 12.7924 9.34003 13.4351 7.88241 13.4351C6.87225 13.4351 5.48009 13.0576 5.48009 12.0517V12.0002C5.48009 11.724 5.25622 11.5002 4.98009 11.5002H3.55469C3.27856 11.5002 3.05469 11.724 3.05469 12.0002V12.6003C3.05469 14.6892 5.48334 15.7822 7.88241 15.7822C10.6505 15.7822 12.9453 14.3622 12.9453 11.5814C12.9453 10.9622 12.8322 10.4434 12.6283 10.0002H8.79169ZM7.82444 7.00017C6.81125 6.57814 6.04831 6.09561 6.04831 5.13508C6.04831 4.07508 7.01397 3.65364 8.07837 3.65364C9.41109 3.65364 10.1084 4.17217 10.1084 4.68442V4.75017C10.1084 5.02633 10.3323 5.25017 10.6084 5.25017H12.0338C12.31 5.25017 12.5338 5.02633 12.5338 4.75017V3.80273C12.5338 2.16405 10.2924 1.30664 8.07837 1.30664C5.41578 1.30664 3.36819 2.58702 3.36819 5.23308C3.36819 5.94277 3.51397 6.51983 3.76747 7.00017H7.82444Z"
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
        const state2 = api.replaceSelection(`~~${state1.selectedText}~~`);
        api.setSelectionRange({
          start: state2.selection.end - 2 - state1.selectedText.length,
          end: state2.selection.end - 2,
        });
      }
    },
  };
};
