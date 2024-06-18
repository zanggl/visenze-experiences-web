import type { FC } from 'react';
import { useEffect, useState, useContext, useRef } from 'react';
import { Skeleton } from '@nextui-org/skeleton';
import type { WidgetClient, WidgetConfig } from '../../common/visenze-core';
import { RootContext } from '../../common/components/shadow-wrapper';
import { WidgetResultContext } from '../../common/types/contexts';
import Result from './components/Result';
import Footer from '../../common/components/Footer';
import useRecommendationSearch from '../../common/components/hooks/use-recommendation-search';

interface ShoppableLookbookProps {
  config: WidgetConfig;
  productSearch: WidgetClient;
  productId: string;
}

interface ObjectDot {
  index: number;
  top: number;
  left: number;
}

const ShoppableLookbook: FC<ShoppableLookbookProps> = ({ config, productSearch, productId }) => {
  const root = useContext(RootContext);
  const imageRef = useRef<HTMLImageElement>(null);
  const [objectDots, setObjectDots] = useState<ObjectDot[]>([]);
  const [retryCount, setRetryCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const {
    productResults,
    metadata,
    referenceImageUrl,
    error,
    objectIndex,
    setObjectIndex,
    objects,
  } = useRecommendationSearch({
    productSearch,
    config,
    productId,
    retryCount,
  });

  const resizeObjectDots = (image: HTMLImageElement): void => {
    const r = image.offsetHeight / image.naturalHeight;
    if (objects.length > 0) {
      const normalizedObjs = objects.map((object, index) => {
        const { box } = object;
        return {
          index,
          top: (box[1] + (box[3] - box[1]) / 2) * r,
          left: (box[0] + (box[2] - box[0]) / 2) * r,
        };
      });
      setObjectDots(normalizedObjs);
    }
  };

  const onImageLoad = (e: any): void => {
    const image = e.target;
    resizeObjectDots(image);
    window.addEventListener('resize', () => {
      if (imageRef.current) {
        resizeObjectDots(imageRef.current);
      }
    });
  };

  useEffect(() => {
    if (error) {
      setRetryCount(retryCount + 1);
    } else {
      setRetryCount(0);
    }
  }, [error]);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (!root || isLoading) {
    return <></>;
  }

  if (error) {
    return (
      <div className='flex h-60 flex-col items-center justify-center gap-4'>
        <span className='text-md font-bold'>Sorry, something went wrong</span>
        <span className='text-sm'>Please refresh to try again</span>
      </div>
    );
  }

  return (
    <>
      <WidgetResultContext.Provider value={{ metadata, productResults }}>
        <div className='bg-primary'>
          {/* Widget Title */}
          <div className='widget-title py-2 text-center text-primary md:py-4'>You may also like</div>

          {/* Reference Image and Product Card Grid container */}
          <div className='relative flex flex-col gap-y-4 md:flex-row'>
            {/* Reference Image */}
            <div className='relative md:h-full md:w-2/5'>
              {objectDots.map((obj, index) => (
                <button
                  className={
                    `group absolute z-10 flex items-center justify-center rounded-full bg-[#515151] transition-all
                    duration-300 hover:size-6 hover:-translate-x-3 hover:-translate-y-3 hover:ring-1 hover:ring-white
                    ${objectIndex === index ? 'size-6 -translate-x-3 -translate-y-3 ring-1 ring-white' : 'size-4 -translate-x-2 -translate-y-2'}`
                  }
                  style={{ top: obj.top, left: obj.left }}
                  key={obj.index}
                  onClick={(): void => setObjectIndex(index)}>
                  <div
                    className={`rounded-full bg-white transition-all duration-300 group-hover:size-4 ${objectIndex === index ? 'size-4' : 'size-2'}`}></div>
                </button>
              ))}
              <Skeleton classNames={{ content: 'aspect-[2/3]' }} isLoaded={!!referenceImageUrl}>
                <img
                  ref={imageRef}
                  className='object-fit size-full'
                  src={referenceImageUrl}
                  onLoad={onImageLoad}
                />
              </Skeleton>
            </div>

            {/* Product card grid */}
            <div className='grid grid-cols-2 gap-x-2 gap-y-4 md:absolute md:right-0 md:top-0 md:h-full md:w-[59%] md:grid-cols-3 md:overflow-y-scroll'>
              {productResults.map((result, index) => (
                <div key={`${result.product_id}-${index}`}>
                  <Result
                    index={index}
                    result={result}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* ViSenze Footer */}
          <Footer className='bg-transparent py-4 md:py-8'/>
        </div>
      </WidgetResultContext.Provider>
    </>
  );
};

export default ShoppableLookbook;
