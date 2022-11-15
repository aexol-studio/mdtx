import { NextApiRequest, NextApiResponse } from 'next';

export default (_req: NextApiRequest, res: NextApiResponse) => {
  res.redirect(
    `https://github.com/login/oauth/authorize?scope=repo%20read:user%20write:org%20read:org&client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_REDIRECT_URI}`,
  );
};
