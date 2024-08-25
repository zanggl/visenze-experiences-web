import { useContext, useEffect } from 'react';
import { WidgetDataContext } from '../../types/contexts';

/**
 * Copy styles from the temp shadow dom into widget shadow dom
 */
const useStyles = (root: HTMLElement | null): void => {
  const { widgetType, version, customizations } = useContext(WidgetDataContext);
  const styleTag = document.getElementById(`vi__${widgetType.toLowerCase()}__${version}`);

  useEffect(() => {
    if (root) {
      if (styleTag) {
        const style = document.createElement('style');
        style.innerHTML = styleTag.innerHTML;
        root.appendChild(style);
      }
      if (customizations && customizations.customCss) {
        const customCss = document.createElement('style');
        customCss.innerHTML = customizations.customCss;
        root.appendChild(customCss);
      }
    }
  }, [root]);
};

export default useStyles;
