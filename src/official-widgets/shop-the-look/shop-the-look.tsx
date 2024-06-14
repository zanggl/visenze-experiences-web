import type { FC } from 'react';
import { useEffect, useRef, useState, useContext } from 'react';
import Slider from 'react-slick';
import type { Settings } from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import { Skeleton } from '@nextui-org/skeleton';
import type { WidgetClient, WidgetConfig } from '../../common/visenze-core';
import { RootContext } from '../../common/components/shadow-wrapper';
import { WidgetResultContext } from '../../common/types/contexts';
import Result from './components/Result';
import Footer from '../../common/components/Footer';
import useRecommendationSearch from '../../common/components/hooks/use-recommendation-search';
import PrevArrow from './components/PrevArrow';
import NextArrow from './components/NextArrow';
import useBreakpoint from '../../common/components/hooks/use-breakpoint';
import { WidgetBreakpoint } from '../../common/types/constants';

interface ShopTheLookProps {
  config: WidgetConfig;
  productSearch: WidgetClient;
  productId: string;
}

interface ObjectDot {
  index: number;
  top: number;
  left: number;
}

const ShopTheLook: FC<ShopTheLookProps> = ({ config, productSearch, productId }) => {
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

  const useSlideSettings = (): Settings => {
    const breakpoint = useBreakpoint();
    const isDesktop = breakpoint === WidgetBreakpoint.DESKTOP;
    const isTablet = breakpoint === WidgetBreakpoint.TABLET;
    let slidesToShow = 2.5;
    let slidesToScroll = 2;

    if (isDesktop) {
      slidesToShow = 4;
      slidesToScroll = 4;
    } else if (isTablet) {
      slidesToShow = 3.5;
      slidesToScroll = 3;
    }

    // Manually left align slick track if there are not enough products to show
    const slickTrack: HTMLDivElement | null | undefined = root?.querySelector('.slick-track');
    if (slickTrack) {
      if (productResults.length < slidesToShow) {
        slickTrack.classList.add('left-align-slick-track');
      } else {
        slickTrack.classList.remove('left-align-slick-track');
      }
    }

    return {
      className: 'slider',
      infinite: false,
      initialSlide: 0,
      slidesToScroll,
      slidesToShow,
      prevArrow: isDesktop ? <PrevArrow /> : <></>,
      nextArrow: isDesktop ? <NextArrow /> : <></>,
      variableWidth: false,
    };
  };

  const settings = useSlideSettings();

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
        {/* Widget Title */}
        <div className='widget-title py-2 text-center text-primary md:py-4'>Shop The Look</div>

        <div className='items-center justify-center md:flex md:flex-row md:gap-4 lg:gap-0'>
          {/* Reference Image */}
          <div className='px-1 md:w-7/20 lg:w-3/10'>
            <div className='relative'>
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
                  <div className={`rounded-full bg-white transition-all duration-300 group-hover:size-4 ${objectIndex === index ? 'size-4' : 'size-2'}`}></div>
                </button>
              ))}
              <Skeleton isLoaded={!!referenceImageUrl}>
                <img
                  ref={imageRef}
                  className='object-fit size-full'
                  src={referenceImageUrl}
                  onLoad={onImageLoad}
                />
              </Skeleton>
            </div>
          </div>

          {/* Product card carousel */}
          <div className='relative pr-1 pt-4 md:w-13/20 lg:w-7/10 lg:px-10'>
            <Slider {...settings}>
              {productResults.map((result, index) => (
                <div className='p-1 md:p-2' key={`${result.product_id}-${index}`}>
                  <Result
                    index={index}
                    result={result}
                  />
                </div>
              ))}
            </Slider>
          </div>
        </div>

        {/* ViSenze Footer */}
        <Footer className='bg-transparent py-2 md:py-8'/>
      </WidgetResultContext.Provider>
    </>
  );
};

export default ShopTheLook;
