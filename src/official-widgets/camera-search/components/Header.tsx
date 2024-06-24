import { Button } from '@nextui-org/button';
import type { FC, ReactElement } from 'react';
import CloseIcon from '../../../common/icons/CloseIcon';
import BackIcon from '../../../common/icons/BackIcon';

interface HeaderProps {
  onCloseHandler: () => void;
  isResultScreen?: boolean;
  onBackHandler?: () => void;
}

const Header: FC<HeaderProps> = ({ onCloseHandler, onBackHandler, isResultScreen = false }): ReactElement => {
  const uploadScreenTitleStart = 'SHOW US WHAT ';
  const uploadScreenTitleEnd = 'YOU\'RE LOOKING FOR';
  const resultScreenTitle = 'HERE\'S WHAT WE FOUND';

  return (
    <div className='relative flex w-full items-center justify-center bg-primary py-4'>
      {
        isResultScreen
        ? (
          <>
            <Button isIconOnly className='absolute left-5 top-3 bg-transparent' onClick={onBackHandler} data-pw='cs-back-button'>
              <BackIcon className='size-6'/>
            </Button>
            <p className='hidden text-2xl text-primary md:block' data-pw='cs-widget-title'>{resultScreenTitle}</p>
          </>
        )
        : (
          <p className='widget-title text-center text-primary' data-pw='cs-widget-title'>
            {uploadScreenTitleStart}
            <br className='md:hidden'/>
            {uploadScreenTitleEnd}
          </p>
        )
      }

      <Button isIconOnly className='absolute right-5 top-3 bg-transparent' onClick={onCloseHandler} data-pw='cs-close-button'>
        <CloseIcon className='size-6'/>
      </Button>
    </div>
  );
};

export default Header;
