import { useFileState } from '@/src/containers';
import { Button } from '../atoms';

interface IUploadModal {
  file?: File;
  handleFile: (p: File) => void;
  onUploadSubmit: () => Promise<void>;
}

export const UploadModal: React.FC<IUploadModal> = ({
  file,
  handleFile,
  onUploadSubmit,
}) => {
  return (
    <div className="w-full h-full justify-center items-center min-w-[40rem]">
      <div className="py-[0.8rem] w-[80%] h-full mx-auto flex flex-col gap-[1.2rem] justify-center items-center">
        <p className="select-none text-center text-white text-[1.6rem] font-[700] uppercase tracking-wider">
          UPLOAD IMAGE
        </p>
        <input
          onChange={(e) => {
            if (e.target.files) {
              const singleFile = e.target.files[0];
              handleFile(singleFile);
            }
          }}
          type={'file'}
          accept="image/*"
        />
        <div className="w-fit">
          <Button
            onClick={() => file && onUploadSubmit()}
            customClassName="mt-[0.8rem] px-[3.2rem] py-[0.4rem]"
            text="Send"
            color="orange"
          />
        </div>
      </div>
    </div>
  );
};
