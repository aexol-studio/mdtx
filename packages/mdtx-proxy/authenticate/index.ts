import { AzureFunction } from '@azure/functions';
import { createOAuthAppAuth } from '@octokit/auth-oauth-app';
const auth = createOAuthAppAuth({
  clientType: 'oauth-app',
  clientId: process.env.GITHUB_APPLICATION_CLIENT_ID || '',
  clientSecret: process.env.GITHUB_APPLICATION_CLIENT_SECRET || '',
});
const httpTrigger: AzureFunction = async (_, req) => {
  const userAuthenticationFromWebFlow = await auth({
    type: 'oauth-user',
    code: req.params.code,
  });
  return {
    res: {
      body: userAuthenticationFromWebFlow,
    },
  };
};

export default httpTrigger;
