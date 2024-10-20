import { useContext, useEffect } from 'react';
import { WidgetDataContext } from '../../types/contexts';

/**
 * Copy styles from the temp shadow dom into widget shadow dom
 */
const useStyles = (root: HTMLElement | null): void => {
  const { productSearch, customizations, platformSettings } = useContext(WidgetDataContext);
  const styleTag = document.getElementById(`vi__${productSearch.widgetType.toLowerCase()}__${productSearch.widgetVersion.toLowerCase()}`);

  useEffect(() => {
    if (root) {
      if (styleTag) {
        const style = document.createElement('style');
        style.innerHTML = styleTag.innerHTML;
        root.appendChild(style);
      }
      if (customizations && customizations.customCss) {
        const customCss = document.createElement('style');
        customCss.id = 'custom-css-user';
        customCss.innerHTML = customizations.customCss;
        root.appendChild(customCss);
      }
      if (platformSettings && platformSettings.customCss) {
        const platformCustomCss = document.createElement('style');
        platformCustomCss.id = `custom-css-platform-${platformSettings.platformName.toLowerCase()}`;
        platformCustomCss.innerHTML = platformSettings.customCss;
        root.appendChild(platformCustomCss);
      }
    }
  }, [root]);
};

export default useStyles;
