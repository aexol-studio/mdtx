import { Input, Select } from '../atoms';
export enum SearchingType {
  ALL = 'ALL',
  ALLALLOWED = 'ALLALLOWED',
  USER = 'USER',
  // ORGANIZATION = 'ORGANIZATION',
  ORGANIZATIONS = 'ORGANIZATIONS',
}
export interface MenuSearchSectionInterface {
  searching: boolean;
  autoCompleteValue?: string;
  setAutoCompleteValue: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
  includeForks: boolean;
  setIncludeForks: React.Dispatch<React.SetStateAction<boolean>>;
  searchingMode: SearchingType;
  setSearchingMode: React.Dispatch<React.SetStateAction<SearchingType>>;
}

export const MenuSearchSection: React.FC<MenuSearchSectionInterface> = ({
  searching,
  autoCompleteValue,
  setAutoCompleteValue,
  includeForks,
  setIncludeForks,
  searchingMode,
  setSearchingMode,
}) => {
  return (
    <>
      <div
        className={`${
          searching ? 'translate-x-0 ' : 'translate-x-[-200%]'
        } relative duration-300 delay-75 transition-all ease-in-out w-[80%] mx-auto`}
      >
        <div className="absolute top-0 left-0">
          <Input
            className="w-full"
            placeholder={`Type to search`}
            value={autoCompleteValue ? autoCompleteValue : ''}
            onChange={(e) => setAutoCompleteValue(e.target.value)}
          />
        </div>
      </div>
      <div
        className={`${
          !searching ? 'translate-x-0' : 'translate-x-[200%]'
        } duration-300 transition-all ease-in-out w-[80%] mx-auto`}
      >
        <div className="flex items-center gap-[0.8rem]">
          <input
            checked={includeForks}
            className="appearance-none bg-transparent min-w-[1.2rem] min-h-[1.2rem] max-w-[1.2rem] max-h-[1.2rem] checked:bg-mdtxOrange0 border-[2px] border-mdtxOrange0 rounded-full"
            onChange={() => {
              setIncludeForks((prev) => !prev);
            }}
            type={'checkbox'}
          />
          <p className="w-fit text-mdtxWhite uppercase text-[1.2rem] font-[700] select-none tracking-wider">
            Include forks
          </p>
        </div>
        <Select
          placeholder={searchingMode}
          options={Object.values(SearchingType)}
          onChange={(e) => setSearchingMode(e as SearchingType)}
        />
      </div>
    </>
  );
};
