import type { FC, ReactElement } from 'react';
import { memo, useState } from 'react';
import { Button } from '@nextui-org/button';
import { cn } from '@nextui-org/theme';
import { Radio, RadioGroup } from '@nextui-org/radio';
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
        <RadioGroup
          value={selectedOption}
          onChange={(event) => setSelectedOption(event.target.value as SortType)}
          color='secondary'
        >
          <Radio value={SortType.RELEVANCE} data-pw='itg-sort-relevance'>{SortType.RELEVANCE}</Radio>
          <Radio value={SortType.PRICE_HTL} data-pw='itg-sort-high-to-low'>{SortType.PRICE_HTL}</Radio>
          <Radio value={SortType.PRICE_LTH} data-pw='itg-sort-low-to-high'>{SortType.PRICE_LTH}</Radio>
        </RadioGroup>
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
