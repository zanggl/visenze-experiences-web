import type { FC } from 'react';
import { useEffect, useState, useContext } from 'react';
import { Button } from '@nextui-org/button';
import type { WidgetClient, WidgetConfig } from '../../common/visenze-core';
import { RootContext } from '../../common/components/shadow-wrapper';
import {
  WidgetResultContext,
  WidgetDataContext,
} from '../../common/types/contexts';
import InstagramImage from './components/InstagramImage';
import Footer from '../../common/components/Footer';
import useRecommendationSearch from '../../common/components/hooks/use-recommendation-search';
import ViSenzeModal from '../../common/components/modal/visenze-modal';
import useBreakpoint from '../../common/components/hooks/use-breakpoint';
import CloseIcon from '../../common/icons/CloseIcon';
import HotspotContainer from '../../common/components/hotspots/hotspot-container';
import type { BoxData, ProcessedProduct } from '../../common/types/product';
import { getFlattenProducts } from '../../common/utils';
import HotspotRecommendations from './components/HotspotRecommendations';
import { CroppingProvider } from '../../common/types/providers';

interface ShoppableInstagramFeedProps {
  config: WidgetConfig;
  productSearch: WidgetClient;
}

const ShoppableInstagramFeed: FC<ShoppableInstagramFeedProps> = ({ config, productSearch }) => {
  const breakpoint = useBreakpoint();
  const root = useContext(RootContext);
  const [retryCount, setRetryCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [activeProductId, setActiveProductId] = useState('');
  const [activeImageUrl, setActiveImageUrl] = useState('');
  const [boxData, setBoxData] = useState<BoxData | undefined>();
  const [galleryProducts, setGalleryProducts] = useState<ProcessedProduct[]>([]);
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const { appSettings } = useContext(WidgetDataContext);

  const {
    objects,
    productResults,
    productTypes,
    metadata,
    error,
  } = useRecommendationSearch({
    productSearch,
    config,
    retryCount,
    productId: activeProductId,
  });

  // const objectResults = useMemo(() => {
  //   const processedProducts: ProcessedProduct[][] = [];
  //   objects.forEach((object) => {
  //     processedProducts.push(getFlattenProducts(object.result));
  //   });
  //   return processedProducts;
  // }, [objects]);

  const instagramImageClickHandler = (result: ProcessedProduct): void => {
    setActiveProductId(result.product_id);
    setActiveImageUrl(result.im_url);
    setOpenModal(true);
  };

  const onCloseHandler = (): void => {
    setOpenModal(false);
    setActiveProductId('');
  };

  useEffect(() => {
    if (error) {
      setRetryCount(retryCount + 1);
    } else {
      setRetryCount(0);
    }
  }, [error]);

  useEffect(() => {
    const fetchGalleryProducts = async (): Promise<void> => {
      const response = await fetch(`${appSettings.endpoint}/v1/product/linked/gallery/browse?placement_id=${appSettings.placementId}&app_key=${appSettings.appKey}&limit=10`);
      const data = await response.json();
      setGalleryProducts(getFlattenProducts(data.result));
      setIsLoading(false);
    };

    fetchGalleryProducts();
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
      <WidgetResultContext.Provider value={{ metadata, productResults, productTypes }}>
        <div className='bg-primary'>
          {/* Product Image Grid */}
          <div className='grid grid-cols-3 gap-0.5'>
            {galleryProducts.map((result, index) => (
              <div key={`${result.im_url}-${index}`}>
                <InstagramImage
                  index={index}
                  result={result}
                  onClickHandler={instagramImageClickHandler}
                />
              </div>
            ))}
          </div>

          {/* ViSenze Footer */}
          <Footer className='bg-transparent py-4 md:py-8'/>
        </div>

        {/* Modal with hotspots on image */}
        <CroppingProvider boxData={boxData} setBoxData={setBoxData}>
          <ViSenzeModal open={openModal} onClose={onCloseHandler} layout={breakpoint} className='left-[unset] top-[unset] h-1/2 w-7/10 rounded-xl'>
            <div className='flex size-full flex-col bg-primary pt-1/5'>
              <Button isIconOnly className='absolute right-2 top-2 bg-transparent' onClick={onCloseHandler} data-pw='sif-close-button'>
                <CloseIcon className='size-6'/>
              </Button>
                {
                  productTypes.length > 0
                  && <HotspotContainer referenceImage={activeImageUrl} noSelectedHotspot={true} handleBoxClick={() => setOpenDrawer(true)}/>
                }
            </div>
          </ViSenzeModal>
          <HotspotRecommendations openDrawer={openDrawer} setOpenDrawer={setOpenDrawer} objects={objects} activeImageUrl={activeImageUrl} />
        </CroppingProvider>
      </WidgetResultContext.Provider>
    </>
  );
};

export default ShoppableInstagramFeed;
