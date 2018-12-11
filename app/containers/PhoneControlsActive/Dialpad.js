/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { selectActiveExtensionIsNotPstn } from 'containers/PhoneControlsActive/selectors';

import CircleIconButton from 'components/CircleIconButton';
import DialpadComponent from 'components/Dialpad';
import messages from './messages';

const styles = {
  circleIconButtonRow: {
    padding: '0 1.5px',
  },
};

export class Dialpad extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showActiveInteractionDialpad: false,
      activeInteractionDialpadText: '',
    };
  }

  setActiveInteractionDialpadText = (activeInteractionDialpadText) => {
    this.setState({ activeInteractionDialpadText });
  };

  toggleDialpad = () => {
    this.setState((prevState) => ({
      showActiveInteractionDialpad: !prevState.showActiveInteractionDialpad,
    }));
  };

  renderDialpad = () => {
    if (this.state.showActiveInteractionDialpad) {
      return (
        <DialpadComponent
          id="activeInteractionDialpad"
          interactionId={this.props.interactionId}
          setDialpadText={this.setActiveInteractionDialpadText}
          dialpadText={this.state.activeInteractionDialpadText}
          inCall
          toggle={this.toggleDialpad}
          transfer={false}
          dialpadPosition={this.context.toolbarMode ? '-165px' : undefined}
        />
      );
    }
    return null;
  };

  render() {
    if (this.props.activeExtensionIsNotPstn) {
      return (
        <CircleIconButton
          id="dialpadButton"
          name="dialpad"
          title={messages.keypad}
          active={this.state.showActiveInteractionDialpad}
          onClick={this.toggleDialpad}
          style={styles.circleIconButtonRow}
          innerElement={this.renderDialpad()}
        />
      );
    }
    return null;
  }
}

Dialpad.contextTypes = {
  toolbarMode: PropTypes.bool,
};

Dialpad.propTypes = {
  interactionId: PropTypes.string.isRequired,
  activeExtensionIsNotPstn: PropTypes.bool.isRequired,
};

const mapStateToProps = (state, props) => ({
  activeExtensionIsNotPstn: selectActiveExtensionIsNotPstn(state, props),
});

export default connect(mapStateToProps)(Dialpad);
