import type { FC, MouseEventHandler } from 'react';
import { Button } from '@nextui-org/button';
import { cn } from '@nextui-org/system';

interface NextArrowProps {
  className?: string;
  onClick?: MouseEventHandler;
}

const NextArrow: FC<NextArrowProps> = ({ className, onClick }) => (
  <div
    className={cn(
    'absolute -right-12 top-1/2 z-20 flex w-12 transition-opacity',
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
          d='M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z'
          clipRule='evenodd'
        />
      </svg>
    </Button>
  </div>
);

export default NextArrow;
