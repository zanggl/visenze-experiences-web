import type { FC } from 'react';
import { useState, memo, useEffect, useRef, useContext } from 'react';
import { WidgetDataContext, WidgetResultContext } from '../../../common/types/contexts';
import ResultLogicImpl from '../../../common/client/result-logic';
import type { ProcessedProduct } from '../../../common/types/product';
import { Actions } from '../../../common/types/tracking-constants';

/**
 * An individual product result card
 */

interface ResultProps {
  index: number;
  result: ProcessedProduct;
  isReferenceProduct: boolean;
}

const Result: FC<ResultProps> = ({ index, result, isReferenceProduct }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { productSearch, displaySettings, callbacks, debugMode } = useContext(WidgetDataContext);
  const { productDetails } = displaySettings;
  const { metadata } = useContext(WidgetResultContext);
  const { onProductClick } = callbacks;
  const targetRef = useRef<HTMLAnchorElement>(null);
  const { productTrackingMeta, onClick } = ResultLogicImpl({
    displaySettings,
    productSearch,
    trackingMeta: metadata,
    isRecommendation: false,
    index,
    onProductClick,
    result,
  });

  const getProductName = (): string => {
    if (result[productDetails.title]) {
      return result[productDetails.title];
    }
    return '';
  };

  const getPrice = (): string => {
    if (result[productDetails.price]) {
      return Number(result[productDetails.price].value).toFixed(2);
    }
    return '';
  };

  const getOriginalPrice = (): string => {
    if (result[productDetails.originalPrice]) {
      return Number(result[productDetails.originalPrice].value).toFixed(2);
    }
    return '';
  };

  // Send Product View tracking event when the product is in view
  useEffect(() => {
    const target = targetRef.current;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && productTrackingMeta) {
          observer.disconnect();
          productSearch.send(Actions.PRODUCT_VIEW, productTrackingMeta);
        }
      });
    }, {
      root: null,
      threshold: 0.8,
    });

    if (target) {
      observer.observe(target);
    }

    // Clean up observer when the component unmounts
    return (): void => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <></>;
  }

  return (
    <a className={`${debugMode ? '' : 'cursor-pointer'}`} ref={targetRef} onClick={debugMode ? undefined : onClick} data-pw={`itg-product-result-card-${index + 1}`}>
      <div className='aspect-[2/3]'>
        <img className='size-full object-cover' src={result.im_url}/>
      </div>
      <div className={`flex w-full flex-col py-2 ${isReferenceProduct && 'border-1'}`}>
        <span className='product-card-title truncate text-primary'>{getProductName()}</span>
        {
          getOriginalPrice()
            ? (
              <div className='flex gap-1'>
                <span className='product-card-price text-red-500'>${getPrice()}</span>
                <span className='product-card-price text-gray-400 line-through'>${getOriginalPrice()}</span>
              </div>
            ) : (
              <span className='product-card-price text-primary'>${getPrice()}</span>
            )
        }
      </div>
    </a>
  );
};

export default memo(Result);
