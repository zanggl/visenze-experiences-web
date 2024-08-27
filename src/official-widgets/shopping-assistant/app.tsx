import type { FC } from 'react';
import { IntlProvider } from 'react-intl';
import type { WidgetClient, WidgetConfig } from '../../common/visenze-core';
import { WidgetType } from '../../common/visenze-core';
import ShadowWrapper from '../../common/components/shadow-wrapper';
import { WidgetDataContext } from '../../common/types/contexts';
import ShoppingAssistant from './shopping-assistant';
import version from './version';
import './app.css';

interface AppProps {
  config: WidgetConfig;
  productSearch: WidgetClient;
  fieldMappings: Record<string, string>;
}

const App: FC<AppProps> = ({ config, fieldMappings, productSearch }) => {
  const locale = config.languageSettings.locale || 'en';
  const messages = config.languageSettings.text[locale];
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
