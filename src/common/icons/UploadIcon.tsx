import type { FC, ReactElement } from 'react';

const UploadIcon: FC<{ className?: string }> = ({ className }): ReactElement => (
  <div className={className}>
    <img src='https://cdn.visenze.com/images/upload-icon.svg'/>
  </div>
);

export default UploadIcon;
