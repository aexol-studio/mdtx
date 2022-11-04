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
import { ModelTypes, OrderDirection, RepositoryOrderField } from '../zeus';
import { useRouter } from 'next/router';
import { UserType } from '../backend/selectors/user.selector';
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
  const [selectedBranch, setSelectedBranch] = useState({
    repo: '',
    branch: '',
  });
  const [choosedFile, setChoosedFile] = useState({ repo: '', file: '' });
  const [refreshingTree, setRefreshingTree] = useState(false);
  const [refreshingSubTree, setRefreshingSubTree] = useState(false);
  const [sendingComming, setSendingCommit] = useState(false);
  const [path, setPath] = useState('');
  const [oid, setOid] = useState('');
  const [repositories, setRepositories] = useState<RepositoriesType>();
  const [repoContent, setRepoContent] = useState<RepositoryType>();
  const [pathToFile, setPathToFile] = useState('');
  const [selectedOrganization, setSelectedOrganization] = useState('---');
  const [organizationList, setOrganizationList] =
    useState<Pick<UserType, 'organizations'>>();
  const router = useRouter();
  const {
    getUserInfo,
    getUserRepositories,
    getUserRepository,
    getFolderContentFromRepository,
    getFileContentFromRepository,
    createCommitOnBranch,
    getOrganizationRepositories,
    getOrganizationRepository,
    getFileContentFromOrganization,
    getFolderContentFromOrganization,
  } = useBackend();
  useEffect(() => {
    const url = window.location.href;
    const hasCode = url.includes('?code=');
    if (hasCode && !token) {
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
            router.replace('/');
          }
        })
        .catch((error) => {});
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn && !loggedData) {
      setRefreshingTree(true);
      getUserInfo().then((res) => {
        setLoggedData(res);
        setOrganizationList(res);
        console.log(res);
      });
      getUserRepositories({
        first: 50,
        orderBy: {
          direction: OrderDirection.DESC,
          field: RepositoryOrderField.PUSHED_AT,
        },
      }).then((res) => {
        console.log(res);
        setRepositories(res);
        setRefreshingTree(false);
      });
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (selectedOrganization !== '---') {
      getOrganizationRepositories({ first: 50 }, selectedOrganization).then(
        (x) => {
          setRepositories(x);
          setRefreshingTree(false);
        },
      );
    } else {
      getUserRepositories({
        first: 50,
        orderBy: {
          direction: OrderDirection.DESC,
          field: RepositoryOrderField.PUSHED_AT,
        },
      }).then((res) => {
        console.log(res);
        setRepositories(res);
        setRefreshingTree(false);
      });
    }
  }, [selectedOrganization]);

  useEffect(() => {
    if (isLoggedIn && path !== '/') {
      if (selectedOrganization !== '---') {
        getFolderContentFromOrganization(
          choosedRepo,
          path,
          selectedOrganization,
        ).then((res) => {
          setRefreshingSubTree(false);
          setRepoContent(res);
        });
      } else {
        getFolderContentFromRepository(
          choosedRepo,
          path,
          selectedBranch.repo === choosedRepo && selectedBranch.branch
            ? selectedBranch.branch
            : 'HEAD:',
        ).then((res) => {
          setRefreshingSubTree(false);
          setRepoContent(res);
        });
      }
    }
  }, [path, selectedBranch]);

  const handleCommit = (input: ModelTypes['CreateCommitOnBranchInput']) => {
    setSendingCommit(true);
    createCommitOnBranch(input).then((x) => {
      if (selectedOrganization !== '---') {
        getOrganizationRepositories(
          {
            first: 50,
            orderBy: {
              direction: OrderDirection.DESC,
              field: RepositoryOrderField.PUSHED_AT,
            },
          },
          selectedOrganization,
        ).then((res) => {
          console.log(res);
          const findedValue = res?.nodes?.find((x) => x.name === choosedRepo)
            ?.defaultBranchRef?.target?.history?.nodes;
          findedValue && setOid(findedValue[0].oid);
          setMarkdownBase(markdownEdit);
          setRepositories(res);
          setSendingCommit(false);
        });
      } else {
        getUserRepositories({
          first: 50,
          orderBy: {
            direction: OrderDirection.DESC,
            field: RepositoryOrderField.PUSHED_AT,
          },
        }).then((res) => {
          console.log(res);
          const findedValue = res.nodes?.find((x) => x.name === choosedRepo)
            ?.defaultBranchRef?.target?.history?.nodes;
          findedValue && setOid(findedValue[0].oid);
          setMarkdownBase(markdownEdit);
          setRepositories(res);
          setSendingCommit(false);
        });
      }
    });
  };

  const handlePress = (pathx: string, filetype?: string) => {
    switch (filetype) {
      case '.md': {
        setChoosedFile(() => {
          return { file: pathx, repo: choosedRepo };
        });
        setPathToFile(path !== '' ? path + '/' + pathx : pathx);
        setEditingMD(true);
        if (selectedOrganization !== '---') {
          getFileContentFromOrganization(
            choosedRepo,
            path !== '' ? path + '/' + pathx : pathx,
            selectedOrganization,
          ).then((res) => {
            setMarkdownEdit(res?.object?.text);
            setMarkdownBase(res?.object?.text);
          });
        } else {
          getFileContentFromRepository(
            choosedRepo,
            path !== '' ? path + '/' + pathx : pathx,
          ).then((res) => {
            setMarkdownEdit(res?.object?.text);
            setMarkdownBase(res?.object?.text);
          });
        }

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
        setRefreshingSubTree(true);

        break;
      }
      case undefined:
        break;
    }
  };

  return (
    <Layout>
      {markdownBase !== markdownEdit && editingMD && (
        <div
          onClick={() => {
            if (markdownEdit && loggedData) {
              const doBuffer = Buffer.from(markdownEdit, 'utf-8').toString(
                'base64',
              );
              handleCommit({
                branch: {
                  branchName: 'main',
                  repositoryNameWithOwner: `${
                    selectedOrganization !== '---'
                      ? selectedOrganization
                      : loggedData.login
                  }/${choosedRepo}`,
                },
                expectedHeadOid: oid,
                message: { headline: pathToFile },
                fileChanges: {
                  additions: [
                    {
                      path: pathToFile,
                      contents: doBuffer,
                    },
                  ],
                },
              });
            }
          }}
          className="cursor-pointer fixed bottom-[2.4rem] right-[2.4rem] bg-[#FFA23A] rounded-full w-[9.6rem] h-[4.2rem] flex justify-center items-center z-[999]"
        >
          {sendingComming ? (
            <ClipLoader size={'24px'} color="white" />
          ) : (
            <p className="text-white select-none">Commit</p>
          )}
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
              Login with GitHub!
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="select-none w-[20vw] h-screen bg-[#13131C] border-r-[2px] border-r-solid border-r-white flex flex-col items-center pt-[2.4rem]">
            <div
              className="bg-blue-200 px-[1.2rem] py-[0.4rem] rounded-[2.4rem]"
              onClick={() => {
                logOut();
              }}
            >
              <p className="hover:underline cursor-pointer">Logout</p>
            </div>
            <div>
              <div className="mt-[0.8rem] flex flex-col">
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
                {organizationList?.organizations?.nodes && (
                  <select
                    onChange={(e) => {
                      setSelectedOrganization(e.target.value);
                      setRefreshingTree(true);
                    }}
                  >
                    <option>---</option>
                    {organizationList.organizations.nodes.map((x) => {
                      return <option value={x.name}>{x.name}</option>;
                    })}
                  </select>
                )}
              </div>
            </div>

            <div className="border-t-[1px] pt-[0.8rem] border-[#FFF] pl-[1.6rem] min-h-[70vh] scrollbar overflow-x-hidden overflow-y-scroll mt-[3.2rem] self-start w-full flex flex-col items-start gap-[0.8rem]">
              <>
                {refreshingTree ? (
                  <div className="flex w-full items-center justify-center">
                    <ClipLoader color="#FFF" size={64} />
                  </div>
                ) : (
                  <>
                    {repositories?.nodes?.map((repo) => {
                      const ref = React.createRef<HTMLDivElement>();

                      const handleClick = () =>
                        ref.current!.scrollIntoView({
                          behavior: 'auto',
                          block: 'start',
                        });
                      return (
                        <React.Fragment key={repo.name}>
                          <div
                            id={repo.name}
                            className="flex gap-[0.8rem]"
                            onClick={(e) => {
                              const { id } = e.target as HTMLDivElement;

                              if (id !== choosedRepo) {
                                const findedValue = repositories?.nodes?.find(
                                  (x) => x.name === id,
                                )?.defaultBranchRef?.target?.history.nodes;
                                findedValue && setOid(findedValue[0].oid);
                                setMarkdownEdit('Pick Markdown');
                                setMarkdownBase('Pick Markdown');
                                setChoosedRepo(repo.name);
                                setRefreshingSubTree(true);
                                setSelectedBranch({ branch: '', repo: '' });
                                handleClick();
                                if (selectedOrganization !== '---') {
                                  getOrganizationRepository(
                                    repo.name,
                                    selectedOrganization,
                                  ).then((x) => {
                                    console.log(x);
                                    setPath('');
                                    setRefreshingSubTree(false);
                                    setRepoContent(x);
                                  });
                                } else {
                                  getUserRepository(
                                    repo.name,
                                    selectedBranch.repo === choosedRepo &&
                                      selectedBranch.branch
                                      ? selectedBranch.branch
                                      : 'HEAD:',
                                  ).then((x) => {
                                    console.log(x);
                                    setPath('');
                                    setRefreshingSubTree(false);
                                    setRepoContent(x);
                                  });
                                }
                              } else {
                                setPath('');
                                setChoosedRepo('');
                                setRepoContent(undefined);
                              }
                            }}
                          >
                            <div
                              ref={ref}
                              id={repo.name}
                              className="min-w-[2.4rem] min-h-[2.4rem]"
                            >
                              <RepoIcon
                                id={repo.name}
                                color={
                                  choosedRepo === repo.name ? '#bfdbfe' : '#FFF'
                                }
                              />
                            </div>
                            <p
                              id={repo.name}
                              className="text-white cursor-pointer hover:underline"
                            >
                              {repo.name}
                            </p>
                            {choosedRepo === repo.name && (
                              <select
                                defaultValue={repo.defaultBranchRef?.name}
                                onChange={(e) => {
                                  setSelectedBranch({
                                    branch: e.target.value,
                                    repo: repo.name,
                                  });
                                }}
                              >
                                {repo.refs?.nodes?.map((branch) => (
                                  <option>{branch.name}</option>
                                ))}
                              </select>
                            )}
                          </div>
                          {choosedRepo === repo.name && (
                            <div className="flex flex-col gap-[0.8rem] pl-[3.2rem]">
                              {path !== '' && (
                                <div
                                  className="flex gap-[0.8rem]"
                                  onClick={() => {
                                    setRefreshingSubTree(true);
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
                                  <p className="text-white cursor-pointer hover:underline">
                                    Wróc
                                  </p>
                                </div>
                              )}
                              <>
                                {refreshingSubTree ? (
                                  <div className="w-full flex justify-center items-center">
                                    <ClipLoader size={32} color="#FFF" />
                                  </div>
                                ) : (
                                  <>
                                    {repoContent?.object?.entries?.map((x) => (
                                      <div
                                        key={x.name}
                                        className="flex gap-[0.8rem]"
                                        onClick={() => {
                                          handlePress(x.name, x.extension);
                                        }}
                                      >
                                        {x.extension === '.md' && (
                                          <FileIcon
                                            color={
                                              choosedFile.file === x.name &&
                                              choosedFile.repo === repo.name
                                                ? '#bfdbfe'
                                                : '#FFF'
                                            }
                                          />
                                        )}
                                        {x.extension === '' &&
                                          x.type === 'tree' && <FolderIcon />}
                                        <p
                                          className={`${
                                            (x.extension === '' &&
                                              x.type === 'tree') ||
                                            x.extension === '.md'
                                              ? 'cursor-pointer hover:underline'
                                              : ''
                                          } text-white`}
                                        >
                                          {x.name}
                                        </p>
                                      </div>
                                    ))}
                                  </>
                                )}
                              </>
                            </div>
                          )}
                        </React.Fragment>
                      );
                    })}
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
