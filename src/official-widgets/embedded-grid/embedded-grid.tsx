import type { FC } from 'react';
import { useEffect, useState, useContext } from 'react';
import type { WidgetClient, WidgetConfig } from '../../common/visenze-core';
import { RootContext } from '../../common/components/shadow-wrapper';
import { WidgetResultContext } from '../../common/types/contexts';
import Result from './components/Result';
import Footer from '../../common/components/Footer';
import useRecommendationSearch from '../../common/components/hooks/use-recommendation-search';

interface EmbeddedGridProps {
  config: WidgetConfig;
  productSearch: WidgetClient;
  productId: string;
}

const EmbeddedGrid: FC<EmbeddedGridProps> = ({ config, productSearch, productId }) => {
  const root = useContext(RootContext);
  const [retryCount, setRetryCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const {
    productResults,
    metadata,
    error,
  } = useRecommendationSearch({
    productSearch,
    config,
    productId,
    retryCount,
  });

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
          <div className='widget-title py-2 text-center text-primary md:py-4' data-pw='eg-widget-title'>You may also like</div>

          {/* Product result grid */}
          <div className='grid grid-cols-2 gap-x-2 gap-y-4 md:grid-cols-5' data-pw='eg-product-result-grid'>
            {productResults.map((result, index) => (
              <div key={`${result.product_id}-${index}`} data-pw={`eg-product-result-card-${index + 1}`}>
                <Result
                  index={index}
                  result={result}
                />
              </div>
            ))}
          </div>

          {/* ViSenze Footer */}
          <Footer className='bg-transparent py-4 md:py-8' dataPw='eg-visenze-footer'/>
        </div>
      </WidgetResultContext.Provider>
    </>
  );
};

export default EmbeddedGrid;
