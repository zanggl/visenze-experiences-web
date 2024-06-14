import type { FC } from 'react';
import { useContext } from 'react';
import HotspotContainer from './hotspot-container';
import { CroppingContext, WidgetResultContext } from '../../types/contexts';
import useBreakpoint from '../hooks/use-breakpoint';

interface HotspotPreviewProps {
  onNewSearch?: () => void;
  onMoreLikeThis?: (imUrl: string) => void;
  referenceImage: string;
  className?: string;
}

const HotspotPreview: FC<HotspotPreviewProps> = ({ referenceImage, className }) => {
  const { products } = useContext(WidgetResultContext);
  const breakpoint = useBreakpoint();

  return (
    <div className={className}>
      <CroppingContext.Consumer>
        {(croppingContext): JSX.Element => (
          <HotspotContainer
            breakpoint={breakpoint}
            croppingContext={croppingContext}
            file={referenceImage}
            products={products ?? []}
          />
        )}
      </CroppingContext.Consumer>
    </div>
  );
};

export default HotspotPreview;
