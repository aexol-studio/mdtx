import { useAuthState } from '@/src/containers';
import { MenuType } from '@/src/pages/editor';
import { useMDTXBackend } from '@/src/utils/useMDTXBackend';
import Link from 'next/link';
import { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Button, Input } from '../atoms';

const MDTXonGitHub = `https://github.com/login/oauth/authorize?scope=repo%20read:user%20write:org%20read:org&client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}&state=SETTINGSGITHUB&redirect_uri=${process.env.NEXT_PUBLIC_REDIRECT_URI}`;

type GitLabIntegrationType = {
    service: string;
    token: string;
    url: string;
    name: string;
};

export const SettingsSection: React.FC<{ active: boolean; handleMenuType: (p?: MenuType) => void }> = ({
    active,
    handleMenuType,
}) => {
    const { integrations, setIntegrations, handleSearchInService } = useAuthState();
    const [gitLabIntegration, setGitLabIntegration] = useState(false);
    const { createConnection, getConnections, deleteConnection } = useMDTXBackend();

    const {
        control,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm<GitLabIntegrationType>();

    const onGitLabIntegration: SubmitHandler<GitLabIntegrationType> = async data => {
        const response = await createConnection({
            service: 'gitlab',
            token: data.token,
            url: data.url,
            name: data.name,
        });
        if (!response) {
            return;
        } else {
            const conns = await getConnections();
            if (conns) {
                setIntegrations(conns);
                handleSearchInService(conns[0]);
                setGitLabIntegration(false);
                handleMenuType(MenuType.SEARCH);
            }
        }
    };

    return (
        <div
            className={`${
                active ? 'translate-x-[0%] duration-[900ms]' : 'translate-x-[-600px] duration-[300ms]'
            } w-full h-full transition-transform ease-in-out left-[5.2rem] absolute flex flex-col z-[1]`}>
            {!integrations?.find(o => o.service === 'github') ? (
                <Link href={MDTXonGitHub} className="text-editor-light2">
                    Integrate with github
                </Link>
            ) : (
                <div
                    onClick={async () => {
                        const thisIntegration = integrations?.find(o => o.service === 'github');
                        const response = await deleteConnection(thisIntegration?._id!);
                        if (response) {
                            const conns = await getConnections();
                            if (conns) {
                                setIntegrations(conns);
                                handleSearchInService(conns[0]);
                                handleMenuType(MenuType.SEARCH);
                            }
                        }
                    }}>
                    <p className="text-editor-light2">Integrated with github</p>
                </div>
            )}

            <div
                onClick={() => {
                    setGitLabIntegration(true);
                }}>
                <p className="text-editor-light2">Integrate with gitlab</p>
            </div>

            {integrations
                ?.filter(o => o.service === 'gitlab')
                .map(obj => (
                    <div
                        onClick={async () => {
                            const response = await deleteConnection(obj?._id!);
                            if (response) {
                                const conns = await getConnections();
                                setIntegrations(conns);
                            }
                        }}>
                        <p className="text-editor-light2">Integrated with gitlab as {obj.name}</p>
                    </div>
                ))}
            {gitLabIntegration && (
                <div>
                    <form className="flex flex-col max-w-[80%]" onSubmit={handleSubmit(onGitLabIntegration)}>
                        <Controller
                            defaultValue=""
                            control={control}
                            name="name"
                            rules={{ required: true }}
                            render={({ field: { onChange, value } }) => (
                                <Input type="text" value={value} onChange={onChange} placeholder="Name to display" />
                            )}
                        />
                        <Controller
                            defaultValue=""
                            control={control}
                            name="url"
                            rules={{ required: true }}
                            render={({ field: { onChange, value } }) => (
                                <Input
                                    type="text"
                                    value={value}
                                    onChange={onChange}
                                    placeholder="URL to GitLab instance"
                                />
                            )}
                        />
                        <Controller
                            defaultValue=""
                            control={control}
                            name="token"
                            rules={{ required: true }}
                            render={({ field: { onChange, value } }) => (
                                <Input type="text" value={value} onChange={onChange} placeholder="Access Token" />
                            )}
                        />
                        <div className="w-fit">
                            <Button customClassName="mt-[0.8rem]" type="form" text="Send" />
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};
