export enum SortType {
  RELEVANCE = 'Relevance',
  PRICE_HTL = 'High to low (Price)',
  PRICE_LTH = 'Low to high (Price)',
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
