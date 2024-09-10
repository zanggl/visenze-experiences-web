import { WidgetType } from '../../common/visenze-core';
import { devInitWidget } from '../../common/client/initialization';
import { devConfigs, devFieldMappings } from './dev-configs';
import App from './app';
import version from './version';

const customCss = `
/* Insert the custom CSS here */
`;

const initConfig = {
  ...devConfigs,
  customizations: {
    ...devConfigs.customizations,
    customCss,
  },
};

devInitWidget(
    WidgetType.SHOPPING_ASSISTANT,
    version,
    ({ config, client, fieldMappings }) => <App productSearch={client} fieldMappings={fieldMappings} config={config}></App>,
    false,
    initConfig,
    devFieldMappings,
    window,
);
