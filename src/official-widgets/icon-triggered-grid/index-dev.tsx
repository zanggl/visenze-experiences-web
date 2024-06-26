import { createRoot } from 'react-dom/client';
import type { WidgetClient, WidgetConfig } from '../../common/visenze-core';
import { WidgetType } from '../../common/visenze-core';
import { deepMerge, init } from '../../common/client/initialization';
import { devConfigs, devFieldMappings } from './dev-configs';
import App from './app';
import defaultConfigs from '../../default-configs';

const getRenderElements = (configs: WidgetConfig): NodeListOf<HTMLDivElement> => {
  const { cssSelector } = configs.displaySettings;
  return document.body.querySelectorAll(cssSelector || `.ps-widget-${configs.appSettings.placementId}`);
};

const render = (productSearch: WidgetClient, config: WidgetConfig): void => {
  const elements = getRenderElements(config);

  elements.forEach((element, index) => {
    const root = createRoot(element);
    root.render(<App config={config} productSearch={productSearch} index={index} element={element}></App>);
  });
};

const initWidget = async (): Promise<void> => {
  const initConfig = deepMerge(devConfigs, defaultConfigs);
  const result = init(initConfig, devFieldMappings, WidgetType.ICON_TRIGGERED_GRID, '/');
  if (!result) {
    return;
  }

  const { widgetClient, config } = result;
  window.widget = widgetClient;
  render(widgetClient, config);
};

initWidget();
