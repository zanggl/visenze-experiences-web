import type { ProductDetailField, WidgetClient, WidgetConfig } from '../visenze-core';
import { Actions } from '../types/tracking-constants';
import type { ResultLogic } from '../types/logic';
import type { ProcessedProduct } from '../types/product';
import { getURL } from '../utils';

interface ResultLogicProps {
  displaySettings: WidgetConfig['displaySettings'];
  productSearch: WidgetClient;
  trackingMeta: Record<string, any>;
  isRecommendation: boolean;
  index: number;
  onProductClick?: (result: ProcessedProduct, productTrackingMeta: Record<string, any>) => void;
  result: ProcessedProduct;
}

const ResultLogicImpl = ({
  displaySettings,
  productSearch,
  trackingMeta,
  isRecommendation,
  index,
  onProductClick,
  result,
}: ResultLogicProps): ResultLogic => {
  const getValue = (key: ProductDetailField): any => {
    return result[displaySettings.productDetails[key]];
  };

  const productTrackingMeta: Record<string, any> = {
    ...trackingMeta,
    pid: result.product_id,
    pos: index + 1,
  };

  const onClick = (event: any): void => {
    event.stopPropagation();
    event.preventDefault();
    productSearch.send(Actions.PRODUCT_CLICK, productTrackingMeta);
    if (onProductClick && typeof onProductClick === 'function') {
      onProductClick(result, productTrackingMeta);
    } else {
      const url = getURL(getValue('productUrl'), productTrackingMeta, isRecommendation);
      window.open(url?.href, '_self');
    }
  };

  return {
    productTrackingMeta,
    onClick,
  };
};

export default ResultLogicImpl;
