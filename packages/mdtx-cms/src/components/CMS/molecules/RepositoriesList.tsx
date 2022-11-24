import { RepositoryFromSearch } from '@/src/pages/editor';
import Image from 'next/image';

export const RepositoriesList: React.FC<{
  repositories: RepositoryFromSearch[];
  handleRepositoryPick: (item: RepositoryFromSearch) => Promise<void>;
}> = ({ repositories, handleRepositoryPick }) => (
  <div>
    {repositories.map((item) => (
      <div
        key={item.full_name}
        className="items-start mt-[1.2rem] flex gap-[0.8rem]"
      >
        <div className="relative max-w-[1.6rem] min-w-[1.6rem] max-h-[1.6rem] min-h-[1.6rem]">
          <Image
            width={32}
            height={32}
            alt={item.full_name}
            src={item.owner.avatar_url}
          />
        </div>
        <p
          onClick={() => {
            handleRepositoryPick(item);
          }}
          className="text-white text-[1.4rem] leading-[1.6rem] hover:underline cursor-pointer"
        >
          {item.full_name}
        </p>
      </div>
    ))}
  </div>
);
