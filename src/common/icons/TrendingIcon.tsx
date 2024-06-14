import type { FC, ReactElement } from 'react';

interface TrendingIconProps {
  className?: string;
  onClickHandler?: () => void;
}

const TrendingIcon: FC<TrendingIconProps> = ({ className, onClickHandler }): ReactElement => (
  <div className={className} onClick={onClickHandler}>
    <img src='https://cdn.visenze.com/images/trending-icon.svg'/>
  </div>
);

export default TrendingIcon;
