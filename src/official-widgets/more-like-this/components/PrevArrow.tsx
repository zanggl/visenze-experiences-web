import type { FC, MouseEventHandler } from 'react';
import { Button } from '@nextui-org/button';
import { cn } from '@nextui-org/system';

interface PrevArrowProps {
  className?: string;
  onClick?: MouseEventHandler;
}

const PrevArrow: FC<PrevArrowProps> = ({ className, onClick }) => (
  <div
    className={cn(
      'absolute -left-10 top-1/2 z-20 flex w-12 transition-opacity',
      className?.includes('slick-disabled') ? 'opacity-0' : 'opacity-100',
    )}>
    <Button
      isIconOnly
      disableRipple
      className='bg-transparent'
      size='md'
      onClick={onClick}
    >
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' className='size-6'>
        <path
          fillRule='evenodd'
          d='M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z'
          clipRule='evenodd'
        />
      </svg>
    </Button>
  </div>
);

export default PrevArrow;