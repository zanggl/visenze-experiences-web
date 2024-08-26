import { DEFAULT_LOCALE } from '../default-configs';

export const getLocaleTexts = (texts: Record<string, Record<string, string>>, localeParam: string): Record<string, string> => {
  const locale = localeParam || DEFAULT_LOCALE;
  if (texts[locale]) {
    return texts[locale];
  }
  // Allow reuse of language for different regions
  if (texts[locale.split('-')[0]]) {
    return texts[locale.split('-')[0]];
  }
  return texts[DEFAULT_LOCALE];
};

export const getCurrencyFormatter = (locale: string, currency: string): Intl.NumberFormat => {
  return Intl.NumberFormat(locale, { style: 'currency', currency });
};
