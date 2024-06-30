import type { FC } from 'react';
import { Button } from '@nextui-org/button';
import { cn } from '@nextui-org/theme';

interface NextArrowProps {
  onClickHandler: () => void;
  isDisabled?: boolean;
  iconColour?: string;
}

const NextArrow: FC<NextArrowProps> = ({ onClickHandler, isDisabled = false, iconColour = '#000000' }) => (
  <div
    className={cn(
      'absolute right-0 flex h-full w-12 items-center bg-gradient-to-r from-transparent to-white transition-all',
      isDisabled ? 'opacity-0 z-0' : 'opacity-100 z-20',
    )}
    data-pw='next-arrow'
  >
    <Button
      isIconOnly
      disableRipple
      className='bg-transparent'
      size='md'
      onClick={onClickHandler}
    >
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill={iconColour} className='size-9'>
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
