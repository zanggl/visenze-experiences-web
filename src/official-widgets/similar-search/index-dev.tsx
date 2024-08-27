import { WidgetType } from '../../common/visenze-core';
import { devInitWidget } from '../../common/client/initialization';
import { devConfigs, devFieldMappings } from './dev-configs';
import App from './app';
import version from './version';

devInitWidget(
    WidgetType.SIMILAR_SEARCH,
    version,
    ({ config, client, index, element }) => <App config={config} productSearch={client} index={index} element={element}></App>,
    true,
    devConfigs,
    devFieldMappings,
    window,
);
