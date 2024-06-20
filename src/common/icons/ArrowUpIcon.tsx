import type { FC, ReactElement } from 'react';

const ArrowUpIcon: FC<{ className?: string }> = ({ className }): ReactElement => (
  <div className={className} data-pw='arrow-up-icon'>
    <img src='https://cdn.visenze.com/images/arrow-up-icon.svg'/>
  </div>
);

export default ArrowUpIcon;
