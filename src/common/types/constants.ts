export enum SortType {
  RELEVANCE = 'Relevance',
  PRICE_LTH = 'Price: Low to high',
  PRICE_HTL = 'Price: High to low',
}

export enum FilterType {
  TEXT = 'text',
  CURRENCY = 'currency',
  NUMBER = 'number',
}

export enum ScreenType {
  LOADING = 'loading',
  RETRYING = 'retrying',
  UPLOAD = 'upload',
  CROPPING = 'cropping',
  RESULT = 'result',
  NO_RESULTS = 'no_results',
}

export enum WidgetBreakpoint {
  DESKTOP = 'desktop',
  TABLET = 'tablet',
  MOBILE = 'mobile',
}
