import { RepositoryFromSearch } from '@/src/containers';
import Image from 'next/image';

export const RepositoriesList: React.FC<{
  repositories: RepositoryFromSearch[];
  handleRepositoryPick: (item: RepositoryFromSearch) => Promise<void>;
}> = ({ repositories, handleRepositoryPick }) => (
  <div>
    {repositories.map((item) => (
      <div
        onClick={() => {
          handleRepositoryPick(item);
        }}
        key={item.full_name}
        className="cursor-pointer pl-[0.8rem] py-[0.8rem] hover:bg-editor-hover0 items-center flex gap-[0.8rem]"
      >
        <div className="relative max-w-[2rem] min-w-[2rem] max-h-[2rem] min-h-[2rem] rounded-full">
          {item.owner && (
            <Image
              loader={({ src }) => src}
              width={48}
              height={48}
              className={
                item.owner.type === 'Organization'
                  ? 'rounded-[0.2rem]'
                  : 'rounded-full'
              }
              alt={item.full_name}
              src={item.owner.avatar_url}
            />
          )}
        </div>
        <p className="text-white text-[1.4rem] leading-[1.8rem] font-[400]">
          {item.full_name}
        </p>
      </div>
    ))}
  </div>
);
