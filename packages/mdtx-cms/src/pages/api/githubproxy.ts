import type { NextApiRequest, NextApiResponse } from 'next';
export default (req: NextApiRequest, res: NextApiResponse) => {
  return new Promise(async () => {
    switch (req.method) {
      case 'POST':
        res.setHeader('Access-Control-Allow-Origin', '*')
        const trueReq = JSON.parse(req.body)
        const responseToken = await fetch('https://github.com/login/oauth/access_token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            code: trueReq.code,
            redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI
          })
        })
        const responseText = await responseToken.text();
        const params = new URLSearchParams(responseText)
        const accessToken = params.get('access_token')

        const user = await fetch('https://api.github.com/user', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        })
        const loginData = await user.json()
        const { login } = loginData
        const responseInstallations = await fetch('https://api.github.com/user/installations', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        })
        const installationParse = await responseInstallations.json()
        const isInstalled = installationParse.installations.find((x: { account: { login: string; }; target_type: string; }) => x.account.login === login || x.target_type === 'Organization')
        if (!!isInstalled) {
          res.status(201).json({ accessToken })
        } else {
          res.status(201).json("No_installation")
        }
    }
  })
};