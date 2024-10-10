import type { CSSProperties, FC } from 'react';
import { useEffect, useState, useContext } from 'react';
import { useIntl } from 'react-intl';
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
  const [cardBorderRadius, setCardBorderRadius] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const intl = useIntl();

  const { productResults, metadata, error } = useRecommendationSearch({
    productSearch,
    config,
    productId,
    retryCount,
  });

  const getProductCardCssConfig = (): CSSProperties => {
    const cssConfig = {} as CSSProperties;
    if (config.customizations.productSlider?.borderRadius
      && config.customizations.productSlider?.borderRadius !== 0) {
      cssConfig.borderRadius = `${config.customizations.productSlider?.borderRadius}px`;
    }
    if (config.customizations.productSlider?.contentPadding
      && config.customizations.productSlider?.contentPadding !== 0) {
      cssConfig.padding = `${config.customizations.productSlider?.contentPadding}px`;
    }
    if (config.customizations.productSlider?.marginVertical
      && config.customizations.productSlider?.marginVertical !== 0) {
      cssConfig.marginTop = `${config.customizations.productSlider?.marginVertical}px`;
      cssConfig.marginBottom = `${config.customizations.productSlider?.marginVertical}px`;
    }
    if (config.customizations.productSlider?.marginHorizontal
      && config.customizations.productSlider?.marginHorizontal !== 0) {
      cssConfig.marginLeft = `${config.customizations.productSlider?.marginHorizontal}px`;
      cssConfig.marginRight = `${config.customizations.productSlider?.marginHorizontal}px`;
    }
    return cssConfig;
  };

  const getProductGridStyles = (): string => {
    if (config.customizations.productSlider) {
      return (
        `grid-cols-${config.customizations.productSlider.display.mobile.slideToShow} `
        + `md:grid-cols-${config.customizations.productSlider.display.tablet.slideToShow} `
        + `lg:grid-cols-${config.customizations.productSlider.display.desktop.slideToShow}`
      );
    }
    return '';
  };

  useEffect(() => {
    if (error) {
      setRetryCount(retryCount + 1);
    } else {
      setRetryCount(0);
    }
  }, [error]);

  useEffect(() => {
    if (config.customizations.productSlider?.borderRadius
      && config.customizations.productSlider?.borderRadius !== 0 && isLoading) {
      setCardBorderRadius(`${config.customizations.productSlider?.borderRadius}px`);
    }
    setIsLoading(false);
  }, []);

  if (!root || isLoading) {
    return <></>;
  }

  if (error) {
    return (
      <div className='flex h-60 flex-col items-center justify-center gap-4'>
        <span className='text-md font-bold'>{intl.formatMessage({ id: 'embeddedGrid.errorMessage.part1' })}</span>
        <span className='text-sm'>{intl.formatMessage({ id: 'embeddedGrid.errorMessage.part2' })}</span>
      </div>
    );
  }

  return (
    <>
      <WidgetResultContext.Provider value={{ metadata, productResults }}>
        <div className='bg-primary'>
          {/* Widget Title */}
          <div className='widget-title py-2 text-center text-primary md:py-4' data-pw='eg-widget-title'>
            {intl.formatMessage({ id: 'embeddedGrid.title' })}
          </div>

          {/* Product result grid */}
          <div
            className={`grid gap-x-2 gap-y-4 ${getProductGridStyles() !== '' ? getProductGridStyles() : 'grid-cols-2 md:grid-cols-5'}`}
            data-pw='eg-product-result-grid'>
            {productResults.map((result, index) => (
              <div
                className={`${cardBorderRadius !== '' ? 'border-2' : ''}`}
                key={`${result.product_id}-${index}`}
                data-pw={`eg-product-result-card-${index + 1}`}
                style={getProductCardCssConfig()}
              >
                <Result index={index} result={result} />
              </div>
            ))}
          </div>

          {/* ViSenze Footer */}
          <Footer className='bg-transparent py-4 md:py-8' dataPw='eg-visenze-footer' />
        </div>
      </WidgetResultContext.Provider>
    </>
  );
};

export default EmbeddedGrid;
