/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { isValidEmail } from 'utils/validator';

import ErrorBoundary from 'components/ErrorBoundary';

import { selectInteractionEmails } from 'containers/AgentDesktop/selectors';

import OutboundInteractionButton from './index';
import messages from './messages';

export class OutboundEmailButton extends React.Component {
  isEnabled = () =>
    isValidEmail(this.props.email) &&
    !this.props.interactionEmails.includes(this.props.email);

  getTitle = () => {
    if (!isValidEmail(this.props.email)) {
      return messages.enterValidEmail;
    } else if (this.props.interactionEmails.includes(this.props.email)) {
      return messages.emailInUse;
    } else {
      return this.props.email;
    }
  };

  render() {
    return (
      <OutboundInteractionButton
        channelType="email"
        endpoint={this.props.email}
        isEnabled={this.isEnabled()}
        title={this.getTitle()}
      />
    );
  }
}

const mapStateToProps = (state, props) => ({
  interactionEmails: selectInteractionEmails(state, props),
});

OutboundEmailButton.propTypes = {
  email: PropTypes.string.isRequired,
  interactionEmails: PropTypes.array.isRequired,
};

export default ErrorBoundary(connect(mapStateToProps)(OutboundEmailButton));
