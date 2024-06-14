import type { FC, ReactElement } from 'react';

const BackIcon: FC<{ className?: string }> = ({ className }): ReactElement => (
  <div className={className}>
    <img src='https://cdn.visenze.com/images/back-icon.svg'/>
  </div>
);

export default BackIcon;
