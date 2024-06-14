import type { FC, ReactElement } from 'react';

const CloseIcon: FC<{ className?: string }> = ({ className }): ReactElement => (
  <div className={className}>
    <img src='https://cdn.visenze.com/images/close-icon.svg'/>
  </div>
);

export default CloseIcon;
