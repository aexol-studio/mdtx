import { RepositoryFromSearch, useAuthState } from '@/src/containers';
import { useGitState } from '@/src/containers/GitContainer';
import { ConnectionType } from '@/src/mdtx-backend-zeus/selectors';

export const FavoritesSection: React.FC<{
    active: boolean;
    handleRepositoryPick: (item: RepositoryFromSearch, connection?: ConnectionType) => Promise<boolean | undefined>;
}> = ({ active, handleRepositoryPick }) => {
    const { integrations, handleSearchInService } = useAuthState();
    const { getRepository } = useGitState();
    const favRepositories = integrations?.map(o => o.repositiories).filter(el => el !== null);
    return (
        <div
            className={`${
                active ? 'translate-x-[0%] duration-[900ms]' : 'translate-x-[-600px] duration-[300ms]'
            } w-full h-full transition-transform ease-in-out left-[5.2rem] absolute flex flex-col z-[1]`}>
            <p className="text-editor-light2">Your favorites repositories</p>
            {favRepositories?.map(x =>
                x?.map(o => {
                    return (
                        <p
                            className="text-editor-light2 text-clip max-w-[30rem]"
                            onClick={async () => {
                                const repository = await getRepository(
                                    { owner: o.uri.split('/')[0], repo: o.uri.split('/')[1] },
                                    { ...o.connection },
                                );
                                handleSearchInService(o.connection);
                                if (repository) {
                                    handleRepositoryPick(repository, o.connection);
                                }
                            }}>
                            {o.uri} - {o.connection.service}
                        </p>
                    );
                }),
            )}
        </div>
    );
};
