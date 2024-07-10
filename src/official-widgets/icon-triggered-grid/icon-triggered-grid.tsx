import type { FC } from 'react';
import { useCallback, useContext, useEffect, useState } from 'react';
import { Button } from '@nextui-org/button';
import { Actions, Category, Labels } from '../../common/types/tracking-constants';
import { WidgetResultContext } from '../../common/types/contexts';
import useBreakpoint from '../../common/components/hooks/use-breakpoint';
import type { WidgetClient, WidgetConfig } from '../../common/visenze-core';
import { SortType, WidgetBreakpoint } from '../../common/types/constants';
import { RootContext } from '../../common/components/shadow-wrapper';
import ViSenzeModal from '../../common/components/modal/visenze-modal';
import useRecommendationSearch from '../../common/components/hooks/use-recommendation-search';
import IconTriggeredGridIcon from './components/IconTriggeredGridIcon';
import Footer from '../../common/components/Footer';
import Result from './components/Result';
import CloseIcon from '../../common/icons/CloseIcon';
import SortOptions from './components/SortOptions';
import FilterOptions from './components/FilterOptions';
import type { PriceFilter } from '../../common/types/filter';

export enum ScreenType {
  SORT = 'sort',
  FILTER = 'filter',
}

interface IconTriggeredGridProps {
  config: WidgetConfig;
  productSearch: WidgetClient;
  productId: string;
}

