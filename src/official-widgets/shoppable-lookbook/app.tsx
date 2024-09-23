import type { FC } from 'react';
import { IntlProvider } from 'react-intl';
import type { WidgetClient, WidgetConfig } from '../../common/visenze-core';
import { WidgetType } from '../../common/visenze-core';
import ShadowWrapper from '../../common/components/shadow-wrapper';
import { WidgetDataContext } from '../../common/types/contexts';
import ShoppableLookbook from './shoppable-lookbook';
import version from './version';
import './app.css';
import { DEFAULT_LOCALE } from '../../common/default-configs';
import { getLocaleTexts } from '../../common/locales/locale';

interface AppProps {
  config: WidgetConfig;
  productSearch: WidgetClient;
  fieldMappings: Record<string, string>;
  element: HTMLElement;
}

const App: FC<AppProps> = ({ config, fieldMappings, productSearch, element }) => {
  const locale = config.customizations.languageSettings.locale || config.languageSettings.locale || DEFAULT_LOCALE;
  const messages = getLocaleTexts(config.customizations.languageSettings.text, locale)
    || getLocaleTexts(config.languageSettings.text, locale);
  const widgetType = WidgetType.SHOPPABLE_LOOKBOOK;
  const productId = element.dataset.pid ?? '';

  return (
    <WidgetDataContext.Provider value={{ ...config, fieldMappings, productSearch, widgetType, version }}>
      <ShadowWrapper>
        <IntlProvider messages={messages} locale={locale} defaultLocale='en'>
          <ShoppableLookbook config={config} productSearch={productSearch} productId={productId}/>
        </IntlProvider>
      </ShadowWrapper>
    </WidgetDataContext.Provider>
  );
};

export default App;
