import { createContext, type CSSProperties, type FC, type ReactNode, useCallback, useContext, useState } from 'react';
import root from 'react-shadow';
import { NextUIProvider } from '@nextui-org/system';
import useStyles from './hooks/use-styles';
import { WidgetDataContext } from '../types/contexts';

const rootStyle: CSSProperties = {
  position: 'relative',
  fontFamily: 'inherit',
  letterSpacing: 'inherit',
  display: 'block',
};

const rootContainerStyle: CSSProperties = {
  display: 'block !important',
};

export const RootContext = createContext<HTMLElement | null>(null);

const StyleLoader: FC<{ rootNode: HTMLElement | null, children: ReactNode }> = ({ rootNode, children }) => {
  useStyles(rootNode);
  return <>{children}</>;
};

const Style: FC = () => {
  const { widgetType, version } = useContext(WidgetDataContext);
  const onRefChange = useCallback((ref: HTMLElement | null) => {
    if (ref) {
      const template = document.head.querySelector(`#vi_template__${widgetType}`) as HTMLTemplateElement;
      const styleTag = template.shadowRoot?.getElementById(`vi_style__${widgetType}__${version}`) as HTMLStyleElement;
      ref.innerHTML = styleTag.innerHTML;
    }
  }, []);
  return <style ref={onRefChange}></style>;
};

const ShadowWrapper: FC<{ children: ReactNode }> = ({ children }) => {
  const [rootNode, setRootNode] = useState<HTMLElement | null>(null);

  const onRefChange = useCallback((ref: HTMLElement | null) => {
    if (ref) {
      setRootNode(ref);

      ref.className = 'light';
      ref.style.colorScheme = 'light';
    }
  }, []);

  return (
    <root.div style={rootContainerStyle}>
      <Style></Style>
      <div ref={onRefChange} style={rootStyle}>
        <RootContext.Provider value={rootNode}>
          <StyleLoader rootNode={rootNode}>
            <NextUIProvider>{children}</NextUIProvider>
          </StyleLoader>
        </RootContext.Provider>
      </div>
    </root.div>
  );
};

export default ShadowWrapper;
