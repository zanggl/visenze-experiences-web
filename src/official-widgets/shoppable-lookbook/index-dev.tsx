import { createRoot } from 'react-dom/client';
import type { WidgetClient, WidgetConfig } from '../../common/visenze-core';
import { WidgetType } from '../../common/visenze-core';
import { deepMerge, init } from '../../common/client/initialization';
import { devConfigs, devFieldMappings } from './dev-configs';
import App from './app';
import defaultConfigs from '../../default-configs';

const getRenderElement = (configs: WidgetConfig): HTMLElement | null => {
  const { cssSelector } = configs.displaySettings;
  return document.body.querySelector(cssSelector || `.ps-widget-${configs.appSettings.placementId}`);
};

const render = (client: WidgetClient, fieldMappings: Record<string, string>, configs: WidgetConfig): void => {
  const element = getRenderElement(configs);
  if (!element) {
    throw new Error('Element not found');
  }
  const root = createRoot(element);
  root.render(<App productSearch={client} fieldMappings={fieldMappings} config={configs} element={element}></App>);
  client.setRenderRoots([root]);
};

const initWidget = async (): Promise<void> => {
  const initConfig = deepMerge(devConfigs, defaultConfigs);
  const result = init(initConfig, devFieldMappings, WidgetType.SHOPPABLE_LOOKBOOK, '/');
  if (!result) {
    return;
  }

  const { widgetClient, config } = result;
  window.widget = widgetClient;
  render(widgetClient, devFieldMappings, config);
};

initWidget();
