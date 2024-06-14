/* This is the script to init the widget returned from backend */
/* Backend need to replace all necessary values in this script */
(function (context) {
  const configString = { value: '$CONFIG' };
  if (typeof configString.value === 'string') {
    return;
  }

  const version = '$VERSION';
  const fieldsMappings = '$FIELDS_MAPPINGS';
  const widgetType = '$WIDGET_TYPE';
  const initializer = context.visenzewigmixwidget?.[widgetType]?.[`${version}`];

  if (initializer) {
    const placementId = '$PLACEMENT_ID';

    // allow override from client
    const override = context.visenzeConfigs?.[placementId];

    const config = {
      appSettings: {
        appKey: '$APP_KEY',
        placementId,
        endpoint: '$ENDPOINT',
      },
      displaySettings: {
        cssSelector: '$CONTAINER',
      },
      customizations: configString.value,
    };

    context.visenzeWidgets = context.visenzeWidgets || {};
    context.visenzeWidgets[placementId] = context[`visenzeWidget${placementId}`] =
      initializer.initWidget(initializer.deepMerge(override, config), fieldsMappings);
  }
}(window));
