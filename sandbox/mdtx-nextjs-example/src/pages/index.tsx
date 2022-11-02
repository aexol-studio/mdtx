import React, { useEffect, useState } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import dynamic from 'next/dynamic';
import { AuthConatiner } from '../../containers/AuthContainer';
import { useRouter } from 'next/router';
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });
const HomePage = () => {
  const router = useRouter();
  const [sendOnce, setSendOnce] = useState(true);
  const [contents, setContents] =
    useState<[{ type: string; name: string; dir: string }]>();
  const [link, setLink] = useState('');
  const [markdown, setMarkdown] = useState<string | undefined>('Pick Markdown');
  let { setTokenWithLocal, token, isLoggedIn, logOut } =
    AuthConatiner.useContainer();
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
          setTokenWithLocal(data);
          router.replace('/');
        })
        .catch((error) => {});
    }
  }, []);

  if (sendOnce) {
    fetch(`https://api.github.com/repos/AleksanderBondar/widget/contents/`)
      .then((response) => response.json())
      .then((data) => {
        setSendOnce(false);
        setContents(data);
      })
      .catch((err) => {});
  }
  useEffect(() => {
    fetch(
      `https://api.github.com/repos/AleksanderBondar/widget/contents${link}`,
    )
      .then((response) => response.json())
      .then((data) => {
        setContents(data);
      })
      .catch((err) => {});
  }, [link]);
  return (
    <div className="flex">
      {!token && isLoggedIn === 'no' ? (
        <>
          <a
            className="login-link"
            href={`https://github.com/login/oauth/authorize?scope=user&client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_REDIRECT_URI}`}
          >
            <span>Login with GitHub</span>
          </a>
        </>
      ) : (
        <>
          <div className="w-[20vw] h-screen bg-blue-200 flex flex-col items-center px-[3.2rem] pt-[2.4rem] gap-[.8rem]">
            <a
              onClick={() => {
                logOut();
              }}
              className="login-link"
            >
              <span>Logout</span>
            </a>
            {/* <div>
          <div className="flex flex-col items-center gap-[0.8rem]">
            <div
              className="cursor-pointer"
              onClick={() => {
                signOut();
                router.push('/');
              }}
            >
              <p>Sign out</p>
            </div>
            <h1>Welcome to MDtx editor!</h1>
            {session.user?.image && (
              <div className="relative w-[6.4rem] h-[6.4rem] rounded-full">
                <Image
                  className="rounded-full"
                  layout="fill"
                  src={session.user.image}
                />
              </div>
            )}
            <p>Welcome! {session.user?.name}</p>
          </div>
        </div> */}
            {link !== '' && (
              <div
                onClick={() => {
                  setLink((prev) => prev.slice(0, prev.lastIndexOf('/')));
                }}
                className={`cursor-pointer flex items-center justify-center gap-[1.6rem]`}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M22.4999 12.0002C22.4999 11.8013 22.4209 11.6105 22.2802 11.4699C22.1396 11.3292 21.9488 11.2502 21.7499 11.2502H4.06038L8.78088 6.5312C8.85061 6.46147 8.90592 6.37868 8.94366 6.28758C8.9814 6.19647 9.00082 6.09882 9.00082 6.0002C9.00082 5.90158 8.9814 5.80393 8.94366 5.71282C8.90592 5.62172 8.85061 5.53893 8.78088 5.4692C8.71114 5.39947 8.62836 5.34415 8.53725 5.30641C8.44614 5.26868 8.34849 5.24925 8.24988 5.24925C8.15126 5.24925 8.05361 5.26868 7.9625 5.30641C7.87139 5.34415 7.78861 5.39947 7.71888 5.4692L1.71888 11.4692C1.64903 11.5389 1.59362 11.6216 1.55581 11.7127C1.518 11.8039 1.49854 11.9015 1.49854 12.0002C1.49854 12.0989 1.518 12.1965 1.55581 12.2876C1.59362 12.3788 1.64903 12.4615 1.71888 12.5312L7.71888 18.5312C7.78861 18.6009 7.87139 18.6562 7.9625 18.694C8.05361 18.7317 8.15126 18.7511 8.24988 18.7511C8.34849 18.7511 8.44614 18.7317 8.53725 18.694C8.62836 18.6562 8.71114 18.6009 8.78088 18.5312C8.85061 18.4615 8.90592 18.3787 8.94366 18.2876C8.9814 18.1965 9.00082 18.0988 9.00082 18.0002C9.00082 17.9016 8.9814 17.8039 8.94366 17.7128C8.90592 17.6217 8.85061 17.5389 8.78088 17.4692L4.06038 12.7502H21.7499C21.9488 12.7502 22.1396 12.6712 22.2802 12.5305C22.4209 12.3899 22.4999 12.1991 22.4999 12.0002Z"
                    fill="black"
                  />
                </svg>
                <p>Wróć</p>
              </div>
            )}
            <div className="self-start flex flex-col items-start gap-[0.8rem]">
              {contents && contents.length ? (
                contents.map((x) => {
                  return (
                    <div
                      className={`${
                        x.type === 'dir' ? 'cursor-pointer' : 'cursor-default'
                      } flex items-center justify-center gap-[1.6rem]`}
                    >
                      {x.type === 'dir' ? (
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M1.49914 5.25C1.49914 4.65326 1.73619 4.08097 2.15815 3.65901C2.58011 3.23705 3.1524 3 3.74914 3H7.89514C9.33214 3 10.5351 3.84 11.3616 4.776C11.9766 5.472 12.7191 6 13.4991 6H20.2491C20.8459 6 21.4182 6.23705 21.8401 6.65901C22.2621 7.08097 22.4991 7.65326 22.4991 8.25V9.21C23.3541 9.6075 23.9091 10.524 23.7831 11.529L22.8231 19.215C22.7097 20.1226 22.2685 20.9574 21.5826 21.5624C20.8967 22.1674 20.0133 22.5008 19.0986 22.5H4.89814C3.98403 22.5001 3.10137 22.1663 2.41605 21.5614C1.73074 20.9565 1.28999 20.1221 1.17664 19.215L0.21664 11.529C0.1575 11.0565 0.249804 10.5774 0.480268 10.1607C0.710733 9.74394 1.06747 9.41108 1.49914 9.21V5.25ZM2.99914 9H20.9991V8.25C20.9991 8.05109 20.9201 7.86032 20.7795 7.71967C20.6388 7.57902 20.4481 7.5 20.2491 7.5H13.4991C12.0531 7.5 10.9341 6.5565 10.2381 5.769C9.56014 5.001 8.72914 4.5 7.89514 4.5H3.74914C3.55023 4.5 3.35946 4.57902 3.21881 4.71967C3.07816 4.86032 2.99914 5.05109 2.99914 5.25V9ZM2.44864 10.5C2.34231 10.5 2.23721 10.5227 2.1403 10.5664C2.04339 10.6102 1.95689 10.674 1.88653 10.7537C1.81618 10.8334 1.76357 10.9272 1.73221 11.0288C1.70085 11.1304 1.69146 11.2375 1.70464 11.343L2.66464 19.029C2.73266 19.5733 2.9972 20.0741 3.40851 20.437C3.81983 20.8 4.34957 21.0002 4.89814 21H19.1001C19.6487 21.0002 20.1785 20.8 20.5898 20.437C21.0011 20.0741 21.2656 19.5733 21.3336 19.029L22.2936 11.343C22.3068 11.2375 22.2974 11.1304 22.2661 11.0288C22.2347 10.9272 22.1821 10.8334 22.1117 10.7537C22.0414 10.674 21.9549 10.6102 21.858 10.5664C21.7611 10.5227 21.656 10.5 21.5496 10.5H2.44864Z"
                            fill="black"
                          />
                        </svg>
                      ) : (
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M6 0H14.25V1.5H6C5.60218 1.5 5.22064 1.65804 4.93934 1.93934C4.65804 2.22064 4.5 2.60218 4.5 3V21C4.5 21.3978 4.65804 21.7794 4.93934 22.0607C5.22064 22.342 5.60218 22.5 6 22.5H18C18.3978 22.5 18.7794 22.342 19.0607 22.0607C19.342 21.7794 19.5 21.3978 19.5 21V6.75H21V21C21 21.7956 20.6839 22.5587 20.1213 23.1213C19.5587 23.6839 18.7956 24 18 24H6C5.20435 24 4.44129 23.6839 3.87868 23.1213C3.31607 22.5587 3 21.7956 3 21V3C3 2.20435 3.31607 1.44129 3.87868 0.87868C4.44129 0.316071 5.20435 0 6 0V0Z"
                            fill="black"
                          />
                          <path
                            d="M14.25 4.5V0L21 6.75H16.5C15.9033 6.75 15.331 6.51295 14.909 6.09099C14.4871 5.66903 14.25 5.09674 14.25 4.5Z"
                            fill="black"
                          />
                        </svg>
                      )}

                      <p
                        onClick={() => {
                          if (x.type === 'dir') {
                            setLink((prev) => prev + `/${x.name}`);
                          }
                          if (x.name.includes('.md')) {
                            fetch(
                              `https://api.github.com/repos/AleksanderBondar/widget/contents${link}/${x.name}`,
                            )
                              .then((response) => response.json())
                              .then((data) => {
                                setMarkdown(
                                  Buffer.from(data.content, 'base64').toString(
                                    'binary',
                                  ),
                                );
                              })
                              .catch((err) => {});
                          }
                        }}
                        className={
                          x.type === 'file'
                            ? x.name.includes('.md')
                              ? 'text-red-500'
                              : 'text-white'
                            : 'text-black'
                        }
                      >
                        {x.name}
                      </p>
                    </div>
                  );
                })
              ) : (
                <div className="self-center flex flex-col items-center justify-center gap-[0.8rem]">
                  <p className="font-[500] text-[1.6rem] leading-[2.4rem]">
                    Loading...
                  </p>
                  <ClipLoader size={'48px'} />
                </div>
              )}
            </div>
          </div>
          <div className="w-full">
            <MDEditor value={markdown} onChange={setMarkdown} />
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage;
