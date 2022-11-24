import { Input } from '../atoms';

export enum Mode {
  ORGANIZATIONS = 'ORGANIZATIONS',
  SEARCHING = 'SEARCHING',
}

export interface MenuSearchSectionInterface {
  autoCompleteValue?: string;
  setAutoCompleteValue: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
}

export const MenuSearchSection: React.FC<MenuSearchSectionInterface> = ({
  autoCompleteValue,
  setAutoCompleteValue,
}) => {
  return (
    <div className={`w-[80%] mx-auto`}>
      <Input
        className="w-full"
        placeholder={`Type to search`}
        value={autoCompleteValue ? autoCompleteValue : ''}
        onChange={(e) => setAutoCompleteValue(e.target.value)}
      />
    </div>
  );
};
