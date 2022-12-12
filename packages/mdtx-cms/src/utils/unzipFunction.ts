import JSZip from 'jszip';
import { FileType } from '../containers';

export const unzipFunction = async (data: any) => {
  const content = await JSZip.loadAsync(data);
  const fileArray: FileType[] = [];
  await Promise.all(
    Object.entries(content.files).map(async ([_k, v]) => {
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
  return fileArray;
};
