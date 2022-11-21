import { RepositoryFromSearch } from '@/src/pages/editor';
import React from 'react';

export const RepositoriesList: React.FC<{
  repositories: RepositoryFromSearch[];
  handleRepositoryPick: (item: RepositoryFromSearch) => Promise<void>;
}> = ({ repositories, handleRepositoryPick }) => {
  return (
    <div>
      {repositories.map((item) => (
        <div
          onClick={() => {
            handleRepositoryPick(item);
          }}
          key={item.full_name}
        >
          <p className="text-white">{item.full_name}</p>
        </div>
      ))}
    </div>
  );
};
