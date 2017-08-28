/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { isValidNumber } from 'utils/validator';

import ErrorBoundary from 'components/ErrorBoundary';

import { selectHasVoiceInteraction } from 'containers/AgentDesktop/selectors';

import OutboundInteractionButton from './index';
import messages from './messages';

export class OutboundCallButton extends React.Component {
  isEnabled = () =>
    !this.props.hasVoiceInteraction && isValidNumber(this.props.phoneNumber);

  getTitle = () => {
    if (this.props.hasVoiceInteraction) {
      return messages.voiceInteractionAlreadyExists;
    } else if (!isValidNumber(this.props.phoneNumber)) {
      return messages.enterValidPhone;
    } else {
      return this.props.phoneNumber;
    }
  };

  render() {
    return (
      <OutboundInteractionButton
        channelType="voice"
        endpoint={this.props.phoneNumber}
        isEnabled={this.isEnabled()}
        title={this.getTitle()}
      />
    );
  }
}

const mapStateToProps = (state, props) => ({
  hasVoiceInteraction: selectHasVoiceInteraction(state, props),
});

OutboundCallButton.propTypes = {
  phoneNumber: PropTypes.string.isRequired,
  hasVoiceInteraction: PropTypes.bool.isRequired,
};

export default ErrorBoundary(connect(mapStateToProps)(OutboundCallButton));
