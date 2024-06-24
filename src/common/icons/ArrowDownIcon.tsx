import type { FC, ReactElement } from 'react';

const ArrowDownIcon: FC<{ className?: string }> = ({ className }): ReactElement => (
  <div className={className}>
    <img src='https://cdn.visenze.com/images/arrow-down-icon.svg'/>
  </div>
);

export default ArrowDownIcon;
