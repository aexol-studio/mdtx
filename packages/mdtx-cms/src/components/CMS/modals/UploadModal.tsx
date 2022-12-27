import { Button } from '../atoms';

interface IUploadModal {
  images?: FileList;
  handleImages: (p: FileList) => void;
  onUploadSubmit: () => Promise<void>;
}

export const UploadModal: React.FC<IUploadModal> = ({
  images,
  handleImages,
  onUploadSubmit,
}) => {
  return (
    <div className="w-full h-full justify-center items-center min-w-[40rem]">
      <div className="py-[0.8rem] w-[80%] h-full mx-auto flex flex-col gap-[1.2rem] justify-center items-center">
        <p className="select-none text-center text-white text-[1.6rem] font-[700] uppercase tracking-wider">
          UPLOAD IMAGE
        </p>
        <input
          multiple
          onChange={(e) => {
            if (e.target.files) {
              const files = e.target.files;
              handleImages(files);
            }
          }}
          type={'file'}
          accept="image/*"
        />
        <div className="w-fit">
          <Button
            onClick={() => images && images.length > 0 && onUploadSubmit()}
            customClassName="mt-[0.8rem]"
            text="Send"
          />
        </div>
      </div>
    </div>
  );
};
