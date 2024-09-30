import { WidgetType } from '../../common/visenze-core';
import { devInitWidget } from '../../common/client/initialization';
import { devConfigs, devFieldMappings } from './dev-configs';
import App from './app';
import version from './version';

const customCss = `
/* Insert the custom CSS here */
`;

const shouldUseOnlineWidgetConfig = {
  widgetConfig: false, // set to true to use widget config configured within the placement itself
  fieldMappings: true, // set to true to use the fields mappings within the app itself
  customCss: false, // set to true to use custom CSS configured within the placement itself
};

devInitWidget(
    WidgetType.EMBEDDED_SEARCH_RESULTS,
    version,
    ({ config, client, fieldMappings }) => <App productSearch={client} fieldMappings={fieldMappings} config={config}></App>,
    false,
    devConfigs,
    devFieldMappings,
    customCss,
    shouldUseOnlineWidgetConfig,
    window,
);
