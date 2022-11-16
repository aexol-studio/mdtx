import { UserType } from '../containers';

export const useGithubCalls = () => {
  const getGithubUser = async (token: string) => {
    const loginData = await fetch('https://api.github.com/user', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const JSONdata: UserType = await loginData.json();
    return JSONdata;
  };
  const getUserOrganizations = async (token: string) => {
    const loginData = await fetch(`https://api.github.com/user/orgs`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const JSONdata = await loginData.json();
    return JSONdata;
  };
  const getRepositoryMDtx = async () => {
    const response = await fetch(
      'https://api.github.com/repos/aexol-studio/mdtx',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    const responseParse = await response.json();
    return responseParse;
  };
  return { getGithubUser, getUserOrganizations, getRepositoryMDtx };
};
