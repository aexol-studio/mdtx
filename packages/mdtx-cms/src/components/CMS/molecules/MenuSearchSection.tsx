import { Input, Select } from '../atoms';
export enum SearchingType {
  ALL = 'ALL',
  ALLALLOWED = 'ALLOWED',
  USER = 'USER',
  // ORGANIZATION = 'ORGANIZATION',
  ORGANIZATIONS = 'ORGANIZATIONS',
}
export interface MenuSearchSectionInterface {
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
        className={`relative duration-300 delay-75 transition-all ease-in-out w-full mb-[0.8rem]`}
      >
        <p className="w-fit text-[1.4rem] leading-[1.8rem] font-[500] text-[#FFF] mb-[0.8rem]">
          Find a repository
        </p>
        <Input
          className="text-[1.4rem] w-full"
          placeholder={`Type to search`}
          value={autoCompleteValue ? autoCompleteValue : ''}
          onChange={(e) => setAutoCompleteValue(e.target.value)}
        />
      </div>

      <div className={`w-full mx-auto mb-[1.2rem]`}>
        <p className="w-fit text-[1.4rem] leading-[1.8rem] font-[500] text-[#FFF] mb-[0.8rem]">
          Search by
        </p>
        <Select
          placeholder={searchingMode}
          options={Object.values(SearchingType)}
          onChange={(e) => setSearchingMode(e as SearchingType)}
        />
      </div>
      <div className="mx-auto w-full">
        <div className="w-fit flex items-center gap-[0.8rem]">
          <input
            checked={includeForks}
            onChange={() => {
              setIncludeForks((prev) => !prev);
            }}
            className="relative rounded-full appearance-none bg-editor-black2 cursor-pointer min-w-[2rem] min-h-[2rem] max-w-[2rem] max-h-[2rem]
            after:checked:bg-editor-blue1 after:content-[''] after:w-[0.8rem] after:h-[0.8rem] after:rounded-full flex justify-center items-center"
            type={'checkbox'}
          />
          <p className="w-fit text-mdtxWhite font-[500] text-[1.4rem] leading-[1.8rem] select-none">
            Include forks
          </p>
        </div>
      </div>
    </>
  );
};
