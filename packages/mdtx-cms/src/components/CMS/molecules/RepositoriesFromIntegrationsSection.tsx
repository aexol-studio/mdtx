import { RepositoryFromSearch } from '@/src/containers';
import { RepositoriesList } from './RepositoriesList';

export const RepositoriesFromIntegrationsSection: React.FC<{
    active: boolean;
    handleRepositoryPick: (item: RepositoryFromSearch) => Promise<boolean | undefined>;
    allRepositoriesFromIntegrations?: RepositoryFromSearch[];
}> = ({ active, handleRepositoryPick, allRepositoriesFromIntegrations }) => {
    return (
        <div
            className={`${
                active ? 'translate-x-[0%] duration-[900ms]' : 'translate-x-[-600px] duration-[300ms]'
            } w-full h-full transition-transform ease-in-out left-[5.2rem] absolute flex flex-col z-[1]`}>
            <div className="relative pb-[1.6rem] border-editor-black3 w-full flex-1 overflow-y-scroll overflow-x-hidden scrollbar">
                <div className="flex flex-col gap-[0.4rem] justify-start w-full">
                    {allRepositoriesFromIntegrations && allRepositoriesFromIntegrations.length > 0 && (
                        <RepositoriesList
                            repositories={allRepositoriesFromIntegrations}
                            handleRepositoryPick={handleRepositoryPick}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};
