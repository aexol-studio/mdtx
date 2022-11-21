import { FileType } from '@/src/containers';
import JSZip from 'jszip';
import type { NextApiRequest, NextApiResponse } from 'next';
export default (req: NextApiRequest, res: NextApiResponse) => {
  return new Promise(async () => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const body = req.body;
    const response = await fetch(
      `https://github.com/${body.fullName}/archive/refs/heads/${body.branchName}.zip`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${body.token}`,
        },
      },
    );
    const file = await response.arrayBuffer();
    const content = await JSZip.loadAsync(file);
    const fileArray: FileType[] = [];
    const data = await Promise.all(
      Object.entries(content.files).map(async ([k, v]) => {
        const splitted = v.name.split('.');
        const extension =
          splitted.length > 1 ? splitted[splitted.length - 1] : undefined;
        if (extension) {
          const content = await v.async('arraybuffer');
          fileArray.push({
            content: Buffer.from(content).toString('utf-8'),
            dir: v.dir,
            name: v.name,
          });
        }
      }),
    );
    if (data) {
      res.status(201).json({ fileArray });
    } else {
      res.status(201).json('No_access');
    }
  });
};
export const config = {
  api: {
    responseLimit: false,
  },
};
