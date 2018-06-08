// @flow

import React, { Component } from 'react';
import shallowequal from 'shallowequal';

import { tweenProperty } from './tweenProperty';
import './Explorer.css';

type Props = {
  itemWidth: number,
  itemHeight: number,
  minGutterWidth: number,
  gutterHeight: number,
  children: React$Node[],
};

type State = {
  mode: 'overview' | 'zoomed',
  itemsPerRow: number,
  gutterWidth: number,
  maxZoomRatio: number,
  scrollOffset: number,
};

class Explorer extends Component<Props, State> {
  el: ?HTMLDivElement;
  state: State;

  constructor(props: Props) {
    super(props);
    this.state = {
      mode: 'overview',
      itemsPerRow: 1,
      gutterWidth: props.minGutterWidth,
      maxZoomRatio: 1,
      scrollOffset: 0,
    };
  }

  componentDidMount() {
    this.recomputeSizes();
    window.addEventListener('resize', this.recomputeSizes);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.recomputeSizes);
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.itemWidth !== nextProps.itemWidth
      || this.props.itemHeight !== nextProps.itemHeight
      || this.props.minGutterWidth !== nextProps.minGutterWidth
    ) {
      this.recomputeSizes();
    }
  }

  recomputeSizes = () => {
    const { itemWidth, itemHeight, minGutterWidth, gutterHeight } = this.props;

    if (!this.el) {
      this.setState({ itemsPerRow: 1, gutterWidth: minGutterWidth, maxZoomRatio: 1 });
      return;
    }

    // maximum items per row is whatever will fit given itemWidth and minGutterWidth
    const elSize = this.el.getBoundingClientRect();
    const minItemWidth = itemWidth + minGutterWidth;
    const availableItemWidth = elSize.width - minGutterWidth; // must leave space for extra gutter at the end
    const itemsPerRow = Math.floor(availableItemWidth / minItemWidth);

    // set gutterWidth based on how many items we have to evenly space out all cards
    const itemsWidth = itemsPerRow * itemWidth; // space taken up by items excluding gutters
    const gutterCount = itemsPerRow + 1; // extra gutter at the end
    const availableGutterWidth = elSize.width - itemsWidth;
    const gutterWidth = availableGutterWidth / gutterCount;

    // set the maximum size of a zoomed in card
    const maxZoomRatio = Math.min(
      // either as much of the card that will fit on the screen given $gutterWidth padding on top and bottom (landscape)
      (elSize.height - (gutterHeight * 2)) / itemHeight,
      // or up to 70% of the width of the screen (landscape)
      Math.round(elSize.width * 0.7) / itemWidth,
      // or up to twice the original size (tablets, desktop)
      2,
    );

    this.setState({ itemsPerRow, gutterWidth, maxZoomRatio });
  }

  // there's a fair bit of positional calculations, so let's override shouldComponentUpdate
  // compare state first because it's more likely to change (due to scroll position being in there)
  shouldComponentUpdate(nextProps: Props, nextState: State) {
    return !shallowequal(this.state, nextState) || !shallowequal(this.props, nextProps);
  }

  zoomComputedValues = (i: number) => {
    const { itemWidth } = this.props;
    const { gutterWidth, maxZoomRatio, scrollOffset } = this.state;

    // spread items out a little bit more when in zoomed view
    const spacing = itemWidth + (gutterWidth * 2);
    // item position is just $i spacings away
    const itemOffset = i * spacing;

    // trail off to normal size at 1.5 spacings away
    const normalizationDenominator = spacing * 1.5;
    // find the position of this element relative to `scrollOffset`
    const relativePosition = Math.abs(itemOffset - scrollOffset);
    const normalizedPosition = relativePosition / normalizationDenominator;

    // for scaling, map the normalised range [-∞, -1, 0, 1, ∞] to [1, 1, $maxZoomRatio, 1, 1]
    const absoluteScale = (normalizedPosition * (1 - maxZoomRatio)) + maxZoomRatio;
    const scale = Math.max(absoluteScale, 1); // don't shrink anything, always force minimum zoom to 1

    // for z-index, we can use the relative position directly and reverse the order
    // CSS requires z-indexes to be integer values
    const zIndex = -Math.round(relativePosition);

    return { itemOffset, scale, zIndex };
  }

  zoomPosition = (i: number) => {
    const { itemOffset, scale, zIndex } = this.zoomComputedValues(i);
    return {
      left: `calc(50% + ${itemOffset}px)`,
      top: '50%',
      transform: `translate(-50%, -50%) scale(${scale})`,
      zIndex,
    };
  }

  gridPosition = (i: number) => {
    const { itemWidth, itemHeight, gutterHeight } = this.props;
    const { itemsPerRow, gutterWidth } = this.state;

    const x = i % itemsPerRow;
    const y = Math.floor(i / itemsPerRow);

    return {
      left: (x * itemWidth) + (x * gutterWidth) + gutterWidth,
      top: (y * itemHeight) + (y * gutterHeight) + gutterHeight,
    };
  }

  // inject scroll offset into state to trigger rerender
  // only update if x-axis scroll has changed
  updateScrollOffset = () => {
    if (!this.el || this.el.scrollLeft === this.state.scrollOffset) return;
    this.setState({ scrollOffset: this.el.scrollLeft });
  }

  // an instance-level ref handler prevents unnecessary rerenders
  handleRef = (n: ?HTMLDivElement) => {
    if (n) {
      n.addEventListener('scroll', this.updateScrollOffset);
    } else if (this.el) {
      this.el.removeEventListener('scroll', this.updateScrollOffset);
    }
    this.el = n;
  };

  render() {
    return (
      <div
        className="Explorer"
        ref={this.handleRef}
        onClick={() => this.setState({ mode: 'overview' })}
      >
        {React.Children.toArray(this.props.children).map((item, i) => {
          return (
            <div
              key={item.key}
              className="Explorer-item"
              style={this.state.mode === 'overview' ? this.gridPosition(i) : this.zoomPosition(i)}
              onClick={(e: MouseEvent) => {
                if (this.el) {
                  this.setState({ mode: 'zoomed' });
                  tweenProperty(this.el, 'scrollLeft', this.zoomComputedValues(i).itemOffset, 300);
                }
                e.stopPropagation();
              }}
            >
              {item}
            </div>
          );
        })}
        {this.state.mode === 'zoomed' && this.renderEndSpacer()}
      </div>
    );
  }

  // pushes out the width of the div so we can scroll the final card to the middle of the screen
  renderEndSpacer() {
    if (!this.el) return;
    const width = this.el.clientWidth / 2;
    const { left } = this.zoomPosition(this.props.children.length - 1);
    return <div className="Explorer-endspacer" style={{ width, left }} />;
  }
}

export default Explorer;
