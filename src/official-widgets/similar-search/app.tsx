import { IntlProvider } from 'react-intl';
import type { FC } from 'react';
import type { WidgetConfig, WidgetClient } from '../../common/visenze-core';
import { WidgetType } from '../../common/visenze-core';
import ShadowWrapper from '../../common/components/shadow-wrapper';
import { WidgetDataContext } from '../../common/types/contexts';
import SimilarSearch from './similar-search';
import version from './version';
import './app.css';

interface AppProps {
  config: WidgetConfig;
  productSearch: WidgetClient;
  element: HTMLElement;
  index: number;
}

const App: FC<AppProps> = ({ config, productSearch, element }) => {
  const locale = config.languageSettings.locale || 'en';
  const messages = config.languageSettings.text[locale];
  const widgetType = WidgetType.SIMILAR_SEARCH;

  return (
    <WidgetDataContext.Provider value={{ ...config, productSearch, widgetType, version }}>
      <ShadowWrapper>
        <IntlProvider messages={messages} locale={locale} defaultLocale='en'>
          <SimilarSearch config={config} productSearch={productSearch} element={element} />
        </IntlProvider>
      </ShadowWrapper>
    </WidgetDataContext.Provider>
  );
};

export default App;