const IconTriggeredGrid: FC<IconTriggeredGridProps> = ({ config, productSearch, productId }) => {
  const breakpoint = useBreakpoint();
  const [dialogVisible, setDialogVisible] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [screen, setScreen] = useState<ScreenType | null>(null);
  const [sortType, setSortType] = useState<SortType>(SortType.RELEVANCE);
  const [categoryFilter, setCategoryFilter] = useState<Set<string>>(new Set());
  const [priceFilter, setPriceFilter] = useState<PriceFilter | null>(null);
  const [categorySet, setCategorySet] = useState<Set<string>>(new Set());
  const root = useContext(RootContext);

  const {
    productInfo,
    productResults,
    metadata,
    error,
  } = useRecommendationSearch({
    productSearch,
    config,
    productId,
    retryCount,
    sortType,
    priceFilter,
    categoryFilter,
  });

  const onModalClose = useCallback((): void => {
    setDialogVisible(false);
    setSortType(SortType.RELEVANCE);
    setCategoryFilter(new Set());
    setPriceFilter(null);
    setRetryCount(0);
    if (productResults.length > 0) {
      productSearch.send(Actions.CLOSE, {
        label: Labels.PAGE,
        metadata,
      });
    }
  }, [productResults]);

  // Retrieve categories from product results
  useEffect(() => {
    const newCategorySet: Set<string> = new Set();
    productResults.forEach((result) => {
      const categoryArr = result[config.displaySettings.productDetails.category];
      categoryArr.forEach((category: string) => {
        newCategorySet.add(category);
      });
    });

    setCategorySet((prev) => new Set([...prev, ...newCategorySet]));
  }, [productResults]);

  const onPopupIconClick = (): void => {
    productSearch.send(Actions.CLICK, {
      cat: Category.ENTRANCE,
      label: Labels.ICON,
    });
    setDialogVisible(true);
  };

  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);

  if (!root) {
    return <></>;
  }

  return (
    <WidgetResultContext.Provider
      value={{
        productResults,
        metadata,
      }}>
      <Button isIconOnly radius='full' size='sm' className='bg-white' onClick={onPopupIconClick}>
        <IconTriggeredGridIcon className='size-6'/>
      </Button>

      <ViSenzeModal open={dialogVisible} layout={breakpoint} onClose={onModalClose}>
        <div className='relative flex size-full flex-col bg-primary lg:flex-row lg:justify-between lg:divide-x-1'>
          {/* Close Button */}
          <Button isIconOnly className='absolute right-3 top-3 z-10 border-none bg-transparent' onClick={onModalClose} data-pw='itg-close-button'>
            <CloseIcon className='size-6'/>
          </Button>

          <div className='flex flex-col border-none p-4 lg:w-3/10 lg:px-10 lg:py-6'>
            {/* Widget Title */}
            <div className='flex items-center'>
              <div className='widget-title text-primary' data-pw='itg-widget-title'>You may also like</div>
            </div>

            {/* Reference Product */}
            {
              productInfo
              && <div className='pt-4 lg:pt-8' data-pw='itg-reference-product'>
                <Result
                  index={0}
                  result={productInfo}
                  isReferenceProduct={true}
                />
              </div>
            }

            {/* ViSenze Footer desktop */}
            <Footer className='mt-auto hidden bg-transparent lg:flex' dataPw='itg-visenze-footer-desktop'/>
          </div>

          <div className='relative flex w-full flex-col bg-primary px-6 pb-4 lg:w-7/10 lg:pt-[6.5%]'>
            <div className='flex items-center pb-4'>
              {/* Sort Type */}
              <div className='text-lg text-primary'>Sort: {sortType}</div>
              {/* Sort and Filter buttons */}
              <div className='ml-auto flex gap-2'>
                <Button
                  className='rounded bg-black bg-buttonPrimary'
                  size='sm'
                  radius='none'
                  onClick={() => setScreen(ScreenType.SORT)}
                  data-pw='itg-sort-button'
                >
                  <span className='calls-to-action-text text-buttonPrimary'>Sort</span>
                </Button>
                <Button
                  className='rounded bg-black bg-buttonPrimary'
                  size='sm'
                  radius='none'
                  onClick={() => setScreen(ScreenType.FILTER)}
                  data-pw='itg-filter-button'
                >
                  <span className='calls-to-action-text text-buttonPrimary'>Filter</span>
                </Button>
              </div>
            </div>

            {/* Product Result Grid */}
            <div className='grid grid-cols-2 gap-x-2 gap-y-4 overflow-y-auto lg:grid-cols-3' data-pw='itg-product-result-grid'>
              {productResults.map((result, index) => (
                <div key={`${result.product_id}-${index}`} data-pw={`itg-product-result-card-${index + 1}`}>
                  <Result
                    index={index}
                    result={result}
                    isReferenceProduct={false}
                  />
                </div>
              ))}
            </div>

            {/* ViSenze Footer mobile */}
            <Footer className='mt-auto bg-transparent pt-4 lg:hidden' dataPw='itg-visenze-footer-mobile'/>

            {/* Sort Options Desktop */}
            {
              screen === ScreenType.SORT && breakpoint === WidgetBreakpoint.DESKTOP
              && <SortOptions
                className='absolute left-0 top-14 hidden h-9/10 w-full flex-col justify-between gap-4 px-8 pb-8 pt-4 text-primary lg:flex'
                sortType={sortType}
                setSortType={setSortType}
                setScreen={setScreen}
              />
            }
            {/* Filter Options Desktop */}
            {
              screen === ScreenType.FILTER && breakpoint === WidgetBreakpoint.DESKTOP
              && <FilterOptions
                className='absolute left-0 top-14 hidden h-9/10 w-full flex-col justify-between gap-4 px-8 pb-8 pt-4 text-primary lg:flex'
                categorySet={categorySet}
                priceFilter={priceFilter}
                setPriceFilter={setPriceFilter}
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
                productResults={productResults}
                setScreen={setScreen}
              />
            }
          </div>
        </div>
        <>
          {/* Sort/Filter Options Mobile & Tablet */}
          {
            breakpoint === WidgetBreakpoint.MOBILE
            && <ViSenzeModal open={!!screen} layout='nested_mobile' onClose={() => setScreen(null)}>
            <>
              {
                screen === ScreenType.SORT
                && <SortOptions
                    className='flex h-full flex-col justify-between'
                    sortType={sortType}
                    setSortType={setSortType}
                    setScreen={setScreen}
                  />
              }
            </>
            <>
              {
                screen === ScreenType.FILTER
                && <FilterOptions
                  className='flex h-full flex-col justify-between'
                  categorySet={categorySet}
                  priceFilter={priceFilter}
                  setPriceFilter={setPriceFilter}
                  categoryFilter={categoryFilter}
                  setCategoryFilter={setCategoryFilter}
                  productResults={productResults}
                  setScreen={setScreen}
                />
              }
            </>
            </ViSenzeModal>
          }
        </>
      </ViSenzeModal>
    </WidgetResultContext.Provider>
  );
};

export default IconTriggeredGrid;
