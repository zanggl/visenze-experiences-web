import { useMediaQuery } from 'react-responsive';
import { useContext } from 'react';
import { WidgetDataContext } from '../../types/contexts';
import { WidgetBreakpoint } from '../../types/constants';

const useBreakpoint = (): WidgetBreakpoint => {
  const { displaySettings } = useContext(WidgetDataContext);
  const { breakpoints } = displaySettings;

  const isMobile = useMediaQuery(breakpoints.mobile);
  const isTablet = useMediaQuery(breakpoints.tablet);

  if (isMobile) {
    return WidgetBreakpoint.MOBILE;
  }
  if (isTablet) {
    return WidgetBreakpoint.TABLET;
  }
  return WidgetBreakpoint.DESKTOP;
};

export default useBreakpoint;
