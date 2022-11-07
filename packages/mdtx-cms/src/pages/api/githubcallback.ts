import type { NextApiRequest, NextApiResponse } from 'next';

export default (req: NextApiRequest, res: NextApiResponse) => {

    return new Promise(resolve => {
        switch (req.method) {
            case "POST":
                const { code } = req.query;
                const proxyURL = process.env.NEXT_PUBLIC_PROXY || '';
                fetch(proxyURL, {
                    method: 'POST',
                    body: JSON.stringify(code),
                })
        }
    })
};
