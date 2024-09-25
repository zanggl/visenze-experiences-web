import type { FC } from 'react';
import { IntlProvider } from 'react-intl';
import type { WidgetClient, WidgetConfig } from '../../common/visenze-core';
import { WidgetType } from '../../common/visenze-core';
import ShadowWrapper from '../../common/components/shadow-wrapper';
import { WidgetDataContext } from '../../common/types/contexts';
import ShoppingAssistant from './shopping-assistant';
import version from './version';
import './app.css';
import { DEFAULT_LOCALE } from '../../common/default-configs';
import { getLocaleTexts } from '../../common/locales/locale';

interface AppProps {
  config: WidgetConfig;
  productSearch: WidgetClient;
  fieldMappings: Record<string, string>;
}

const App: FC<AppProps> = ({ config, fieldMappings, productSearch }) => {
  const locale = config.customizations.languageSettings?.locale || config.languageSettings.locale || DEFAULT_LOCALE;
  const messages = getLocaleTexts(locale, config.languageSettings.text, config.customizations.languageSettings?.text);
  const widgetType = WidgetType.SHOPPING_ASSISTANT;

  return (
      <WidgetDataContext.Provider value={{ ...config, fieldMappings, productSearch, widgetType, version }}>
        <ShadowWrapper>
          <IntlProvider messages={messages} locale={locale} defaultLocale='en'>
            <ShoppingAssistant config={config} productSearch={productSearch} />
          </IntlProvider>
        </ShadowWrapper>
      </WidgetDataContext.Provider>
  );
};

export default App;
