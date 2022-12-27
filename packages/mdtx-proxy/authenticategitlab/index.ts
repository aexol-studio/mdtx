import { AzureFunction } from '@azure/functions';
import fetch from 'node-fetch';
const httpTrigger: AzureFunction = async (_, req) => {
  const { code, client_id, redirect_uri, grant_type, gitlaburl } = req.headers;
  const encodedParams = new URLSearchParams();

  encodedParams.set('grant_type', grant_type);
  encodedParams.set('code', code);
  encodedParams.set('redirect_uri', redirect_uri);
  encodedParams.set('client_id', client_id);

  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: encodedParams,
  };

  const response = await fetch(gitlaburl, options);
  const body = await response.json();

  return {
    res: {
      body,
    },
  };
};

export default httpTrigger;
