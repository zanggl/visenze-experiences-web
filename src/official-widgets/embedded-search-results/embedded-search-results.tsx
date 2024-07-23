import type { ReactElement } from 'react';
import { useEffect, useContext, useState } from 'react';
import type { ProductSearchResponse, Facet } from 'visearch-javascript-sdk';
import { Button } from '@nextui-org/button';
import { useIntl } from 'react-intl';
import { WidgetDataContext, WidgetResultContext } from '../../common/types/contexts';
import { RootContext } from '../../common/components/shadow-wrapper';
import { getFacets, getFilterQueries, getFlattenProducts } from '../../common/utils';
import type { ProcessedProduct } from '../../common/types/product';
import { Category } from '../../common/types/tracking-constants';
import Result from './components/Result';
import type { FacetType } from '../../common/types/constants';
import FilterOptions from './components/FilterOptions';
import ViSenzeModal from '../../common/components/modal/visenze-modal';

const EmbeddedSearchResults = (): ReactElement => {
  const { productSearch, searchSettings, displaySettings } = useContext(WidgetDataContext);
  const { productDetails } = displaySettings;
  const [productResults, setProductResults] = useState<ProcessedProduct[]>([]);
  const [facets, setFacets] = useState<Facet[]>([]);
  const defaultFilters = {
    price: [],
    category: new Set<string>(),
    gender: new Set<string>(),
    brand: new Set<string>(),
    sizes: new Set<string>(),
    colors: new Set<string>(),
  };
  const [filterOptionsKey, setFilterOptionsKey] = useState(0);
  const [selectedFilters, setSelectedFilters] = useState<Record<FacetType, any>>(defaultFilters);
  const [showMobileFilterOptions, setShowMobileFilterOptions] = useState(false);
  const [metadata, setMetadata] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const root = useContext(RootContext);
  const intl = useIntl();

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
      if (facets.length === 0 && res.facets) {
        setFacets(res.facets);
      }
      setIsLoading(false);
    }
  };

  const multisearchWithSearchBarDetails = (fromReload = false): void => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const searchBarQuery = urlSearchParams.get('searchBarQuery');
    const searchBarImageId = urlSearchParams.get('searchBarImageId');
    const params: Record<string, any> = {
      ...searchSettings,
    };

    if (searchBarQuery) {
      params.q = searchBarQuery;
    }
    if (searchBarImageId) {
      params.im_id = searchBarImageId;
    }

    params.facets = getFacets(productDetails);
    params.facets_show_count = true;

    if (fromReload) {
      setSelectedFilters(defaultFilters);
    } else {
      params.filters = getFilterQueries(productDetails, selectedFilters);
    }

    productSearch.multisearchByImage(params, handleSuccess, handleError);
  };

  const onApplyHandler = (): void => {
    setShowMobileFilterOptions(false);
    multisearchWithSearchBarDetails();
  };

  useEffect(() => {
    multisearchWithSearchBarDetails();

    // Allow search bar to reload search results when search bar query/image is updated
    const handleReloadEvent = async (): Promise<void> => {
      setFilterOptionsKey((curKey) => curKey + 1);
      multisearchWithSearchBarDetails(true);
    };
    document.addEventListener('reload-embedded-search-results', handleReloadEvent);

    return (): void => {
      document.removeEventListener('reload-embedded-search-results', handleReloadEvent);
    };
  }, []);

  if (!root || error || isLoading) {
    return <></>;
  }

  return (
    <>
      <WidgetResultContext.Provider value={{ metadata, productResults }}>
        <div className='flex size-full flex-col gap-2 bg-primary md:flex-row'>
          {/* Filter Section Tablet & Desktop */}
          {
            facets
            && <div className='hidden w-1/4 flex-col gap-y-4 md:flex'>
              <FilterOptions
                key={filterOptionsKey}
                facets={facets}
                setSelectedFilters={setSelectedFilters}
                onApplyHandler={onApplyHandler}
              />
            </div>
          }
          {/* Filter Section Mobile */}
          <Button className='w-1/5 self-end rounded border bg-buttonPrimary text-white md:hidden'
                  radius='none' data-pw='esr-filter-button' onClick={() => setShowMobileFilterOptions(true)}>
            <span className='calls-to-action-text text-buttonPrimary'>
              {intl.formatMessage({ id: 'embeddedSearchResults.filter' })}
            </span>
          </Button>
          <ViSenzeModal open={showMobileFilterOptions} layout='nested_mobile' onClose={() => setShowMobileFilterOptions(false)}>
            <FilterOptions
              key={filterOptionsKey}
              facets={facets}
              setSelectedFilters={setSelectedFilters}
              onApplyHandler={onApplyHandler}
            />
          </ViSenzeModal>
          {/* Product Result Grid */}
          {
            productResults.length > 0
            ? <div className='grid grid-cols-2 gap-x-2 gap-y-4 md:w-3/4 md:grid-cols-3 lg:grid-cols-4'
                 data-pw='esr-product-result-grid'>
              {productResults.map((result, index) => (
                <div key={`${result.product_id}-${index}`} data-pw={`esr-product-result-card-${index + 1}`}>
                  <Result
                    index={index}
                    result={result}
                  />
                </div>
              ))}
            </div>
            : <div className='flex flex-col gap-y-2 py-24 text-center md:w-3/4'>
                <p className='calls-to-action-text font-semibold'>No Results Found</p>
                <p className='calls-to-action-text'>We could not find any products matching your search.</p>
              </div>
          }
        </div>
      </WidgetResultContext.Provider>
    </>
  );
};

export default EmbeddedSearchResults;
