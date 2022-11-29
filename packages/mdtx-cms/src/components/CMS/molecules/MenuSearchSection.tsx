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
      <div className={`w-[80%] mx-auto`}>
        <p className="w-fit mt-[1.2rem] mb-[0.8rem] text-mdtxWhite uppercase text-[1rem] font-[700] select-none tracking-wide">
          Search by
        </p>
        <Select
          customClassName="bg-transparent text-mdtxWhite mb-[0.8rem]"
          placeholder={searchingMode}
          options={Object.values(SearchingType)}
          onChange={(e) => setSearchingMode(e as SearchingType)}
        />
      </div>
      <div
        className={`relative duration-300 delay-75 transition-all ease-in-out w-[80%] mx-auto mb-[0.8rem]`}
      >
        <p className="w-fit mt-[1.2rem] mb-[0.8rem] text-mdtxWhite uppercase text-[1rem] font-[700] select-none tracking-wide">
          Find repository
        </p>
        <Input
          className="text-[1.4rem] w-full"
          placeholder={`Type to search`}
          value={autoCompleteValue ? autoCompleteValue : ''}
          onChange={(e) => setAutoCompleteValue(e.target.value)}
        />
      </div>

      <div className="mx-auto w-[80%]">
        <div
          onClick={() => {
            setIncludeForks((prev) => !prev);
          }}
          className="w-fit cursor-pointer flex items-center gap-[0.8rem]"
        >
          <input
            checked={includeForks}
            className="cursor-pointer min-w-[1.2rem] min-h-[1.2rem] max-w-[1.2rem] max-h-[1.2rem]"
            type={'checkbox'}
          />
          <p className="w-fit text-mdtxWhite text-[1.2rem] font-[500] leading-[2.4rem] select-none">
            Include forks
          </p>
        </div>
      </div>
    </>
  );
};
