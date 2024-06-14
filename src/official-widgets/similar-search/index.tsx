import type { Root } from 'react-dom/client';
import { createRoot } from 'react-dom/client';
import version from './version';
import { deepMerge, init } from '../../common/client/initialization';
import { WidgetType } from '../../common/visenze-core';
import type { WidgetClient, WidgetConfig } from '../../common/visenze-core';
import App from './app';

const getRenderElements = (configs: WidgetConfig): NodeListOf<HTMLDivElement> => {
  const { cssSelector } = configs.displaySettings;
  return document.body.querySelectorAll(cssSelector || `.ps-widget-${configs.appSettings.placementId}`);
};

const render = (client: WidgetClient, config: WidgetConfig): void => {
  const elements = getRenderElements(config);
  const roots: Root[] = [];

  elements.forEach((element, index) => {
    const root = createRoot(element);
    root.render(<App config={config} productSearch={client} index={index} element={element}></App>);
    roots.push(root);
  });

  client.setRenderRoots(roots);
};

const initWidget = (
  initConfig: WidgetConfig,
  fieldMappings: Record<string, string>,
  skipRender?: boolean,
): WidgetClient | undefined => {
  const result = init(initConfig, fieldMappings, WidgetType.SIMILAR_SEARCH, '/');
  if (!result) {
    return undefined;
  }

  const { widgetClient, config } = result;
  widgetClient.rerender = (): void => {
    render(widgetClient, config);
  };

  if (!skipRender) {
    render(widgetClient, config);
  }

  return widgetClient;
};

// eslint-disable-next-line func-names
(function (context: Window): void {
  const widgetType = `wigmix_${WidgetType.SIMILAR_SEARCH}`;
  context.visenzewigmixwidget = context.visenzewigmixwidget || {};
  context.visenzewigmixwidget[widgetType] = context.visenzewigmixwidget[widgetType] || {};
  context.visenzewigmixwidget[widgetType][version] = context.visenzewigmixwidget[widgetType][version] || {
    initWidget,
    deepMerge,
  };
  // @ts-expect-error expect undefined env
  // eslint-disable-next-line no-restricted-globals
}(typeof self !== 'undefined' ? self : this));
