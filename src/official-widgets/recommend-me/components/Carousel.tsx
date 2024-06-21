import type { FC } from 'react';
import { memo, useEffect, useState } from 'react';
import type { ProcessedProduct } from '../../../common/types/product';
import Result from './Result';
import TrashIcon from '../../../common/icons/TrashIcon';

/**
 * An individual carousel of product cards based on a search query
 */

interface CarouselProps {
  results: ProcessedProduct[];
  searchValue: string;
  removeFromHistory: () => void;
}

const Carousel: FC<CarouselProps> = ({ results, searchValue, removeFromHistory }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <div data-pw='product-card-carousel'>
      <div className='relative flex items-center pb-2 pt-4 text-primary'>
        <div className='flex w-full' data-pw='carousel-title'>
          <span>Results for &quot;</span>
          <div className='max-w-13/20 truncate font-bold'>{searchValue}</div>
          <span>&quot;</span>
        </div>
        {
          !isLoading
          && <TrashIcon className='absolute right-0 top-4 size-5 cursor-pointer' onClickHandler={removeFromHistory}/>
        }
      </div>
      <div className='no-scrollbar flex w-full items-end gap-x-4 overflow-scroll'>
        {results.map((result, i) => (
          <div key={result.product_id}>
            <Result
              index={i}
              result={result}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(Carousel);
