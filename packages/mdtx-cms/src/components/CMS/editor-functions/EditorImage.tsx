import { ImageIcon } from '@/src/assets';
import { ICommand } from '@uiw/react-md-editor';
import { commandsType } from '../organisms/Editor';

export const EditorImage = (commands: commandsType): ICommand => {
    return {
        ...commands.image,
        buttonProps: {
            ...commands.image.buttonProps,
            style: { padding: 0, margin: '0 1.6rem' },
        },
        icon: <ImageIcon />,
    };
};
