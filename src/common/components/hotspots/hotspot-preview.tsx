import type { FC, ReactElement } from 'react';
import { useContext } from 'react';
import HotspotContainer from './hotspot-container';
import { CroppingContext, WidgetResultContext } from '../../types/contexts';
import useBreakpoint from '../hooks/use-breakpoint';

interface HotspotPreviewProps {
  referenceImage: string;
  className?: string;
}

const HotspotPreview: FC<HotspotPreviewProps> = ({ referenceImage, className }) => {
  const { productTypes } = useContext(WidgetResultContext);
  const breakpoint = useBreakpoint();

  return (
    <div className={className}>
      <CroppingContext.Consumer>
        {(croppingContext): ReactElement => (
          <HotspotContainer
            breakpoint={breakpoint}
            croppingContext={croppingContext}
            file={referenceImage}
            productTypes={productTypes ?? []}
          />
        )}
      </CroppingContext.Consumer>
    </div>
  );
};

export default HotspotPreview;
