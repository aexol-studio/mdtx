import { AzureFunction } from '@azure/functions';
import fetch from 'node-fetch';

const httpTrigger: AzureFunction = async (_, req) => {
  const url = new URL(req.url);
  url.pathname.replace(/^\/api/, '');
  const response = await fetch(
    `https://api.github.com${url.pathname.slice(4)}`,
    {
      headers: {
        ...req.headers,
        host: 'api.github.com',
      },
    },
  );
  const urlCodeload = new URL(response.url);
  return {
    res: {
      status: 302,
      headers: {
        ...response.headers,
        location: `${process.env.PROXY_HOST}/codeload${urlCodeload.pathname}`,
      },
    },
  };
};

export default httpTrigger;
