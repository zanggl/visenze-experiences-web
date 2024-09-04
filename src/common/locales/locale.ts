import { DEFAULT_LOCALE } from '../default-configs';

export const getLocaleTexts = (texts: Record<string, Record<string, string>>, localeParam: string): Record<string, string> => {
  const locale = localeParam || DEFAULT_LOCALE;
  const lang = locale.indexOf('-') >= 0 ? locale.split('-')[0] : '';
  if (!lang) {
    // If locale code is just language, return directly
    return texts[locale] || texts[DEFAULT_LOCALE];
  }
  const textsWithRegionVariants = texts[lang] || {};
  Object.keys(texts[locale] || {}).forEach((key) => {
    if (texts[locale][key]) {
      // Replace all available keys with regional variant
      textsWithRegionVariants[key] = texts[locale][key];
    }
  });
  return textsWithRegionVariants;
};

export const getCurrencyFormatter = (locale: string, currency: string): Intl.NumberFormat => {
  return Intl.NumberFormat(locale, { style: 'currency', currency });
};
