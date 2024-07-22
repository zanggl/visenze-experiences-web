import type { FC } from 'react';
import { Button } from '@nextui-org/button';
import type { SearchImage } from '../../../common/types/image';
import FileDropzone from '../../../common/components/FileDropzone';
import CameraIcon from '../../../common/icons/CameraIcon';

interface CameraUploadProps {
  onImageUpload: (image: SearchImage) => void;
}

const CameraUpload:FC<CameraUploadProps> = ({ onImageUpload }) => (
    <Button isIconOnly className='rounded-full bg-zinc-50 md:hidden' data-pw='sb-camera-button'>
      <FileDropzone onImageUpload={onImageUpload} name='sb-camera-upload'>
        <CameraIcon className='size-6'/>
      </FileDropzone>
    </Button>
  );

export default CameraUpload;
