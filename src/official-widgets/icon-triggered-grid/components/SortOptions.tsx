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
}

const SortOptions: FC<SortOptionsProps> = ({ sortType, setSortType, setEnableSortOptions }): ReactElement => {
  const [selectedOption, setSelectedOption] = useState<SortType>(sortType);

  return (
    <div className='absolute left-0 top-14 flex h-9/10 w-full flex-col justify-between gap-4 bg-white px-8 pb-8 pt-4 text-primary'>
      <span>Sort</span>
      <div className='flex h-full flex-col gap-2 border-1 p-4'>
        <label className='flex gap-2'>
          <input type='radio' id='relevance' value={SortType.RELEVANCE} checked={selectedOption === SortType.RELEVANCE}
                 onChange={(event) => setSelectedOption(event.target.value as SortType)}/>
          Relevance
        </label>
        <label className='flex gap-2'>
          <input type='radio' value={SortType.PRICE_HTL} checked={selectedOption === SortType.PRICE_HTL}
                 onChange={(event) => setSelectedOption(event.target.value as SortType)}/>
          Price: High to low
        </label>
        <label className='flex gap-2'>
          <input type='radio' value={SortType.PRICE_LTH} checked={selectedOption === SortType.PRICE_LTH}
                 onChange={(event) => setSelectedOption(event.target.value as SortType)}/>
          Price: Low to high
        </label>
      </div>
      <div className='flex-end ml-auto flex gap-4'>
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
