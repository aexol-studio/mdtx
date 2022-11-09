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
            client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
            code: trueReq.code,
            redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI
          })
        })
        const responseText = await responseToken.text();
        const params = new URLSearchParams(responseText)
        const accessToken = params.get('access_token')
        const responseInstallations = await fetch('https://api.github.com/user/installations', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        })
        const installationParse = await responseInstallations.json()
        if (installationParse.total_count === 0) {
          res.status(201).json({ error: "" })
        }
        const installationIds = installationParse.installations.map((installation: { id: any; target_type: any }) => ({ id: installation.id, targetType: installation.target_type }))
        const responseInstalledRepositoried = await Promise.all(installationIds.map(async ({ id, targetType }: { id: string; targetType: string }) => {
          const res = await fetch(
            `https://api.github.com/user/installations/${id}/repositories`,
            {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
              }
            }
          );
          const { repositories } = await res.json();
          const names = repositories.map((x: { name: any; }) => x.name);
          const full_names = repositories.map((x_1: { full_name: any; }) => x_1.full_name);
          return {
            names, fullName: full_names[0].split('/')[0], targetType
          };
        }))
        res.status(201).json({ accessToken, responseInstalledRepositoried })
    }
  })
};