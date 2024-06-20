import type { FC, ReactElement } from 'react';
import { cn } from '@nextui-org/system';

interface FooterProps {
  className?: string;
}

const Footer: FC<FooterProps> = ({ className }): ReactElement => (
  <div className={cn('z-10 flex w-full justify-center items-center', className)} data-pw='visenze-footer'>
    <p className='text-xs'>POWERED BY </p>
    <img
      src='https://visenze-static.s3.amazonaws.com/demos/ms-adidas/ViSenze-FullColor-Horizontal.png'
      className='h-5 object-center pb-1 pl-1'
    />
  </div>
);

export default Footer;
