import React, { useEffect, useState } from 'react';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import dynamic from 'next/dynamic';
import { AuthConatiner } from '../../containers/AuthContainer';
import Image from 'next/image';
import { useBackend } from '../../backend/useBackend';
import { Layout } from '../layouts';
import { RepositoriesType } from '../../backend/selectors/repositories.selector';
import Link from 'next/link';
import { RepositoryType } from '../../backend/selectors/repository.selector';
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });
const HomePage = () => {
  const [markdown, setMarkdown] = useState<string | undefined>('Pick Markdown');
  let {
    setToken,
    token,
    isLoggedIn,
    setIsLoggedIn,
    setLoggedData,
    loggedData,
    logOut,
  } = AuthConatiner.useContainer();
  const [choosedRepo, setChoosedRepo] = useState('');
  const [choosedFolder, setChoosedFolder] = useState('');
  const [repositories, setRepositories] = useState<RepositoriesType>();
  const [repoContent, setRepoContent] = useState<RepositoryType>();
  const {
    getUserInfo,
    getUserRepositories,
    getUserRepository,
    getFolderContentFromRepository,
    getFileContentFromRepository,
  } = useBackend();
  useEffect(() => {
    const url = window.location.href;
    const hasCode = url.includes('?code=');
    if (hasCode) {
      const newUrl = url.split('?code=');
      const requestData = {
        code: newUrl[1],
      };
      const proxy_url = process.env.NEXT_PUBLIC_PROXY || '';
      fetch(proxy_url, {
        method: 'POST',
        body: JSON.stringify(requestData),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            setToken(data);
            setIsLoggedIn(true);
          } else {
            setIsLoggedIn(false);
            window.location.href = '/';
          }
        })
        .catch((error) => {});
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn && !loggedData) {
      getUserInfo().then((res) => setLoggedData(res));
      getUserRepositories({ first: 10 }).then((res) => setRepositories(res));
    }
  }, [isLoggedIn]);

  return (
    <Layout>
      {!token && !isLoggedIn ? (
        <div className="bg-[#13131C] w-full h-full flex flex-col justify-center items-center">
          <div className="flex flex-col justify-center items-center bg-white px-[1.2rem] py-[1.6rem] rounded-[2.4rem]">
            <h1 className="text-[1.8rem] text-center text-black">
              Welcome to <span className="text-blue-200">MDtx</span> editor!
            </h1>
            <div className="w-[32rem] h-[32rem]">
              <Image
                src={
                  'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png'
                }
                width="560"
                height="560"
                alt="GitHub Logo"
              />
            </div>
            <Link
              className="bg-[#13131C] text-white px-[1.2rem] py-[0.8rem] rounded-[2.4rem]"
              href={`https://github.com/login/oauth/authorize?scope=user&client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_REDIRECT_URI}`}
            >
              Login with GitHub
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="select-none w-[20vw] h-screen bg-[#13131C] border-r-[2px] border-r-solid border-r-white flex flex-col items-center px-[3.2rem] pt-[2.4rem]">
            <div
              onClick={() => {
                logOut();
              }}
            >
              <p className="hover:underline cursor-pointer">Logout</p>
            </div>
            <div>
              <div className="flex flex-col">
                <h1 className="text-[1.8rem] text-center text-white">
                  Welcome to <span className="text-blue-200">MDtx</span> editor!
                </h1>
                {loggedData?.avatarUrl && (
                  <div className="my-[0.8rem] relative w-[6.4rem] h-[6.4rem] rounded-full self-center">
                    <Image
                      priority
                      width={128}
                      height={128}
                      className="rounded-full"
                      alt="User Logo"
                      src={loggedData.avatarUrl}
                    />
                  </div>
                )}
                <p className="text-center font-[700] text-white">Welcome!</p>
                <p className="text-center font-[400] text-white">
                  {loggedData?.name}
                </p>
              </div>
            </div>

            <div className="self-start flex flex-col items-start gap-[0.8rem]">
              {repositories?.nodes?.map((repo) => (
                <>
                  <div
                    onClick={() => {
                      getUserRepository(repo.name).then((x) => {
                        setChoosedRepo(repo.name);
                        setRepoContent(x);
                      });
                    }}
                  >
                    <p className="text-white">{repo.name}</p>
                  </div>
                </>
              ))}
            </div>
            {repoContent?.object?.entries?.map((x) => (
              <div
                onClick={() => {
                  setChoosedFolder(x.name);
                  console.log(choosedRepo, x.name);
                  if (x.extension === '') {
                    getFolderContentFromRepository(choosedRepo, x.name).then(
                      (res) => console.log(res),
                    );
                  }
                  if (x.extension === '.md') {
                    getFileContentFromRepository(choosedRepo, x.name).then(
                      (res) => setMarkdown(res?.object?.text),
                    );
                  }
                }}
              >
                <p>{x.name}</p>
              </div>
            ))}
          </div>
          <div className="w-full">
            <MDEditor
              height={'100vh'}
              value={markdown}
              onChange={setMarkdown}
            />
          </div>
        </>
      )}
    </Layout>
  );
};

export default HomePage;
