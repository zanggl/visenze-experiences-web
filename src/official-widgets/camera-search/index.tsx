import { createRoot } from 'react-dom/client';
import { deepMerge, init } from '../../common/client/initialization';
import version from './version';
import { WidgetType } from '../../common/visenze-core';
import type { WidgetClient, WidgetConfig } from '../../common/visenze-core';
import App from './app';

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

const initWidget = (
  initConfig: WidgetConfig,
  fieldMappings: Record<string, string>,
  skipRender?: boolean,
): WidgetClient | undefined => {
  const result = init(initConfig, fieldMappings, WidgetType.CAMERA_SEARCH, '/');
  if (!result) {
    return undefined;
  }

  const { widgetClient, config } = result;
  widgetClient.rerender = (): void => {
    render(widgetClient, fieldMappings, config);
  };

  if (!skipRender) {
    render(widgetClient, fieldMappings, config);
  }

  return widgetClient;
};

// eslint-disable-next-line func-names
(function (context: Window): void {
  const widgetType = `wigmix_${WidgetType.CAMERA_SEARCH}`;
  context.visenzewigmixwidget = context.visenzewigmixwidget || {};
  context.visenzewigmixwidget[widgetType] = context.visenzewigmixwidget[widgetType] || {};
  context.visenzewigmixwidget[widgetType][version] = context.visenzewigmixwidget[widgetType][version] || {
    initWidget,
    deepMerge,
  };
  // @ts-expect-error expect undefined env
  // eslint-disable-next-line no-restricted-globals
}(typeof self !== 'undefined' ? self : this));
