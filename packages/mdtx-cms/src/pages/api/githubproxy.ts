import { getGithubUser } from '@/src/utils/getGithubUser';
import type { NextApiRequest, NextApiResponse } from 'next';
export default (req: NextApiRequest, res: NextApiResponse) => {
  return new Promise(async () => {
    switch (req.method) {
      case 'POST':
        res.setHeader('Access-Control-Allow-Origin', '*');
        const trueReq = JSON.parse(req.body);
        const responseToken = await fetch(
          'https://github.com/login/oauth/access_token',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
              client_secret: process.env.CLIENT_SECRET,
              code: trueReq.code,
              redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI,
            }),
          },
        );
        const responseText = await responseToken.text();
        console.log(responseText);
        const params = new URLSearchParams(responseText);
        const accessToken = params.get('access_token');
        if (accessToken) {
          const JSONdata = await getGithubUser(accessToken);
          if (JSONdata) {
            res.status(201).json({ accessToken, loginData: JSONdata });
          }
        } else {
          res.status(201).json('Error');
        }
    }
  });
};
