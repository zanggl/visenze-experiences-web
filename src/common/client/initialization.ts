import type { WidgetType, WidgetClient, WidgetConfig } from '../visenze-core';
import DEFAULT_CONFIGS from '../../default-configs';
import getWidgetClient from './product-search';

export interface WidgetInitResult {
  widgetClient: WidgetClient;
  config: WidgetConfig;
  fieldMappings: Record<string, string>;
}

export function deepMerge<T extends Record<string, any> | undefined | null>(overrides: any, base: T): T {
  if (overrides === null || typeof overrides === 'undefined') {
    return base;
  }

  if (base === null || typeof base === 'undefined') {
    return overrides as T;
  }

  const result: Record<string, any> = {};

  for (const [key, val] of Object.entries(base)) {
    if (key in overrides) {
      if (Array.isArray(val) && Array.isArray(overrides[key])) {
        result[key] = overrides[key];
      } else if (typeof val === 'object' && typeof overrides[key] === 'object') {
        result[key] = deepMerge(overrides[key], val);
      } else {
        result[key] = overrides[key];
      }
    } else {
      result[key] = val;
    }
  }

  for (const [key, val] of Object.entries(overrides)) {
    if (!(key in result)) {
      result[key] = val;
    }
  }

  return result as T;
}

const isPlacementSkippable = (placementId: number | string | undefined): boolean => {
  if (!placementId) {
    return true;
  }
  let placementsToSkip: string[] = [];
  const placementsToSkipString = new URLSearchParams(window.location.search).get('visenzeSkipPlacements');
  if (placementsToSkipString) {
    placementsToSkip = placementsToSkipString.split(',').map((id) => id.trim());
  }
  return placementsToSkip.includes(placementId.toString());
};

export const setCssVariables = (config: WidgetConfig): void => {
  if (config.customizations) {
    const { fonts, colours } = config.customizations;
    const root = document.querySelector(':root') as HTMLElement;

    for (const [deviceType, obj] of Object.entries(fonts)) {
      for (const [targetElement, font] of Object.entries(obj)) {
        root.style.setProperty(
          `--widget-${deviceType}-${targetElement}-fontSize`,
          font.fontSize.toString() + 'px',
        );
        root.style.setProperty(`--widget-${deviceType}-${targetElement}-fontWeight`, font.fontWeight.toString());
      }
    }

    for (const [colourType, obj] of Object.entries(colours)) {
      for (const [colourName, colourNameValue] of Object.entries(obj)) {
        root.style.setProperty(`--widget-${colourType}-${colourName}`, colourNameValue);
      }
    }
  }
};

/*
 * Populate product details with alias names in field mappings
 * Assign the alias names to attrs_to_get in searchSettings
 */
const populateProductDetailsAndAttrsToGet = (config: WidgetConfig, fieldMappings: Record<string, string>): WidgetConfig => {
  config.displaySettings.productDetails.mainImageUrl = fieldMappings['main_image_url'] || '';
  config.displaySettings.productDetails.productUrl = fieldMappings['product_url'] || '';
  config.displaySettings.productDetails.title = fieldMappings['title'] || '';
  config.displaySettings.productDetails.price = fieldMappings['price'] || '';
  config.displaySettings.productDetails.originalPrice = fieldMappings['original_price'] || '';
  config.searchSettings.attrs_to_get = Object.values(config.displaySettings.productDetails).filter(value => Boolean(value));

  return config;
};


export const init = (
  initConfig: WidgetConfig,
  fieldMappings: Record<string, string>,
  widgetType: WidgetType,
  widgetDirectory: string,
): WidgetInitResult | undefined => {
  if (isPlacementSkippable(initConfig.appSettings.placementId)) {
    return;
  }

  let config = deepMerge(initConfig, DEFAULT_CONFIGS);
  setCssVariables(config);
  config = populateProductDetailsAndAttrsToGet(config, fieldMappings);
  const widgetClient = getWidgetClient({
    config,
    widgetType,
    widgetDirectory,
    deployTypeId: 0,
  });
  return { widgetClient, fieldMappings, config };
};
