import { ConnectionType } from '@/src/mdtx-backend-zeus/selectors';
import { useState } from 'react';
import { createContainer } from 'unstated-next';

export type RepositoryFromSearch = {
    name: string;
    full_name: string;
    default_branch: string;
    id: number;
    node_id: string;
    fork: boolean;
    private: boolean;
    owner: {
        avatar_url: string;
        login: string;
        type: string;
    } | null;
    permissions?: {
        admin: boolean;
        maintain?: boolean;
        push?: boolean;
        triage?: boolean;
        pull?: boolean;
        gitlabPermission?: boolean;
    };
};

export type RepositoryFromSearchWithIntegration = RepositoryFromSearch & ConnectionType;

export type availableBranchType = {
    commit: {
        sha: string;
        url: string;
    };
    name: string;
    protected?: boolean;
};

const RepositoryContainer = createContainer(() => {
    const [selectedRepository, setSelectedRepository] = useState<RepositoryFromSearch>();
    const handleRepository = (p?: RepositoryFromSearch) => setSelectedRepository(p);
    const [selectedBranch, setSelectedBranch] = useState<availableBranchType>();
    const handleBranch = (p?: availableBranchType) => setSelectedBranch(p);
    return {
        selectedRepository,
        handleRepository,
        selectedBranch,
        handleBranch,
    };
});

export const RepositoryStateProvider = RepositoryContainer.Provider;
export const useRepositoryState = RepositoryContainer.useContainer;
