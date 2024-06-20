import type { FC, ReactElement } from 'react';

const ArrowDownIcon: FC<{ className?: string }> = ({ className }): ReactElement => (
  <div className={className} data-pw='arrow-down-icon'>
    <img src='https://cdn.visenze.com/images/arrow-down-icon.svg'/>
  </div>
);

export default ArrowDownIcon;
