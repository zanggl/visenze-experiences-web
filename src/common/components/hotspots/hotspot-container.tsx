import type { ProductType } from 'visearch-javascript-sdk';
import type { ReactElement, RefObject } from 'react';
import { Component, createRef } from 'react';
import Hotspot from './hotspot';
import { isSameBox } from '../../box-utils';
import type { CroppedBox } from '../../types/box';
import type { CroppingContextValue } from '../../types/contexts';
import type { WidgetBreakpoint } from '../../types/constants';

interface HotspotContainerProps {
  box?: CroppedBox;
  croppingContext: CroppingContextValue;
  file?: string;
  isCropOn?: boolean;
  products: ProductType[];
  isMobile?: boolean;
  breakpoint: WidgetBreakpoint;
}

interface HotspotContainerState {
  widthScale: number;
  heightScale: number;
  isShow: boolean;
  imageChangedEventToken: string;
  cropBoxInitEventToken: string;
  file: string;
  imageHeight: number;
  imageWidth: number;
  selected: number;
  boxes: CroppedBox[];
  cropInserted: boolean;
}

export default class HotspotContainer extends Component<HotspotContainerProps, HotspotContainerState> {
  boxRef!: RefObject<HTMLDivElement>;

  imageRef!: RefObject<HTMLImageElement>;

  constructor(props: HotspotContainerProps) {
    super(props);
    this.state = {
      isShow: false,
      imageChangedEventToken: '',
      cropBoxInitEventToken: '',
      file: '',
      imageHeight: 0,
      imageWidth: 0,
      selected: -1,
      widthScale: 1,
      heightScale: 1,
      boxes: [],
      cropInserted: false,
    };
    this.boxRef = createRef();
    this.imageRef = createRef();
  }

  onCropBoxInit(productTypes: ProductType[]): void {
    const boxes = productTypes.map((productType) => {
      const dataBox = productType.box;
      return {
        x1: dataBox[0] * this.state.widthScale,
        y1: dataBox[1] * this.state.heightScale,
        x2: dataBox[2] * this.state.widthScale,
        y2: dataBox[3] * this.state.heightScale,
      };
    });
    const data = this.validateCroppedBox(boxes);
    this.setState({ boxes: data.boxes });
    this.setState({ selected: data.selected });
  }

  onLoad(): void {
    const img = this.imageRef.current;
    if (!img) {
      return;
    }
    const imageWidth = img.clientWidth;
    const imageHeight = img.clientHeight;
    const widthScale = img.clientWidth / img.naturalWidth;
    const heightScale = img.clientHeight / img.naturalHeight;

    this.setState({
      imageWidth,
      imageHeight,
      widthScale,
      heightScale,
    });
  }

  validateCroppedBox(boxes: CroppedBox[]): {
    boxes: CroppedBox[];
    selected: number;
  } {
    const croppedBox = this.props.croppingContext.boxData?.box;
    if (croppedBox) {
      for (let i = 0; i < boxes.length; i += 1) {
        if (isSameBox(boxes[i], croppedBox)) {
          return { boxes, selected: i };
        }
      }
      boxes.unshift(croppedBox);
      this.setState({ cropInserted: true });
    }
    return { boxes, selected: 0 };
  }

  handleUpdateDot(index: number): void {
    this.setState({ selected: index });
  }

  handleInnerDotClick(index: number): void {
    // imgClassName: 'vs-cropper-image-selected' to add when cropping
    const wasFromCroppedImage = this.state.cropInserted;
    if (wasFromCroppedImage) {
      const curBoxes = this.state.boxes;
      curBoxes.shift();
      this.setState({ boxes: curBoxes });
      this.setState({ cropInserted: false });
      index -= 1;
    }
    this.handleUpdateDot(index);
    if (this.props.croppingContext.setBoxData) {
      this.props.croppingContext.setBoxData({
        box: this.state.boxes[index],
        index,
        wasFromCrop: wasFromCroppedImage,
      });
    }
  }

  componentDidMount(): void {
    if (this.props.file) {
      this.setState({ file: this.props.file, isShow: true });
    }
    if (this.props.products.length > 0) {
      this.onCropBoxInit(this.props.products);
    }
  }

  componentDidUpdate(prevProps: HotspotContainerProps): void {
    if (this.props.isCropOn !== prevProps.isCropOn) {
      this.onLoad();
    }
    if (this.props.products !== prevProps.products && this.props.file !== prevProps.file) {
      this.onCropBoxInit(this.props.products);
    }
  }

  render(): ReactElement {
    return (
      <div className='flex w-full justify-center'>
        <div className='size-full overflow-hidden'>
          <div className='relative size-full text-center' ref={this.boxRef}>
            {this.state.isShow && (
              <>
                <img
                  className='object-cover object-center lg:h-full'
                  ref={this.imageRef}
                  src={this.state.file}
                  onLoad={() => setTimeout(() => this.onLoad(), 250)} // Delay needed to get correct image width and height for calculation in onLoad
                  data-pw='hotspot-reference-image'
                />
                <div
                  className='absolute top-1/2 inline-block max-h-full max-w-full -translate-x-1/2 -translate-y-1/2'
                  style={{
                    width: this.state.imageWidth,
                    height: this.state.imageHeight,
                  }}>
                  {this.state.boxes.map((box, index) => (
                    <Hotspot
                      box={box}
                      croppingContext={this.props.croppingContext}
                      croppedBox={this.props.croppingContext.boxData?.box}
                      heightScale={this.state.heightScale}
                      widthScale={this.state.widthScale}
                      imageWidth={this.state.imageWidth}
                      imageHeight={this.state.imageHeight}
                      isSelected={this.state.selected === index}
                      handleUpdateDot={this.handleUpdateDot.bind(this)}
                      handleInnerDotClick={this.handleInnerDotClick.bind(this)}
                      index={index}
                      key={index}
                      isCropOn={!!this.props.isCropOn}
                      enable={true}
                      isMobile={!!this.props.isMobile}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
}
