import type { FC } from 'react';
import { useCallback, useContext, useEffect, useState } from 'react';
import { Button } from '@nextui-org/button';
import { Actions, Category, Labels } from '../../common/types/tracking-constants';
import { WidgetResultContext } from '../../common/types/contexts';
import useBreakpoint from '../../common/components/hooks/use-breakpoint';
import type { WidgetClient, WidgetConfig } from '../../common/visenze-core';
import { SortType } from '../../common/types/constants';
import { RootContext } from '../../common/components/shadow-wrapper';
import ViSenzeModal from '../../common/components/modal/visenze-modal';
import useRecommendationSearch from '../../common/components/hooks/use-recommendation-search';
import IconTriggeredGridIcon from '../../common/icons/IconTriggeredGridIcon';
import Footer from '../../common/components/Footer';
import Result from './components/Result';
import CloseIcon from '../../common/icons/CloseIcon';
import SortOptions from './components/SortOptions';

interface IconTriggeredGridProps {
  config: WidgetConfig;
  productSearch: WidgetClient;
  productId: string;
}

const IconTriggeredGrid: FC<IconTriggeredGridProps> = ({ config, productSearch, productId }) => {
  const breakpoint = useBreakpoint();
  const [dialogVisible, setDialogVisible] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [enableSortOptions, setEnableSortOptions] = useState(false);
  const [sortType, setSortType] = useState<SortType>(SortType.RELEVANCE);
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
  });

  const resetData = (): void => {
    setRetryCount(0);
  };

  const onModalClose = useCallback((): void => {
    setDialogVisible(false);
    if (productResults.length > 0) {
      productSearch.send(Actions.CLOSE, {
        label: Labels.PAGE,
        metadata,
      });
    }

    setTimeout(() => {
      resetData();
    }, 300);
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
        <div className='relative flex size-full flex-col lg:flex-row lg:justify-between lg:divide-x-1'>
          {/* Close Button */}
          <Button isIconOnly className='absolute right-2 top-3 border-none bg-transparent' onClick={onModalClose} data-pw='itg-close-button'>
            <CloseIcon className='size-6'/>
          </Button>

          <div className='flex flex-col p-4 lg:w-3/10 lg:px-10 lg:py-6'>
            {/* Widget Title */}
            <div className='flex items-center'>
              <div className='widget-title text-primary'>You may also like</div>
            </div>

            {/* Reference Product */}
            {
              productInfo
              && <div className='pt-4 lg:pt-8'>
                <Result
                  index={0}
                  result={productInfo}
                  isReferenceProduct={true}
                />
              </div>
            }

            {/* ViSenze Footer */}
            <Footer className='mt-auto hidden bg-transparent lg:flex'/>
          </div>

          <div className='relative flex w-full flex-col px-4 pb-2 lg:w-7/10 lg:pt-[7%]'>
            {/* Sort Type and Button */}
            <div className='flex items-center pb-4'>
              <div className='calls-to-action-text text-primary'>Sort: {sortType}</div>
              <Button
                className='ml-auto rounded bg-black bg-buttonPrimary'
                size='sm'
                radius='none'
                onClick={() => setEnableSortOptions(true)}
              >
                <span className='calls-to-action-text text-buttonPrimary'>Sort</span>
              </Button>
            </div>

            {/* Product Result Grid */}
            <div className='grid grid-cols-2 gap-x-2 gap-y-4 overflow-y-auto lg:grid-cols-3'>
              {productResults.map((result, index) => (
                <div key={`${result.product_id}-${index}`}>
                  <Result
                    index={index}
                    result={result}
                    isReferenceProduct={false}
                  />
                </div>
              ))}
            </div>

            {/* Sort Options */}
            {
              enableSortOptions
              && <SortOptions sortType={sortType} setSortType={setSortType} setEnableSortOptions={setEnableSortOptions}/>
            }
          </div>
        </div>
      </ViSenzeModal>
    </WidgetResultContext.Provider>
  );
};

export default IconTriggeredGrid;
