import { createRoot } from 'react-dom/client';
import type { WidgetClient, WidgetConfig } from '../../common/visenze-core';
import { WidgetType } from '../../common/visenze-core';
import { deepMerge, init } from '../../common/client/initialization';
import { devConfigs, devFieldMappings } from './dev-configs';
import App from './app';
import defaultConfigs from '../../default-configs';

const createElement = (id: string): HTMLDivElement => {
  const element = document.createElement('div');
  element.style.display = 'none';
  element.id = id;
  document.body.appendChild(element);
  return element;
};

const getRenderElement = (configs: WidgetConfig): HTMLDivElement => {
  const { cssSelector, cameraButtonSelector } = configs.displaySettings;
  return (
    document.body.querySelector(cssSelector || `.ps-widget-${configs.appSettings.placementId}`)
    || document.body.querySelector(`#${cameraButtonSelector}`)
    || createElement(cameraButtonSelector)
  );
};

const render = (client: WidgetClient, fieldMappings: Record<string, string>, configs: WidgetConfig): void => {
  const element = getRenderElement(configs);
  const root = createRoot(element);
  root.render(<App productSearch={client} fieldMappings={fieldMappings} config={configs}></App>);
  client.setRenderRoots([root]);
};

const initWidget = async (): Promise<void> => {
  const initConfig = deepMerge(devConfigs, defaultConfigs);
  const result = init(initConfig, devFieldMappings, WidgetType.CAMERA_SEARCH, '/');
  if (!result) {
    return;
  }

  const { widgetClient, config } = result;
  window.widget = widgetClient;
  render(widgetClient, devFieldMappings, config);
};

initWidget();
