import type { FC, ReactElement } from 'react';
import { memo, useState } from 'react';
import { Button } from '@nextui-org/button';
import { cn } from '@nextui-org/theme';
import { SortType } from '../../../common/types/constants';
import type { ScreenType } from '../icon-triggered-grid';

/**
 * A component for selecting and applying product result sorting options.
 */

interface SortOptionsProps {
  sortType: SortType;
  setSortType: (selectedOption: SortType) => void;
  setScreen: (screen: ScreenType | null) => void;
  className: string;
}

const SortOptions: FC<SortOptionsProps> = ({ sortType, setSortType, setScreen, className }): ReactElement => {
  const [selectedOption, setSelectedOption] = useState<SortType>(sortType);

  return (
    <div className={cn('bg-primary', className)}>
      <div className='primary-text py-3 text-center text-lg lg:py-0 lg:text-start'>Sort</div>
      <div className='calls-to-action-text flex h-full flex-col gap-2 border-1 p-4'>
        {/* Relevance option */}
        <label className='flex cursor-pointer gap-2' data-pw='itg-sort-relevance'>
          <input type='radio' id='relevance' value={SortType.RELEVANCE} checked={selectedOption === SortType.RELEVANCE}
                 onChange={(event) => setSelectedOption(event.target.value as SortType)}/>
          {SortType.RELEVANCE}
        </label>

        {/* Price high to low option */}
        <label className='flex cursor-pointer gap-2' data-pw='itg-sort-high-to-low'>
          <input type='radio' value={SortType.PRICE_HTL} checked={selectedOption === SortType.PRICE_HTL}
                 onChange={(event) => setSelectedOption(event.target.value as SortType)}/>
          {SortType.PRICE_HTL}
        </label>

        {/* Price low to high option */}
        <label className='flex cursor-pointer gap-2' data-pw='itg-sort-low-to-high'>
          <input type='radio' value={SortType.PRICE_LTH} checked={selectedOption === SortType.PRICE_LTH}
                 onChange={(event) => setSelectedOption(event.target.value as SortType)}/>
          {SortType.PRICE_LTH}
        </label>
      </div>

      {/* Cancel & Apply buttons */}
      <div className='flex justify-around py-4 lg:ml-auto lg:justify-normal lg:gap-4 lg:py-0'>
        <Button className='rounded border bg-white px-14 text-black' radius='none' onClick={() => setScreen(null)} data-pw='itg-cancel-sort-button'>
          Cancel
        </Button>
        <Button
          data-pw='itg-apply-sort-button'
          className='rounded border bg-buttonPrimary px-14 text-white'
          radius='none'
          onClick={() => {
            setSortType(selectedOption);
            setScreen(null);
          }}
        >
          <span className='text-buttonPrimary'>Apply</span>
        </Button>
      </div>
    </div>
  );
};

export default memo(SortOptions);
