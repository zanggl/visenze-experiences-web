import { WidgetType } from '../../common/visenze-core';
import { devInitWidget } from '../../common/client/initialization';
import { devConfigs, devFieldMappings } from './dev-configs';
import App from './app';

devInitWidget(
    WidgetType.ICON_TRIGGERED_GRID,
    ({ config, client, index, element }) => <App config={config} productSearch={client} index={index} element={element}></App>,
    true,
    devConfigs,
    devFieldMappings,
    window,
);
