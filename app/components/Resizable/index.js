/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/**
 *
 * Resizable
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';
import { throttleDecorator } from 'utils/animation';

class Resizable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isResizing: false,
      hideDivider: props.isDisabled,
    };

    this.dividerPx = 11;
    const dividerHandleOffsetPx = this.dividerPx / 4 - 1;
    this.dividerPosition = 'absolute';
    this.dividerHandle1Offset = this.addPx(dividerHandleOffsetPx);
    this.dividerHandle2Offset = this.addPx(
      this.dividerPx / 2 + dividerHandleOffsetPx
    );
    this.dividerHandleStyle = {
      top: '50%',
      position: 'absolute',
      height: this.props.direction === 'left' ? '18px' : '1px',
      width: this.props.direction === 'left' ? '1px' : '18px',
      background: '#D0D0D0',
    };

    this.resize = throttleDecorator(this.resize);
  }

  componentDidMount() {
    this.addListeners();
    this.wrapperElement.addEventListener(
      'transitionend',
      this.handleTransitionEnd,
      true
    );
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isDisabled !== this.props.isDisabled) {
      if (nextProps.isDisabled) {
        this.removeListeners();
        this.setState({
          hideDivider: true,
        });
      } else {
        this.addListeners();
        // Toolbar Mode to Kill Transition for left ( side panel )
        if (this.context.toolbarMode) {
          this.setState({
            hideDivider: false,
          });
        }
      }
    }
    return nextProps;
  }

  componentWillUnmount() {
    this.removeListeners();
  }

  getStyles = () => {
    // need to allow for reduced height when in Salesforce Lightning
    const elementSizeEnabledPx =
      this.props.crmModule && this.props.crmModule === 'salesforce-lightning'
        ? this.props.px - 29
        : this.props.px;
    const elementSize = this.addPx(
      this.props.isDisabled ? this.props.disabledPx : elementSizeEnabledPx
    );

    const dividerOffset = this.addPx(this.props.px - (this.dividerPx / 2 + 1));
    const userSelect = this.state.isResizing ? 'none' : 'auto';

    const styles = {
      left: {
        wrapper: {
          position: 'relative',
          width: elementSize,
          transition: this.state.isResizing ? '' : 'width 1s',
          userSelect,
          flex: '0 0 auto',
        },
        divider: {
          width: this.addPx(this.dividerPx),
          height: 'calc(100% - 64px)',
          right: dividerOffset,
          top: '64px',
          position: this.dividerPosition,
          cursor: 'ew-resize',
          zIndex: '2',
        },
        dividerHandle1: {
          left: this.dividerHandle1Offset,
        },
        dividerHandle2: {
          left: this.dividerHandle2Offset,
        },
      },
      top: {
        wrapper: {
          height: elementSize,
          userSelect,
          borderTop: '1px solid #D0D0D0',
          position: 'relative',
        },
        divider: {
          height: this.addPx(this.dividerPx),
          width: `calc(50% - ${this.dividerPx}px)`,
          bottom: dividerOffset,
          left: `calc(50% - ${this.dividerPx}px)`,
          position: this.dividerPosition,
          cursor: 'ns-resize',
          zIndex: '2',
        },
        dividerHandle1: {
          top: this.dividerHandle1Offset,
        },
        dividerHandle2: {
          top: this.dividerHandle2Offset,
        },
      },
    };
    // Toolbar Mode to Kill Transition for left ( side panel )
    if (this.context.toolbarMode) {
      styles.left.wrapper.transition = '';
      if (this.props.isDisabled) {
        styles.left.wrapper.width = '0px';
        styles.left.wrapper.borderLeft = '0px';
      }
    }
    return styles[this.props.direction];
  };

  handleTransitionEnd = () => {
    if (!this.props.isDisabled && this.state.hideDivider) {
      this.setState({
        hideDivider: false,
      });
    }
  };

  addListeners = () => {
    window.addEventListener('mouseup', this.handleMouseUp);
    window.addEventListener('mouseleave', this.stopResizing);
    window.addEventListener('mousemove', this.handleMouseMove);
  };

  removeListeners = () => {
    window.removeEventListener('mouseup', this.handleMouseUp);
    window.removeEventListener('mouseleave', this.stopResizing);
    window.removeEventListener('mousemove', this.handleMouseMove);
  };

  addPx = (numberOfPixels) => `${numberOfPixels}px`;

  handleMouseUp = (event) => {
    if (!this.props.isDisabled && this.state.isResizing && event.button !== 2) {
      this.attemptResize(event);
      this.stopResizing();
    }
  };

  handleMouseDown = (event) => {
    if (
      !this.props.isDisabled &&
      !this.state.isResizing &&
      event.button !== 2
    ) {
      this.startResizing(event);
    }
  };

  handleMouseMove = (event) => {
    if (!this.props.isDisabled && this.state.isResizing) {
      this.attemptResize(event);
    }
  };

  startResizing = (event) => {
    this.setState({
      isResizing: true,
      initialMousePosition:
        this.props.direction === 'left' ? event.pageX : event.pageY,
    });
  };

  stopResizing = () => {
    this.setState({
      isResizing: false,
    });
  };

  resize = (newPx, newMousePosition) => {
    this.props.setPx(newPx);
    this.setState({
      initialMousePosition: newMousePosition,
    });
  };

  attemptResize = (event) => {
    const newMousePosition =
      this.props.direction === 'left' ? event.pageX : event.pageY;
    const newPx =
      this.props.px + (this.state.initialMousePosition - newMousePosition);
    let limitedNewPx = Math.min(this.props.maxPx, newPx);
    limitedNewPx = Math.max(this.props.minPx, limitedNewPx);
    if (limitedNewPx === newPx) {
      this.resize(newPx, newMousePosition);
    }
    return this.stopEvent(event);
  };

  stopEvent = (event) => {
    if (event.stopPropagation) event.stopPropagation();
    if (event.preventDefault) event.preventDefault();
    return false;
  };

  render() {
    const styles = this.getStyles();
    return (
      <div
        style={[styles.wrapper, this.props.style]}
        ref={(element) => {
          this.wrapperElement = element;
        }}
      >
        {this.state.hideDivider ? (
          ''
        ) : (
          <div
            id={`${this.props.id}-handle`}
            style={styles.divider}
            onMouseDown={this.handleMouseDown}
            disabled={this.props.isDisabled}
          >
            <span>
              <div style={[this.dividerHandleStyle, styles.dividerHandle1]} />
              <div style={[this.dividerHandleStyle, styles.dividerHandle2]} />
            </span>
          </div>
        )}
        {this.props.children}
      </div>
    );
  }
}

Resizable.propTypes = {
  children: PropTypes.element,
  direction: PropTypes.oneOf(['left', 'top']).isRequired,
  isDisabled: PropTypes.bool.isRequired,
  disabledPx: PropTypes.number.isRequired,
  setPx: PropTypes.func.isRequired,
  px: PropTypes.number.isRequired,
  minPx: PropTypes.number.isRequired,
  maxPx: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
  style: PropTypes.object,
  crmModule: PropTypes.string,
};

Resizable.contextTypes = {
  toolbarMode: PropTypes.bool,
};

export default Radium(Resizable);
