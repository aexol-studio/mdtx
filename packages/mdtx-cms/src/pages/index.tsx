import React from 'react';
import { Layout } from '@/src/layouts';
import { HeroSection } from '@/src/components/Site';
import { Button, Input, Modal } from '../components';
import { useAuthState } from '../containers';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { LoginType } from '../mdtx-backend-zeus/selectors';
import { useMDTXBackend } from '../utils/useMDTXBackend';
import { useRouter } from 'next/router';

const index = () => {
    const { indexModal, handleModal, setToken, token, setIntegrations, handleSearchInService } = useAuthState();
    const { login, register, getConnections } = useMDTXBackend();
    const router = useRouter();
    const {
        control: controlLogin,
        handleSubmit: handleSubmitLogin,
        // watch: watchLogin,
        reset: resetLoginForm,
        // formState: { errors: errorsLogin },
    } = useForm<LoginType>();

    const {
        control: controlRegister,
        handleSubmit: handleSubmitRegister,
        // watch: watchRegister,
        reset: resetRegisterForm,
        // formState: { errors: errorsRegister },
    } = useForm<LoginType>();

    const onLogin: SubmitHandler<LoginType> = async data => {
        resetLoginForm();
        const response = await login(data);
        if (!response) {
            return;
        } else {
            const conns = await getConnections(response);
            setToken(response);
            setIntegrations(conns);
            if (conns) handleSearchInService(conns[0]);
            router.push('/editor');
        }
    };

    const onRegister: SubmitHandler<LoginType> = async data => {
        const response = await register(data);
        resetRegisterForm();
        if (!response) {
            return;
        } else {
            handleModal('login');
        }
    };

    return (
        <Layout pageTitle="MDtx - editor to fast edit your markdowns!">
            {indexModal !== undefined && (
                <Modal closeFnc={() => handleModal(undefined)}>
                    <div className="px-[6.4rem] py-[4.2rem]">
                        {indexModal === 'login' && (
                            <>
                                <form
                                    onSubmit={handleSubmitLogin(onLogin)}
                                    className="flex flex-col items-center gap-[0.8rem]">
                                    <Controller
                                        defaultValue=""
                                        control={controlLogin}
                                        name="username"
                                        rules={{ required: true }}
                                        render={({ field: { onChange, value } }) => (
                                            <Input
                                                autoComplete="email"
                                                type="email"
                                                value={value}
                                                onChange={onChange}
                                                placeholder="Login"
                                            />
                                        )}
                                    />
                                    <Controller
                                        defaultValue=""
                                        control={controlLogin}
                                        name="password"
                                        rules={{ required: true }}
                                        render={({ field: { onChange, value } }) => (
                                            <Input
                                                autoComplete="current-password"
                                                type="password"
                                                value={value}
                                                onChange={onChange}
                                                placeholder="Password"
                                            />
                                        )}
                                    />
                                    <div className="w-fit">
                                        <Button customClassName="mt-[0.8rem]" type="form" text="Send" />
                                    </div>
                                </form>
                                <div className="w-fit">
                                    <Button
                                        text={'Register'}
                                        customClassName="mt-[0.8rem]"
                                        onClick={() => {
                                            handleModal('register');
                                        }}
                                    />
                                </div>
                            </>
                        )}
                        {indexModal === 'register' && (
                            <>
                                <form
                                    onSubmit={handleSubmitRegister(onRegister)}
                                    className="flex flex-col items-center gap-[0.8rem]">
                                    <Controller
                                        defaultValue=""
                                        control={controlRegister}
                                        name="username"
                                        rules={{ required: true }}
                                        render={({ field: { onChange, value } }) => (
                                            <Input
                                                autoComplete="email"
                                                value={value}
                                                onChange={onChange}
                                                placeholder="Login"
                                            />
                                        )}
                                    />
                                    <Controller
                                        defaultValue=""
                                        control={controlRegister}
                                        name="password"
                                        rules={{ required: true }}
                                        render={({ field: { onChange, value } }) => (
                                            <Input
                                                autoComplete="new-password"
                                                type="password"
                                                value={value}
                                                onChange={onChange}
                                                placeholder="Password"
                                            />
                                        )}
                                    />
                                    <div className="w-fit">
                                        <Button customClassName="mt-[0.8rem]" type="form" text="Send" />
                                    </div>
                                </form>
                                <div className="w-fit">
                                    <Button
                                        text={'Login'}
                                        customClassName="mt-[0.8rem]"
                                        onClick={() => {
                                            handleModal('login');
                                        }}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </Modal>
            )}
            <main className="w-full flex flex-col justify-center items-center">
                <HeroSection />
            </main>
        </Layout>
    );
};

export default index;
