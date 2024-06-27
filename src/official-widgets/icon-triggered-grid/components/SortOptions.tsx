import type { FC, ReactElement } from 'react';
import { useState } from 'react';
import { Button } from '@nextui-org/button';
import { SortType } from '../../../common/types/constants';

/**
 * A component for dynamically selecting and applying product result sorting options.
 */

interface SortOptionsProps {
  sortType: SortType;
  setSortType: (selectedOption: SortType) => void;
  setEnableSortOptions: (enableSortOptions: boolean) => void;
  className: string;
}

const SortOptions: FC<SortOptionsProps> = ({ sortType, setSortType, setEnableSortOptions, className }): ReactElement => {
  const [selectedOption, setSelectedOption] = useState<SortType>(sortType);

  return (
    <div className={className}>
      <div className='primary-text py-3 text-center lg:py-0 lg:text-start'>Sort</div>
      <div className='flex h-full flex-col gap-2 border-1 p-4'>
        <label className='flex cursor-pointer gap-2'>
          <input type='radio' id='relevance' value={SortType.RELEVANCE} checked={selectedOption === SortType.RELEVANCE}
                 onChange={(event) => setSelectedOption(event.target.value as SortType)}/>
          {SortType.RELEVANCE}
        </label>
        <label className='flex cursor-pointer gap-2'>
          <input type='radio' value={SortType.PRICE_HTL} checked={selectedOption === SortType.PRICE_HTL}
                 onChange={(event) => setSelectedOption(event.target.value as SortType)}/>
          {SortType.PRICE_HTL}
        </label>
        <label className='flex cursor-pointer gap-2'>
          <input type='radio' value={SortType.PRICE_LTH} checked={selectedOption === SortType.PRICE_LTH}
                 onChange={(event) => setSelectedOption(event.target.value as SortType)}/>
          {SortType.PRICE_LTH}
        </label>
      </div>
      <div className='flex justify-around py-4 lg:ml-auto lg:justify-normal lg:gap-4 lg:py-0'>
        <Button className='rounded border bg-white px-14 text-black' radius='none' onClick={() => setEnableSortOptions(false)}>
          Cancel
        </Button>
        <Button className='rounded border bg-buttonPrimary px-14 text-white' radius='none' onClick={() => {
          setSortType(selectedOption);
          setEnableSortOptions(false);
        }}
        >
          <span className='text-buttonPrimary'>Apply</span>
        </Button>
      </div>
    </div>
  );
};

export default SortOptions;
