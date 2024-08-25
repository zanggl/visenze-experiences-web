import { WidgetType } from '../../common/visenze-core';
import { devInitWidget } from '../../common/client/initialization';
import { devConfigs, devFieldMappings } from './dev-configs';
import App from './app';

devInitWidget(
    WidgetType.MORE_LIKE_THIS,
    ({ config, client, fieldMappings, element }) => <App productSearch={client} fieldMappings={fieldMappings} config={config} element={element}></App>,
    false,
    devConfigs,
    devFieldMappings,
    window,
);
