import { AzureFunction } from '@azure/functions';
import fetch from 'node-fetch';

const httpTrigger: AzureFunction = async (_, req) => {
  const url = new URL(req.url);
  url.pathname.replace(/^\/codeload/, '');
  const response = await fetch(
    `https://codeload.github.com${url.pathname.slice(9)}`,
    {
      headers: { ...req.headers, host: 'codeload.github.com' },
    },
  );
  const body = await response.buffer();
  return {
    res: {
      status: response.status,
      body,
      headers: response.headers.raw(),
    },
  };
};

export default httpTrigger;
