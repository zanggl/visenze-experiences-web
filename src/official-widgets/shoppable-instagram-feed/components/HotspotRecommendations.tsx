import type { FC } from 'react';
import { memo, useContext, useMemo } from 'react';
import { Button } from '@nextui-org/button';
import type { ObjectProductResponse } from 'visearch-javascript-sdk';
import ViSenzeModal from '../../../common/components/modal/visenze-modal';
import { CroppingContext, WidgetResultContext } from '../../../common/types/contexts';
import { getFlattenProducts } from '../../../common/utils';
import Result from './Result';
import ImageCropThumbnail from './ImageCropThumbnail';

interface HotspotRecommendationsProps {
  objects: ObjectProductResponse[];
  openDrawer: boolean;
  setOpenDrawer: (openDrawer: boolean) => void;
  activeImageUrl: string;
}

const HotspotRecommendations: FC<HotspotRecommendationsProps> = ({ objects, openDrawer, setOpenDrawer, activeImageUrl }) => {
  const { productTypes } = useContext(WidgetResultContext);
  const { selectedHotspot, setSelectedHotspot } = useContext(CroppingContext) ?? {};

  const closeDrawerHandler = (): void => {
    setOpenDrawer(false);
    setSelectedHotspot?.(-1);
  };

  const results = useMemo(() => {
    if (selectedHotspot === -1 || objects.length === 0) return [];
    return getFlattenProducts(objects[selectedHotspot].result);
  }, [objects, selectedHotspot]);

  return (
    <ViSenzeModal open={openDrawer} onClose={closeDrawerHandler} layout='mobile' className='bottom-0 top-[unset] h-9/10 w-full rounded-t-xl'>
      <div className='flex size-full flex-col bg-primary'>
        <Button className='flex flex-shrink-0 justify-center bg-primary' size='sm' onClick={closeDrawerHandler}>
          <div className='h-1 w-12 bg-gray-400'></div>
        </Button>
        <span className='text-center font-bold'>In this photo</span>
        <div className='flex justify-center gap-x-3 py-3'>
          {
            productTypes?.map((productType, index) => (
              <div key={index}>
                <ImageCropThumbnail imageUrl={activeImageUrl} box={productType.box} index={index}/>
              </div>
            ))
          }
        </div>
        <div className='grid grid-cols-2 gap-x-2 gap-y-4 overflow-y-auto px-2 pb-4 md:grid-cols-5' data-pw='sif-product-result-grid'>
          {
            results.map((result, index) => (
              <div key={`${result.product_id}-${index}`} data-pw={`sif-product-result-card-${index + 1}`}>
                <Result
                  index={index}
                  result={result}
                />
              </div>
            ))
          }
        </div>
        {
          results.length === 0
          && <div className='flex size-full items-center justify-center'>There are no results for this hotspot</div>
        }
      </div>
    </ViSenzeModal>
  );
};

export default memo(HotspotRecommendations);
