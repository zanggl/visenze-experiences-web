import type { ReactElement } from 'react';
import { useEffect, useContext, useState } from 'react';
import type { ProductSearchResponse } from 'visearch-javascript-sdk';
import { WidgetDataContext, WidgetResultContext } from '../../common/types/contexts';
import { RootContext } from '../../common/components/shadow-wrapper';
import { dataURLtoBlob, getFlattenProducts } from '../../common/utils';
import type { ProcessedProduct } from '../../common/types/product';
import { Category } from '../../common/types/tracking-constants';
import Result from './components/Result';

const EmbeddedSearchResults = (): ReactElement => {
  const { productSearch, searchSettings } = useContext(WidgetDataContext);
  const [productResults, setProductResults] = useState<ProcessedProduct[]>([]);
  const [metadata, setMetadata] = useState<Record<string, any>>({});
  const [error, setError] = useState('');
  const root = useContext(RootContext);

  const handleError = (errorMsg: string): void => {
    setError(errorMsg);
    console.error(errorMsg);
  };

  const handleSuccess = (res: ProductSearchResponse): void => {
    if (res.status === 'fail') {
      handleError(res.error.message);
    } else {
      setError('');
      setMetadata({
        cat: Category.RESULT,
        queryId: res.reqid,
      });
      setProductResults(getFlattenProducts(res.result));
    }
  };

  const multisearchWithSearchBarDetails = async (): Promise<void> => {
    const searchBarQuery = localStorage.getItem('visenze-search-bar-query');
    const searchBarImage = localStorage.getItem('visenze-search-bar-image');
    const params: Record<string, any> = {
      ...searchSettings,
      q: searchBarQuery,
    };

    if (searchBarImage) {
      if (searchBarImage.startsWith('data')) {
        params.image = await dataURLtoBlob(searchBarImage);
      } else {
        params.img_url = searchBarImage;
      }
    }

    productSearch.multisearchByImage(params, handleSuccess, handleError);
  };

  useEffect(() => {
    (async (): Promise<void> => {
      await multisearchWithSearchBarDetails();
    })();

    // Allow search bar to reload search results when search bar query/image is updated
    const handleReloadEvent = async (): Promise<void> => {
      await multisearchWithSearchBarDetails();
    };
    document.addEventListener('reload-embedded-search-results', handleReloadEvent);

    return (): void => {
      document.removeEventListener('reload-embedded-search-results', handleReloadEvent);
    };
  }, []);

  if (!root || error) {
    return <></>;
  }

  return (
    <>
      <WidgetResultContext.Provider value={{ metadata, productResults }}>
        <div className='flex size-full flex-col bg-primary'>
          <div className='grid grid-cols-2 gap-x-2 gap-y-4 md:grid-cols-3 lg:grid-cols-4' data-pw='esr-product-result-grid'>
            {productResults.map((result, index) => (
              <div key={`${result.product_id}-${index}`} data-pw={`esr-product-result-card-${index + 1}`}>
                <Result
                  index={index}
                  result={result}
                />
              </div>
            ))}
          </div>
        </div>
      </WidgetResultContext.Provider>
    </>
  );
};

export default EmbeddedSearchResults;
