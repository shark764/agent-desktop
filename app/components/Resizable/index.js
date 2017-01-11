/**
*
* Resizable
*
*/

import React, { PropTypes } from 'react';

import Radium from 'radium';

import { throttleDecorator } from 'utils/animation';

class Resizable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      resizing: false,
    };

    this.dividerPx = 11;
    const dividerHandleOffsetPx = (this.dividerPx / 4) - 1;
    this.dividerPosition = 'absolute';
    this.leftDividerHandleOffset = this.addPx(dividerHandleOffsetPx);
    this.rightDividerHandleOffset = this.addPx((this.dividerPx / 2) + dividerHandleOffsetPx);
    this.dividerHandleStyle = {
      top: '50%',
      boxSizing: 'border-box',
      position: 'absolute',
      height: '18px',
      width: '1px',
      borderLeft: '1px solid #D0D0D0',
    };

    this.getStyles = this.getStyles.bind(this);
    this.addListeners = this.addListeners.bind(this);
    this.removeListeners = this.removeListeners.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.startResizing = this.startResizing.bind(this);
    this.stopResizing = this.stopResizing.bind(this);
    this.resize = throttleDecorator(this.resize.bind(this));
    this.attemptResize = this.attemptResize.bind(this);
  }

  componentWillMount() {
    this.addListeners();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.disabled !== this.props.disabled) {
      if (nextProps.disabled) {
        this.removeListeners();
      } else {
        this.addListeners();
      }
    }
    return nextProps;
  }

  componentWillUnmount() {
    this.removeListeners();
  }

  getStyles() {
    const elementSize = this.addPx(this.props.disabled ? this.props.disabledPx : this.props.px);
    const dividerOffset = this.addPx(this.props.px - (this.dividerPx / 2));
    const userSelect = this.state.resizing ? 'none' : 'auto';
    const styles = {
      left: {
        wrapper: {
          width: elementSize,
          userSelect,
        },
        divider: {
          width: this.addPx(this.dividerPx),
          height: '100%',
          right: dividerOffset,
          top: '0',
          position: this.dividerPosition,
          cursor: this.props.disabled ? '' : 'ew-resize',
        },
      },
      top: {
        wrapper: {
          height: elementSize,
          userSelect,
        },
        divider: {
          height: this.addPx(this.dividerPx),
          width: '100%',
          bottom: dividerOffset,
          left: '0',
          position: this.dividerPosition,
          cursor: this.props.disabled ? '' : 'ns-resize',
        },
      },
    };
    return styles[this.props.direction];
  }

  addListeners() {
    window.addEventListener('mouseup', this.handleMouseUp);
    window.addEventListener('mouseleave', this.stopResizing);
    window.addEventListener('mousemove', this.handleMouseMove);
  }

  removeListeners() {
    window.removeEventListener('mouseup', this.handleMouseUp);
    window.removeEventListener('mouseleave', this.stopResizing);
    window.removeEventListener('mousemove', this.handleMouseMove);
  }

  addPx(numberOfPixels) {
    return `${numberOfPixels}px`;
  }

  handleMouseUp(event) {
    if (!this.props.disabled && this.state.resizing && event.button !== 2) {
      this.attemptResize(event);
      this.stopResizing();
    }
  }

  handleMouseDown(event) {
    if (!this.props.disabled && !this.state.resizing && event.button !== 2) {
      this.startResizing(event);
    }
  }

  handleMouseMove(event) {
    if (!this.props.disabled && this.state.resizing) {
      this.attemptResize(event);
    }
  }

  startResizing(event) {
    this.setState({
      resizing: true,
      initialMousePosition: this.props.direction === 'left' ? event.pageX : event.pageY,
    });
  }

  stopResizing() {
    this.setState({
      resizing: false,
    });
  }

  resize(newPx, newMousePosition) {
    this.props.setPx(newPx);
    this.setState({
      initialMousePosition: newMousePosition,
    });
  }

  attemptResize(event) {
    const newMousePosition = this.props.direction === 'left' ? event.pageX : event.pageY;
    const newPx = this.props.px + (this.state.initialMousePosition - newMousePosition);
    let limitedNewPx = Math.min(this.props.maxPx, newPx);
    limitedNewPx = Math.max(this.props.minPx, limitedNewPx);
    if (limitedNewPx === newPx) {
      this.resize(newPx, newMousePosition);
    }
    return this.stopEvent(event);
  }

  stopEvent(event) {
    if (event.stopPropagation) event.stopPropagation();
    if (event.preventDefault) event.preventDefault();
    return false;
  }

  render() {
    const styles = this.getStyles();
    return (
      <div style={[styles.wrapper, this.props.styles]}>
        <div style={styles.divider} onMouseDown={this.handleMouseDown} disabled={this.props.disabled}>
          {this.props.disabled
            ?
              ''
            :
              <span>
                <div style={[this.dividerHandleStyle, { left: this.leftDividerHandleOffset }]}></div>
                <div style={[this.dividerHandleStyle, { left: this.rightDividerHandleOffset }]}></div>
              </span>
          }
        </div>
        {this.props.children}
      </div>
    );
  }
}

Resizable.propTypes = {
  children: PropTypes.element,
  direction: PropTypes.oneOf(['left', 'top']).isRequired,
  disabled: PropTypes.bool.isRequired,
  disabledPx: PropTypes.number.isRequired,
  setPx: PropTypes.func.isRequired,
  px: PropTypes.number.isRequired,
  minPx: PropTypes.number.isRequired,
  maxPx: PropTypes.number.isRequired,
  styles: React.PropTypes.object,
};

export default Radium(Resizable);
