import type { NextApiRequest, NextApiResponse } from 'next';

export default (req: NextApiRequest, res: NextApiResponse) => {
  return new Promise(resolve => {
    switch (req.method) {
      case "POST":
        res.setHeader('Access-Control-Allow-Origin', '*');
        const trueReq = JSON.parse(req.body);
        fetch(`https://github.com/login/oauth/access_token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
            client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
            code: trueReq.code,
            redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI,
          }),
        })
          .then((response) => response.text())
          .then((paramsString) => {
            let params = new URLSearchParams(paramsString);
            const access_token = params.get('access_token');
            return access_token;
          })
          .then((response) => {
            return res.status(200).json(response);
          })
          .catch((error) => {
            return res.status(400).json(error);
          });
    }
  })
};
