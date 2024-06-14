export enum SortType {
  RELEVANCE = 'searchresult.sort.relevance',
  PRICE_LTH = 'searchresult.sort.price.lth',
  PRICE_HTL = 'searchresult.sort.price.htl',
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
