import type { FC, ReactElement } from 'react';
import { useRef, useState } from 'react';
import { Button } from '@nextui-org/button';
import { Image } from '@nextui-org/image';
import { cn } from '@nextui-org/system';
import type { ProcessedProduct } from '../../../common/types/product';
import Result from './Result';
import CloseIcon from '../../../common/icons/CloseIcon';

/**
 * Component which displays the search results
 */

interface ResultsPageProps {
  results: ProcessedProduct[];
  handleMultisearchWithQuery: (query: string) => void;
  handleMultisearchWithProduct: (product: ProcessedProduct) => void;
  autocompleteResults: string[];
  activeProduct: ProcessedProduct | null;
  setActiveProduct: (activeProduct: ProcessedProduct | null) => void;
}

const ResultsPage: FC<ResultsPageProps> = ({ results, autocompleteResults, handleMultisearchWithQuery,
                                               handleMultisearchWithProduct, activeProduct, setActiveProduct }): ReactElement => {
  const [productHistory, setProductHistory] = useState<ProcessedProduct[]>([]);
  const resultsRef = useRef<HTMLDivElement>(null);

  const scrollToResultsTop = (): void => {
    resultsRef.current?.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  };

  const onClickMoreLikeThisHandler = (product: ProcessedProduct): void => {
    handleMultisearchWithProduct(product);
    const isProductInHistory = productHistory.some((item) => item.product_id === product.product_id);

    if (!isProductInHistory) {
      setProductHistory([...productHistory, product]);
    }

    setActiveProduct(product);
    scrollToResultsTop();
  };

  const removeFromHistory = (product: ProcessedProduct): void => {
    const newProductHistory = productHistory.filter((item) => item.product_id !== product.product_id);
    if (newProductHistory.length === 0 || activeProduct?.product_id === product.product_id) {
      setActiveProduct(null);
    }
    setProductHistory(newProductHistory);
  };

  return (
    <div className='flex h-[90vh] w-full flex-col divide-y-1'>
      {
        productHistory.length > 0 ? (
          <div className='no-scrollbar flex h-40 w-full gap-2 overflow-x-scroll p-4'>
            {
              productHistory.map((product) => (
                <div
                  key={product.product_id}
                  className={cn(
                    product.product_id === activeProduct?.product_id ? 'border border-gray-500' : 'opacity-60',
                    'relative h-full flex-shrink-0 cursor-pointer',
                  )}
                  onClick={() => {
                    handleMultisearchWithProduct(product);
                    setActiveProduct(product);
                    scrollToResultsTop();
                  }}>
                  <Image
                    classNames={{ wrapper: 'h-full' }}
                    className='object-fit h-full rounded-none' src={product.im_url}
                  />
                  <button
                    className='absolute right-1 top-1 z-10 rounded-full bg-white p-1'
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      removeFromHistory(product);
                    }}
                  >
                    <CloseIcon className='size-3'/>
                  </button>
                </div>
              ))
            }
          </div>
        )
        : (
            <div className='no-scrollbar flex gap-2 overflow-y-hidden overflow-x-scroll p-4'>
              {autocompleteResults.map((result) => (
                <Button
                  disableRipple
                  key={result}
                  size='sm'
                  variant='flat'
                  className='flex-shrink-0 rounded bg-buttonPrimary'
                  onClick={() => {
                    handleMultisearchWithQuery(result);
                  }}>
                  <span className='calls-to-action-text text-buttonPrimary'>{result}</span>
                </Button>
              ))}
            </div>
          )
      }

      <div ref={resultsRef} className='grid h-full grid-cols-2 gap-x-4 overflow-y-auto px-4 pt-4 md:grid-cols-3'>
        {results.map((result, index) => (
          <Result key={result.product_id} index={index} result={result} onClickMoreLikeThisHandler={onClickMoreLikeThisHandler}/>
        ))}
      </div>
    </div>
  );
};

export default ResultsPage;
