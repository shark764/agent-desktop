/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { isPossibleNumber } from 'utils/validator';

import ErrorBoundary from 'components/ErrorBoundary';

import { selectSmsInteractionNumbers } from 'containers/AgentDesktop/selectors';

import OutboundInteractionButton from './index';
import messages from './messages';

export class OutboundSmsButton extends React.Component {
  isEnabled = () =>
    isPossibleNumber(this.props.phoneNumber) &&
    !this.props.smsInteractionNumbers.includes(this.props.phoneNumber);

  getTitle = () => {
    if (!isPossibleNumber(this.props.phoneNumber)) {
      return messages.enterValidPhone;
    } else if (
      this.props.smsInteractionNumbers.includes(this.props.phoneNumber)
    ) {
      return messages.numberInUse;
    } else {
      return this.props.phoneNumber;
    }
  };

  render() {
    return (
      <OutboundInteractionButton
        channelType="sms"
        endpoint={this.props.phoneNumber}
        isEnabled={this.isEnabled()}
        title={this.getTitle()}
      />
    );
  }
}

const mapStateToProps = (state, props) => ({
  smsInteractionNumbers: selectSmsInteractionNumbers(state, props),
});

OutboundSmsButton.propTypes = {
  phoneNumber: PropTypes.string.isRequired,
  smsInteractionNumbers: PropTypes.array.isRequired,
};

export default ErrorBoundary(connect(mapStateToProps)(OutboundSmsButton));
