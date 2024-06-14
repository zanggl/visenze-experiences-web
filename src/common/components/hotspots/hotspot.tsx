import type { RefObject } from 'react';
import { Component, createRef } from 'react';
import { isSameBox, addEvent, eventsFor, offsetXYFromParentOf, removeEvent } from '../../box-utils';
import styles from './hotspot.module.scss';
import type { CroppedBox } from '../../types/box';
import { flattenBox } from '../../utils';

let dragEventFor = eventsFor.mouse;
const notSelectedAndCropIsOnDotStyle = {
  display: 'none',
  transition: 'none',
};
const cropBoxStyle = {
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  border: 'none',
  borderRadius: 'none',
  transition: 'none',
};

const doNothing = (): void => {};

interface DotBoundingBoxProps {
  box: CroppedBox;
  croppingContext: any;
  croppedBox?: CroppedBox;
  heightScale: number;
  widthScale: number;
  imageWidth: number;
  imageHeight: number;
  isSelected: boolean;
  handleUpdateDot: (i: number) => void;
  handleInnerDotClick: (i: number) => void;
  index: number;
  key: number;
  isCropOn: boolean;
  enable: boolean;
  isMobile: boolean;
}

interface DotBoundingBoxState {
  cropEnd: boolean;
  cropBox: CroppedBox;
  croppedBox: boolean;
  applyCropEventToken: string;
  hasTransition: boolean;
  dragging: boolean;
  lastX?: number;
  lastY?: number;
}

export default class DotBoundingBox extends Component<DotBoundingBoxProps, DotBoundingBoxState> {
  cropperRef!: RefObject<HTMLDivElement>;

  constructor(props: DotBoundingBoxProps) {
    super(props);
    this.state = {
      cropEnd: false,
      cropBox: this.props.box,
      applyCropEventToken: '',
      hasTransition: true,
      dragging: false,
      croppedBox: false,
    };
    this.cropperRef = createRef();
  }

  componentDidMount(): void {
    this.addEvents();
  }

  shouldComponentUpdate(nextProps: DotBoundingBoxProps): boolean {
    const { box } = this.props;
    const nextBox = nextProps.box;
    return (
      JSON.stringify(box) !== JSON.stringify(nextBox)
      || this.props.heightScale !== nextProps.heightScale
      || this.props.isSelected !== nextProps.isSelected
    );
  }

  componentDidUpdate(prevProps: DotBoundingBoxProps /* ,prevState */): void {
    const hasHeightScaleChanged = prevProps.heightScale !== this.props.heightScale;
    const hasCropModeChanged = prevProps.isCropOn !== this.props.isCropOn;
    // If we are leaving crop mode and the height scale has changed, revert height scale and box to original box
    if (hasHeightScaleChanged && this.props.isSelected && !this.props.isCropOn) {
      const box = this.adjustCropBoxToNewScale(prevProps, this.props, this.state.cropBox);
      this.setState({ cropBox: this.props.box });
      if (!isSameBox(box, this.props.box)) {
        this.handleUpdateDot(); // reset search results to image bounded by bounding box
      }
      // If we are entering crop mode and the height scale has changed, adjust the cropBox according to new height scale
    } else if (hasHeightScaleChanged && this.props.isSelected && this.props.isCropOn) {
      const box = this.adjustCropBoxToNewScale(prevProps, this.props, this.props.box);
      this.setState({ cropBox: box });
    }

    // For modifying transition
    if (!this.props.isMobile) {
      if (!this.props.isCropOn && this.props.isSelected && hasCropModeChanged) {
        // Disable transition for one that has been selected for cropping
        this.setState({ hasTransition: false });
      } else if (!this.props.isCropOn && !this.props.isSelected && hasCropModeChanged) {
        // Re-enable transition for others not selected for cropping
        this.setState({ hasTransition: true });
      } else if (!this.props.isCropOn && !hasCropModeChanged && !this.state.hasTransition && !this.props.isSelected) {
        // Re-enable transition for previously selected crop box
        this.setState({ hasTransition: true });
      }
    }

    if (
      this.props.croppedBox
      && (!prevProps.croppedBox || flattenBox(prevProps.croppedBox) !== flattenBox(this.props.croppedBox))
    ) {
      this.onApply();
    }
  }

  componentWillUnmount(): void {
    removeEvent(document, dragEventFor.move, this.handleDrag.bind(this));
    removeEvent(document, dragEventFor.stop, this.handleDragStop.bind(this));
    this.removeEvents();
  }

  adjustCropBoxToNewScale(
    prevProps: DotBoundingBoxProps,
    currentProps: DotBoundingBoxProps,
    currentBox: CroppedBox,
  ): CroppedBox {
    return {
      x1: (currentBox.x1 / prevProps.widthScale) * currentProps.widthScale,
      y1: (currentBox.y1 / prevProps.heightScale) * currentProps.heightScale,
      x2: (currentBox.x2 / prevProps.widthScale) * currentProps.widthScale,
      y2: (currentBox.y2 / prevProps.heightScale) * currentProps.heightScale,
    };
  }

  handleUpdateDot(): void {
    this.props.handleUpdateDot(this.props.index);
  }

  handleDotClick(): void {
    this.props.handleInnerDotClick(this.props.index);
  }

