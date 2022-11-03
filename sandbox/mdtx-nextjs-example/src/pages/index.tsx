import React, { useEffect, useState } from 'react';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import dynamic from 'next/dynamic';
import { AuthConatiner } from '../containers/AuthContainer';
import Image from 'next/image';
import { Layout } from '../layouts';
import Link from 'next/link';
import { RepositoriesType } from '../backend/selectors/repositories.selector';
import { RepositoryType } from '../backend/selectors/repository.selector';
import { useBackend } from '../backend/useBackend';
import { ArrowLeft, FileIcon, FolderIcon, RepoIcon } from '../assets';
import { ClipLoader } from 'react-spinners';
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });
const HomePage = () => {
  const [markdownEdit, setMarkdownEdit] = useState<string | undefined>(
    'Pick Markdown',
  );
  const [markdownBase, setMarkdownBase] = useState<string | undefined>(
    'Pick Markdown',
  );
  const [editingMD, setEditingMD] = useState(false);
  let {
    setTokenWithLocal,
    token,
    isLoggedIn,
    setIsLoggedIn,
    setLoggedData,
    loggedData,
    logOut,
  } = AuthConatiner.useContainer();
  const [choosedRepo, setChoosedRepo] = useState('');
  const [refreshingTree, setRefreshingTree] = useState(false);
  const [path, setPath] = useState('');
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
            setTokenWithLocal(data);
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
      getUserRepositories({ last: 20 }).then((res) => {
        setRepositories(res);
      });
    }
  }, [isLoggedIn]);

  useEffect(() => {
    getFolderContentFromRepository(choosedRepo, path).then((res) => {
      setRefreshingTree(false);
      setRepoContent(res);
    });
  }, [path]);

  const handlePress = (pathx: string, filetype?: string) => {
    switch (filetype) {
      case '.md': {
        setEditingMD(true);
        console.log(pathx);
        getFileContentFromRepository(choosedRepo, path + '/' + pathx).then(
          (res) => {
            setMarkdownEdit(res?.object?.text);
            setMarkdownBase(res?.object?.text);
          },
        );
        break;
      }
      case '': {
        setPath((prev) => {
          if (prev === '') {
            return `${pathx}`;
          } else {
            return prev + `/${pathx}`;
          }
        });
        setRefreshingTree(true);

        break;
      }
      case undefined:
        break;
    }
  };
  console.log(path);
  return (
    <Layout>
      {markdownBase !== markdownEdit && editingMD && (
        <div className="cursor-pointer fixed bottom-[2.4rem] right-[2.4rem] bg-[#FFA23A] rounded-full px-[1.2rem] py-[0.8rem] z-[999]">
          <p className="text-white select-none">Commit</p>
        </div>
      )}
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
          <div className="select-none w-[20vw] max-w-[90%] overflow-x-hidden overflow-y-scroll h-screen bg-[#13131C] border-r-[2px] border-r-solid border-r-white flex flex-col items-center px-[3.2rem] pt-[2.4rem]">
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

            <div className="self-start w-full flex flex-col items-start gap-[0.8rem]">
              <>
                {refreshingTree ? (
                  <div className="mt-[3.2rem] flex w-full items-center justify-center">
                    <ClipLoader color="#FFF" size={64} />
                  </div>
                ) : (
                  <>
                    {repositories?.nodes?.map((repo) => (
                      <>
                        <div
                          id={repo.name}
                          className="flex gap-[0.8rem]"
                          onClick={(e) => {
                            const pickedRepo = (e.target as Element).id;
                            console.log(pickedRepo, choosedRepo);
                            if (choosedRepo !== pickedRepo) {
                              setChoosedRepo(repo.name);
                              setRefreshingTree(true);
                              getUserRepository(repo.name).then((x) => {
                                setPath('');
                                setRefreshingTree(false);
                                setRepoContent(x);
                              });
                            } else {
                              setPath('');
                              setChoosedRepo('');
                              setRepoContent(undefined);
                            }
                          }}
                        >
                          <RepoIcon />
                          <p className="text-white">{repo.name}</p>
                        </div>
                        {choosedRepo === repo.name && (
                          <div className="flex flex-col gap-[0.8rem] pl-[3.2rem]">
                            {path !== '' && (
                              <div
                                className="flex gap-[0.8rem]"
                                onClick={() => {
                                  setPath((prev) => {
                                    if (prev.lastIndexOf('/') === -1) {
                                      return '';
                                    } else {
                                      return prev.slice(
                                        0,
                                        prev.lastIndexOf('/'),
                                      );
                                    }
                                  });
                                }}
                              >
                                <ArrowLeft />
                                <p className="text-white">Wróc</p>
                              </div>
                            )}
                            {repoContent?.object?.entries?.map((x) => (
                              <div
                                className="flex gap-[0.8rem]"
                                onClick={() => {
                                  console.log(x);
                                  handlePress(x.name, x.extension);
                                }}
                              >
                                {x.extension === '.md' && <FileIcon />}
                                {x.extension === '' && <FolderIcon />}
                                <p className="text-white">{x.name}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    ))}
                  </>
                )}
              </>
            </div>
          </div>
          <div className="w-full">
            <MDEditor
              height={'100vh'}
              value={markdownEdit}
              onChange={setMarkdownEdit}
            />
          </div>
        </>
      )}
    </Layout>
  );
};

export default HomePage;
