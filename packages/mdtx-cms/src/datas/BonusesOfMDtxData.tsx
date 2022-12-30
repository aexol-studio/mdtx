import { EasyToUse, GitHubConnection, NextJSPlugin } from '@/src/assets';
import { IBonusesOfMDtx } from '@/src/components/Site';

export const BonusesOfMDtxContent: IBonusesOfMDtx = {
    smallTitle: 'Features',
    bigTitle: 'Fast and easy',
    sectionDescription: 'All your Markdown content always at hand',
    content: [
        {
            typeOfBubbles: 'one',
            description: 'Use diff view and versioning to track, sort and highlight changes',
            svg: <EasyToUse />,
            title: 'Easy to use',
        },
        {
            typeOfBubbles: 'two',
            description:
                'Log in with GitHub to edit markdown files, then commit them and do pull requests to branches.',
            svg: <GitHubConnection />,
            title: 'GitHub connection',
        },
        {
            typeOfBubbles: 'three',
            description: 'Speed up your work by using mdtx on NextJS',
            svg: <NextJSPlugin />,
            title: 'NextJS Plugin',
        },
    ],
};
