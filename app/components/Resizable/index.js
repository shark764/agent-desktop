/**
*
* Resizable
*
*/

import React, { PropTypes } from 'react';

import Radium from 'radium';

class Resizable extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      currentPx: Number(props.initialPx),
      resizing: false,
    };

    this.dividerPx = 11;
    this.dividerPosition = 'absolute';
    const dividerHandleOffsetPx = (this.dividerPx / 4) - 1;
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
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.startResizing = this.startResizing.bind(this);
    this.stopResizing = this.stopResizing.bind(this);
    this.resize = this.resize.bind(this);

    if (typeof window !== 'undefined') {
      window.addEventListener('mouseup', this.handleMouseUp);
      window.addEventListener('mouseleave', this.stopResizing);
      window.addEventListener('mousemove', this.handleMouseMove);
    }
  }

  getStyles() {
    const elementSize = this.addPx(this.state.currentPx);
    const dividerOffset = this.addPx(this.state.currentPx - (this.dividerPx / 2));
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
          cursor: 'ew-resize',
          position: this.dividerPosition,
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
          cursor: 'ns-resize',
          position: this.dividerPosition,
        },
      },
    };
    return styles[this.props.direction];
  }

  addPx(numberOfPixels) {
    return `${numberOfPixels}px`;
  }

  handleMouseUp(event) {
    if (this.state.resizing && event.button !== 2) {
      this.stopResizing();
    }
  }

  handleMouseDown(event) {
    if (!this.state.resizing && event.button !== 2) {
      this.startResizing(event);
    }
  }

  handleMouseMove(event) {
    if (this.state.resizing) {
      this.resize(event);
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

  resize(event) {
    const newMousePosition = this.props.direction === 'left' ? event.pageX : event.pageY;
    const newPx = this.state.currentPx + (this.state.initialMousePosition - newMousePosition);
    let limitedNewPx = Math.min(this.props.maxPx, newPx);
    limitedNewPx = Math.max(this.props.minPx, limitedNewPx);
    if (limitedNewPx === newPx) {
      this.setState({
        currentPx: newPx,
        initialMousePosition: newMousePosition,
      });
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
        <div style={styles.divider} onMouseDown={this.handleMouseDown}>
          <div style={[this.dividerHandleStyle, { left: this.leftDividerHandleOffset }]}></div>
          <div style={[this.dividerHandleStyle, { left: this.rightDividerHandleOffset }]}></div>
        </div>
        {this.props.children}
      </div>
    );
  }
}

Resizable.propTypes = {
  children: PropTypes.element,
  direction: PropTypes.oneOf(['left', 'top']).isRequired,
  initialPx: PropTypes.number.isRequired,
  minPx: PropTypes.number.isRequired,
  maxPx: PropTypes.number.isRequired,
  styles: React.PropTypes.object,
};

export default Radium(Resizable);
