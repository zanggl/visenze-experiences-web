import type { FC, ReactElement } from 'react';

const MoreLikeThisIcon: FC<{ className?: string }> = ({ className }): ReactElement => (
  <div className={className}>
      <img src='https://cdn.visenze.com/images/more-like-this-icon.svg'/>
  </div>
);

export default MoreLikeThisIcon;