  updateCropBox(box: CroppedBox): void {
    if (!isSameBox(box, this.state.cropBox)) {
      this.setState({ cropBox: box });
    }
  }

  onApply(): void {
    if (this.props.isSelected && this.props.isCropOn) {
      const { widthScale, heightScale } = this.props;
      const selectedBox: CroppedBox = {
        x1: this.state.cropBox.x1 / widthScale,
        y1: this.state.cropBox.y1 / heightScale,
        x2: this.state.cropBox.x2 / widthScale,
        y2: this.state.cropBox.y2 / heightScale,
      };
      this.props.croppingContext.setBoxData({ box: selectedBox });
    }
  }

  addEvents(): void {
    addEvent(document, dragEventFor.move, this.handleDrag.bind(this));
    addEvent(document, dragEventFor.stop, this.handleDragStop.bind(this));
  }

  removeEvents(): void {
    removeEvent(document, eventsFor.mouse.move, this.handleDrag.bind(this));
    removeEvent(document, eventsFor.touch.move, this.handleDrag.bind(this));
    removeEvent(document, eventsFor.mouse.stop, this.handleDragStop.bind(this));
    removeEvent(document, eventsFor.touch.stop, this.handleDragStop.bind(this));
  }

  handleDrag(e: any): void {
    if (this.state.dragging) {
      e.preventDefault();
      const position = offsetXYFromParentOf(e, this.cropperRef.current);
      if (position === null) return;
      const { x, y } = position;
      const cropBox = {
        x1: this.state.lastX ?? 0,
        y1: this.state.lastY ?? 0,
        x2: x,
        y2: y,
      };
      if (cropBox.x2 < cropBox.x1 || cropBox.y2 < cropBox.y1) {
        // invalid cropBox
        return;
      }
      this.setState({
        croppedBox: true,
        cropBox,
      });
    }
  }

  handleDragStop(): void {
    // Reset the el.
    this.setState({
      dragging: false,
      cropEnd: true,
      lastX: NaN,
      lastY: NaN,
    });
    this.removeEvents();
  }

  handleDragStart(e: any): void {
    e.preventDefault();
    const position = offsetXYFromParentOf(e, this.cropperRef.current);
    // Get the current drag point from the event. This is used as the offset.
    if (position === null) return; // not possible but satisfies flow
    const { x, y } = position;
    // Add events to the document directly so we catch when the user's mouse/touch moves outside of
    // this element. We use different events depending on whether or not we have detected that this
    // is a touch-capable device.
    this.setState({
      dragging: true,
      lastX: x,
      lastY: y,
    });
    this.addEvents();
  }

  onMouseDown(e: any): void {
    if (this.props.enable) {
      dragEventFor = eventsFor.mouse; // on touchscreen laptops we could switch back to mouse
      this.handleDragStart(e);
    }
  }

  onMouseUp(): void {
    dragEventFor = eventsFor.mouse;
    this.handleDragStop();
  }

  onTouchStart(e: any): void {
    if (this.props.enable) {
      dragEventFor = eventsFor.touch;
      this.handleDragStart(e);
    }
  }

  onTouchEnd(): void {
    dragEventFor = eventsFor.touch;
    this.handleDragStop();
  }

  render(): JSX.Element {
    const { widthScale, heightScale, isCropOn, isSelected, box } = this.props;
    const transitionClassName = styles.dotTranstion;
    const boxStyle = {
      top: `${box.y1 * heightScale}px`,
      left: `${box.x1 * widthScale}px`,
      width: `${(box.x2 - box.x1) * widthScale}px`,
      height: `${(box.y2 - box.y1) * heightScale}px`,
    };
    const dotStyle = {
      top: `${(box.y1 + box.y2) * 0.5 * heightScale - 6}px`,
      left: `${(box.x1 + box.x2) * 0.5 * widthScale - 6}px`,
      transition: 'none',
    };
    const currentClass = isSelected ? styles.dotSelected : styles.dotInner;
    const getStyle = ():Record<string, any> => {
      let style;

      if (isSelected) {
        style = isCropOn ? cropBoxStyle : boxStyle;
      } else {
        style = isCropOn ? notSelectedAndCropIsOnDotStyle : dotStyle;
      }

      return style;
    };

    return (
      <div
        tabIndex={0}
        aria-label={isSelected ? 'Hotspot selected' : 'Hotspot'}
        className={`${this.state.hasTransition ? transitionClassName : ''} ${currentClass}`.trim()}
        style={getStyle()}
        onClick={isSelected ? doNothing : this.handleDotClick.bind(this)}
        onKeyDown={(evt): void => {
          if (!isSelected && evt.key === 'Enter') {
            this.handleDotClick();
          }
        }}
        ref={this.cropperRef}
        onMouseDown={isCropOn && isSelected ? this.onMouseDown.bind(this) : doNothing}
        onTouchStart={isCropOn && isSelected ? this.onTouchStart.bind(this) : doNothing}
        onMouseUp={isCropOn && isSelected ? this.onMouseUp.bind(this) : doNothing}
        onTouchEnd={isCropOn && isSelected ? this.onTouchEnd.bind(this) : doNothing}></div>
    );
  }
}
