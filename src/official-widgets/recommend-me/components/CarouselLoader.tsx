import type { FC, ReactElement } from 'react';
import { Skeleton } from '@nextui-org/skeleton';
import type { ProcessedProduct } from '../../../common/types/product';
import Result from './Result';

/**
 * A placeholder carousel that displays products as they are being received from the ongoing event stream.
 */
const CarouselLoader: FC<{ results: ProcessedProduct[], searchValue: string }> = ({ results, searchValue }): ReactElement => (
  <>
    <div className='relative flex items-center pb-2 pt-4 text-primary'>
      <span>Results for &quot;</span>
      <div className='max-w-13/20 truncate font-bold'>{searchValue}</div>
      <span>&quot;</span>
    </div>
    <div className='no-scrollbar flex gap-x-4 overflow-scroll'>
      {results.map((result, index) => (
        <div key={`${result.product_id}-${index}`}>
          <Result
            index={index}
            result={result}
          />
        </div>
      ))}
      {
        results.length === 0
        && <div className='flex flex-col'>
          <Skeleton className='h-64 w-36 md:h-80 md:w-48 lg:h-108 lg:w-64'></Skeleton>
        </div>
      }
    </div>
  </>
);

export default CarouselLoader;
