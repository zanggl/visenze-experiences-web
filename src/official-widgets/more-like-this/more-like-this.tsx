import type { FC } from 'react';
import { useEffect, useState, useContext } from 'react';
import Slider from 'react-slick';
import type { Settings } from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
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

interface MoreLikeThisProps {
  config: WidgetConfig;
  productSearch: WidgetClient;
  productId: string;
}

const MoreLikeThis: FC<MoreLikeThisProps> = ({ config, productSearch, productId }) => {
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

    // Manually center slick track if there are not enough products to show
    const slickTrack: HTMLDivElement | null | undefined = root?.querySelector('.slick-track');
    if (slickTrack) {
      if (productResults.length < slidesToShow) {
        slickTrack.classList.add('center-slick-track');
      } else {
        slickTrack.classList.remove('center-slick-track');
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
        <div className='widget-title py-2 text-center text-primary md:py-4'>More like this</div>

        {/* Product card carousel */}
        <div className='relative pr-1 lg:px-10'>
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

        {/* ViSenze Footer */}
        <Footer className='bg-transparent py-2 md:py-8'/>
      </WidgetResultContext.Provider>
    </>
  );
};

export default MoreLikeThis;
