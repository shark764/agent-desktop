/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/**
*
* Collapsible
*
*/

/* eslint-disable */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Icon from 'components/Icon';

const styles = {
  iconClosed: {
    marginTop: '6px',
    height: '8px',
    width: '13.33px',
    transition: 'transform 0.5s',
  },
  iconOpen: {
    transform: 'rotate(180deg)',
  },
};

class Collapsible extends Component {
  constructor(props) {
    super(props);

    // Bind class methods
    this.handleTriggerClick = this.handleTriggerClick.bind(this);
    this.handleTransitionEnd = this.handleTransitionEnd.bind(this);
    this.continueOpenCollapsible = this.continueOpenCollapsible.bind(this);

    // Defaults the dropdown to be closed
    if (this.props.open) {
      this.state = {
        isClosed: false,
        shouldSwitchAutoOnNextCycle: false,
        height: 'auto',
        transition: 'none',
        hasBeenOpened: true,
        overflow: this.props.overflowWhenOpen,
        inTransition: false,
      };
    } else {
      this.state = {
        isClosed: true,
        shouldSwitchAutoOnNextCycle: false,
        height: 0,
        transition: `height ${this.props.transitionTime}ms ${this.props
          .easing}`,
        hasBeenOpened: false,
        overflow: 'hidden',
        inTransition: false,
      };
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.shouldOpenOnNextCycle) {
      this.continueOpenCollapsible();
    }

    if (
      prevState.height === 'auto' &&
      this.state.shouldSwitchAutoOnNextCycle === true
    ) {
      window.setTimeout(() => {
        // Set small timeout to ensure a true re-render
        this.setState({
          height: 0,
          overflow: 'hidden',
          isClosed: true,
          shouldSwitchAutoOnNextCycle: false,
        });
      }, 50);
    }

    // If there has been a change in the open prop (controlled by accordion)
    if (prevProps.open !== this.props.open) {
      if (this.props.open === true) {
        this.openCollapsible();
      } else {
        this.closeCollapsible();
      }
    }
  }

  closeCollapsible() {
    this.setState({
      shouldSwitchAutoOnNextCycle: true,
      height: this.refs.inner.offsetHeight,
      transition: `height ${this.props.transitionTime}ms ${this.props.easing}`,
      inTransition: true,
    });
  }

  openCollapsible() {
    this.setState({
      inTransition: true,
      shouldOpenOnNextCycle: true,
    });
  }

  continueOpenCollapsible() {
    this.setState({
      height: this.refs.inner.offsetHeight,
      transition: `height ${this.props.transitionTime}ms ${this.props.easing}`,
      isClosed: false,
      hasBeenOpened: true,
      inTransition: true,
      shouldOpenOnNextCycle: false,
    });
  }

  handleTriggerClick(event) {
    event.preventDefault();

    if (this.props.triggerDisabled) {
      return;
    }

    if (this.props.handleTriggerClick) {
      this.props.handleTriggerClick(this.props.accordionPosition);
    } else if (this.state.isClosed === true) {
      this.openCollapsible();
      this.props.onOpening();
    } else {
      this.closeCollapsible();
      this.props.onClosing();
    }
  }

  renderNonClickableTriggerElement() {
    if (
      this.props.triggerSibling &&
      typeof this.props.triggerSibling === 'string'
    ) {
      return (
        <span className={`${this.props.classParentString}__trigger-sibling`}>
          {this.props.triggerSibling}
        </span>
      );
    } else if (this.props.triggerSibling) {
      return <this.props.triggerSibling />;
    }

    return null;
  }

  handleTransitionEnd() {
    // Switch to height auto to make the container responsive
    if (!this.state.isClosed) {
      this.setState({ height: 'auto', inTransition: false });
      this.props.onOpen();
    } else {
      this.setState({ inTransition: false });
      this.props.onClose();
    }
  }

  render() {
    const dropdownStyle = {
      height: this.state.height,
      WebkitTransition: this.state.transition,
      msTransition: this.state.transition,
      transition: this.state.transition,
      overflow: this.state.overflow,
    };

    const openClass = this.state.isClosed ? 'is-closed' : 'is-open';
    const disabledClass = this.props.triggerDisabled ? 'is-disabled' : '';

    // If user wants different text when tray is open
    const trigger =
      this.state.isClosed === false && this.props.triggerWhenOpen !== undefined
        ? this.props.triggerWhenOpen
        : this.props.trigger;

    // Don't render children until the first opening of the Collapsible if lazy rendering is enabled
    const children =
      this.state.isClosed && !this.state.inTransition
        ? null
        : this.props.children;

    // Construct CSS classes strings
    const triggerClassString = `${this.props.classParentString}__trigger`;
    const triggerContainerClassString = `${this.props
      .classParentString}__trigger-container ${openClass} ${disabledClass} ${this
      .state.isClosed
      ? this.props.triggerClassName
      : this.props.triggerOpenedClassName}`;
    const parentClassString = `${this.props.classParentString} ${this.state
      .isClosed
      ? this.props.className
      : this.props.openedClassName}`;
    const outerClassString = `${this.props
      .classParentString}__contentOuter ${this.props.contentOuterClassName}`;
    const innerClassString = `${this.props
      .classParentString}__contentInner ${this.props.contentInnerClassName}`;

    return (
      <div className={parentClassString.trim()}>
        <div
          className={triggerContainerClassString}
          onClick={this.handleTriggerClick}
        >
          <div className={'Collapsible__trigger-text'}>
            <div className={'Collapsible__trigger-header'}>
              {this.props.triggerHeader}
            </div>
            <div className={triggerClassString.trim()}>
              {trigger}
            </div>
          </div>
          <Icon
            name={'caret'}
            style={[styles.iconClosed, !this.state.isClosed && styles.iconOpen]}
          />
        </div>
        {this.renderNonClickableTriggerElement()}

        <div
          className={outerClassString.trim()}
          ref="outer"
          style={dropdownStyle}
          onTransitionEnd={this.handleTransitionEnd}
        >
          <div className={innerClassString.trim()} ref="inner">
            {children}
          </div>
        </div>
      </div>
    );
  }
}

Collapsible.propTypes = {
  transitionTime: PropTypes.number,
  easing: PropTypes.string,
  open: PropTypes.bool,
  classParentString: PropTypes.string,
  openedClassName: PropTypes.string,
  triggerClassName: PropTypes.string,
  triggerOpenedClassName: PropTypes.string,
  contentOuterClassName: PropTypes.string,
  contentInnerClassName: PropTypes.string,
  accordionPosition: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  handleTriggerClick: PropTypes.func,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
  onOpening: PropTypes.func,
  onClosing: PropTypes.func,
  trigger: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  triggerWhenOpen: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  triggerDisabled: PropTypes.bool,
  lazyRender: PropTypes.bool,
  overflowWhenOpen: PropTypes.oneOf([
    'hidden',
    'visible',
    'auto',
    'scroll',
    'inherit',
    'initial',
    'unset',
  ]),
  triggerSibling: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
};

Collapsible.defaultProps = {
  transitionTime: 400,
  easing: 'linear',
  open: false,
  classParentString: 'Collapsible',
  triggerDisabled: false,
  lazyRender: false,
  overflowWhenOpen: 'hidden',
  openedClassName: '',
  triggerClassName: '',
  triggerOpenedClassName: '',
  contentOuterClassName: '',
  contentInnerClassName: '',
  className: '',
  triggerSibling: null,
  onOpen: () => {},
  onClose: () => {},
  onOpening: () => {},
  onClosing: () => {},
};

export default Collapsible;
