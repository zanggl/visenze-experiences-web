import { createContext } from 'react';
import type { Facet, ProductType } from 'visearch-javascript-sdk';
import { WidgetType, type WidgetClient, type WidgetConfig } from '../visenze-core';
import DEFAULT_CONFIGS from '../../default-configs';
import getWidgetClient from '../client/product-search';
import type { SearchImage } from './image';
import type { BoxData, ProcessedProduct } from './product';

interface WidgetData extends WidgetConfig {
  productSearch: WidgetClient;
  fieldMappings?: Record<string, string>;
  widgetType: WidgetType;
  version: string;
}

export interface WidgetResultContextValue {
  productTypes?: ProductType[];
  image?: SearchImage;
  imageId?: string;
  productInfo?: ProcessedProduct;
  facets?: Facet[];
  productResults: ProcessedProduct[];
  metadata: Record<string, any>;
  autocompleteResults?: string[];
}

export interface CroppingContextValue {
  selectedHotspot: number;
  setSelectedHotspot: (selectedHotspot: number) => void;
  boxData?: BoxData;
  setBoxData?: (data: BoxData) => void;
}

export const WidgetDataContext = createContext<WidgetData>({
  ...DEFAULT_CONFIGS,
  productSearch: getWidgetClient({
    config: DEFAULT_CONFIGS,
    widgetType: undefined,
    widgetVersion: '0.0.0',
    widgetDirectory: '/',
    deployTypeId: 0,
  }),
  widgetType: WidgetType.CAMERA_SEARCH,
  version: '0.0.0',
});

export const WidgetResultContext = createContext<WidgetResultContextValue>({
  productResults: [],
  metadata: {},
});

export const CroppingContext = createContext<CroppingContextValue>({
  selectedHotspot: -1,
  setSelectedHotspot: () => {},
});
