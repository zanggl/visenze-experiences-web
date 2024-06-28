import type { FC, ReactElement } from 'react';

interface ArrowLeftProps {
  className?: string;
  onClickHandler?: () => void;
}

const ArrowLeftIcon: FC<ArrowLeftProps> = ({ className }): ReactElement => (
  <svg fill='none' focusable='false' viewBox='0 0 24 24' className={className}>
    <path d='M15.5 19l-7-7 7-7' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5'></path>
  </svg>
);

export default ArrowLeftIcon;
