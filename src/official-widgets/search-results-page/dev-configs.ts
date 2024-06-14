import type { RecursivePartial, WidgetConfig } from '../../common/visenze-core';

export const devConfigs: RecursivePartial<WidgetConfig> = {
  appSettings: {
    appKey: '',
    placementId: '',
    endpoint: '',
  },
  searchSettings: {
    attrs_to_get: [],
    facets_limit: 10,
    limit: 20,
  },
  displaySettings: {
    cssSelector: '.search-results-page-widget',
    productDetails: {
      mainImageUrl: '',
      productUrl: '',
      title: '',
      price: '',
      originalPrice: '',
    },
  },
  callbacks: {
    trackingCallback: (action: string, params: Record<string, any>) => {
      console.log(`Successfully send event: ${action}`, params);
    },
  },
  customizations: {
    fonts: {
      mobile: {
        widgetTitle: {
          fontSize: 20,
          fontWeight: 400,
        },
        callsToActionText: {
          fontSize: 14,
          fontWeight: 400,
        },
        productCardTitle: {
          fontSize: 14,
          fontWeight: 700,
        },
        productCardPrice: {
          fontSize: 12,
          fontWeight: 400,
        },
        searchBarText: {
          fontSize: 12,
          fontWeight: 400,
        },
      },
      tablet: {
        widgetTitle: {
          fontSize: 22,
          fontWeight: 400,
        },
        callsToActionText: {
          fontSize: 14,
          fontWeight: 400,
        },
        productCardTitle: {
          fontSize: 14,
          fontWeight: 700,
        },
        productCardPrice: {
          fontSize: 12,
          fontWeight: 400,
        },
        searchBarText: {
          fontSize: 12,
          fontWeight: 400,
        },
      },
      desktop: {
        widgetTitle: {
          fontSize: 24,
          fontWeight: 400,
        },
        callsToActionText: {
          fontSize: 16,
          fontWeight: 400,
        },
        productCardTitle: {
          fontSize: 16,
          fontWeight: 700,
        },
        productCardPrice: {
          fontSize: 14,
          fontWeight: 400,
        },
        searchBarText: {
          fontSize: 14,
          fontWeight: 400,
        },
      },
    },
    colours: {
      text: {
        primary: '#000000',
        buttonPrimary: '#FFFFFF',
        buttonSecondary: '#FFFFFF',
      },
      background: {
        primary: '#FFFFFF',
        buttonPrimary: '#616161',
        buttonSecondary: '#000000',
      },
    },
    icons: {
      cameraButton: '',
      upload: '',
      moreLikeThis: '',
    },
    images: [
      {
        url: 'https://cdn.visenze.com/images/widget-1.jpg',
        label: '',
      },
      {
        url: 'https://cdn.visenze.com/images/widget-2.jpg',
        label: '',
      },
      {
        url: 'https://cdn.visenze.com/images/widget-3.jpg',
        label: '',
      },
      {
        url: 'https://cdn.visenze.com/images/widget-4.jpg',
        label: '',
      },
      {
        url: 'https://cdn.visenze.com/images/widget-5.jpg',
        label: '',
      },
    ],
  },
};

// Update according to your catalog's field mappings
export const devFieldMappings: Record<string, string> = {
  main_image_url: 'main_image_url',
  product_url: 'product_url',
  title: 'title',
  price: 'price',
  original_price: 'original_price',
};
