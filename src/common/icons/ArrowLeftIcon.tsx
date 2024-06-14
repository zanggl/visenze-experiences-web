import type { FC, ReactElement } from 'react';

interface ArrowLeftProps {
  className?: string;
  onClickHandler?: () => void;
}

const ArrowLeftIcon: FC<ArrowLeftProps> = ({ className, onClickHandler }): ReactElement => (
  <div className={className} onClick={onClickHandler}>
    <img src='https://cdn.visenze.com/images/arrow-left-icon.svg'/>
  </div>
);

export default ArrowLeftIcon;
