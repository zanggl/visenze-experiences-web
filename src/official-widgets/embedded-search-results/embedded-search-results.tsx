import type { ChangeEvent, ReactElement } from 'react';
import { useEffect, useContext, useState } from 'react';
import type { ProductSearchResponse, Facet } from 'visearch-javascript-sdk';
import { Checkbox } from '@nextui-org/checkbox';
import { Slider } from '@nextui-org/slider';
import { Accordion, AccordionItem } from '@nextui-org/accordion';
import { Button } from '@nextui-org/button';
import { useIntl } from 'react-intl';
import { WidgetDataContext, WidgetResultContext } from '../../common/types/contexts';
import { RootContext } from '../../common/components/shadow-wrapper';
import { getFacetNameByKey, getFacets, getFilterQueries, getFlattenProducts, getTitleCase } from '../../common/utils';
import type { ProcessedProduct } from '../../common/types/product';
import { Category } from '../../common/types/tracking-constants';
import Result from './components/Result';
import LeftChevronIcon from '../../common/icons/LeftChevronIcon';
import type { FacetType } from '../../common/types/constants';

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
  const [accordionKey, setAccordionKey] = useState(0);
  const [selectedFilters, setSelectedFilters] = useState<Record<FacetType, any>>(defaultFilters);
  const [metadata, setMetadata] = useState<Record<string, any>>({});
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

  const showFacetValues = (facet: Facet): ReactElement | ReactElement[] => {
    const priceRangeChangeHandler = (value: number | number[]): void => {
      setSelectedFilters((curFilters) => {
        if (Array.isArray(value)) {
          curFilters.price = value;
        } else {
          curFilters.price = [value, value];
        }
        return curFilters;
      });
    };

    if (facet.range) {
      return <Slider
        label='Price Range'
        color='secondary'
        minValue={facet.range.min}
        maxValue={facet.range.max}
        defaultValue={[facet.range.min, facet.range.max]}
        onChange={priceRangeChangeHandler}
      />;
    }

    const updateFiltersHandler = (event: ChangeEvent<HTMLInputElement>): void => {
      const facetName = getFacetNameByKey(productDetails, facet.key) as FacetType;
      setSelectedFilters((currentFilters) => {
        const newSet = new Set(currentFilters[facetName]);
        if (event.target.checked) {
          newSet.add(event.target.value);
        } else {
          newSet.delete(event.target.value);
        }

        currentFilters[facetName] = newSet;
        return currentFilters;
      });
    };

    return facet.items.map((item) => (
      <Checkbox
        key={item.value}
        value={item.value}
        color='secondary'
        onChange={updateFiltersHandler}
      >
        <span className='calls-to-action-text'>{item.value}</span>
      </Checkbox>
    ));
  };

  const onApplyHandler = (): void => {
    multisearchWithSearchBarDetails();
  };

  useEffect(() => {
    multisearchWithSearchBarDetails();

    // Allow search bar to reload search results when search bar query/image is updated
    const handleReloadEvent = async (): Promise<void> => {
      setAccordionKey((curKey) => curKey + 1);
      multisearchWithSearchBarDetails(true);
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
        <div className='flex size-full gap-x-2 bg-primary'>
          {/* Filters/Facets */}
          {
            facets
            && <div className='flex w-1/5 flex-col gap-y-4'>
              <Accordion key={accordionKey} className='divide-y-1' selectionMode='multiple'>
                {
                  facets.map((facet) => (
                    <AccordionItem
                      key={facet.key}
                      title={getTitleCase(getFacetNameByKey(productDetails, facet.key))}
                      indicator={<LeftChevronIcon className='size-4'/>}
                    >
                      <div className='flex flex-col gap-y-2 px-4 pb-4'>
                        {showFacetValues(facet)}
                      </div>
                    </AccordionItem>
                  ))
                }
              </Accordion>
              {/* Apply button */}
              <Button className='rounded border bg-buttonPrimary px-14 text-white' radius='none' data-pw='esr-apply-filter-button' onClick={onApplyHandler}>
                <span className='text-buttonPrimary'>
                  {intl.formatMessage({ id: 'embeddedSearchResults.apply' })}
                </span>
              </Button>
            </div>
          }
          {/* Product Result Grid */}
          <div className='grid w-4/5 grid-cols-2 gap-x-2 gap-y-4 md:grid-cols-3 lg:grid-cols-4'
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
        </div>
      </WidgetResultContext.Provider>
    </>
  );
};

export default EmbeddedSearchResults;
