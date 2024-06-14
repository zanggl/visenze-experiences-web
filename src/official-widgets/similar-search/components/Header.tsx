import { Button } from '@nextui-org/button';
import type { FC, ReactElement } from 'react';
import CloseIcon from '../../../common/icons/CloseIcon';

interface HeaderProps {
  onCloseHandler: () => void;
}

const Header: FC<HeaderProps> = ({ onCloseHandler }): ReactElement => {
  const title = 'MORE LIKE THIS';

  return (
    <div className='relative flex w-full items-center bg-primary py-4 pl-8 lg:rounded-t-3xl'>
      <p className='widget-title hidden text-start text-primary md:block'>{title}</p>

      <Button isIconOnly className='absolute right-4 top-2 bg-transparent md:right-5 md:top-4' onClick={onCloseHandler}>
        <CloseIcon className='size-6'/>
      </Button>
    </div>
  );
};

export default Header;
