/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/**
 *
 * LoginPopup
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Radium from 'radium';
import { injectIntl, intlShape } from 'react-intl';

import ErrorBoundary from 'components/ErrorBoundary';

import CenteredConfirmationPopup from 'components/CenteredConfirmationPopup';
import { showLoginPopup } from 'containers/AgentDesktop/actions';

import { REAUTH_POPUP_OPTIONS } from 'containers/AgentDesktop/constants';
import messages from './messages';

const storage = window.localStorage;

class LoginPopup extends React.Component {
  // to log back in, we put in localStorage everything needed to login except for the password...
  initiateLogin = (passwordVal) => {
    this.props.showLoginPopup({
      showLoginPopup: false,
      reauthPassword: passwordVal,
    });
  };

  signOut = () => {
    // get rid of our local storage stuff and refresh so it's like nothing happened...
    storage.removeItem(REAUTH_POPUP_OPTIONS);
    window.location.reload();
  };

  render() {
    return (
      <CenteredConfirmationPopup
        displayPasswordField
        modalDescriptionText={this.props.intl.formatMessage(messages.tokenExpiredMsgCxIdp)}
        loginBtn={{
          text: this.props.intl.formatMessage(messages.signInButton),
          type: 'primaryBlueBig',
          id: 'loginBtn',
          callback: this.initiateLogin,
        }}
        logoutBtn={{
          text: this.props.intl.formatMessage(messages.signOutButton),
          type: 'secondary',
          id: 'logoutBtn',
          callback: this.signOut,
        }}
      />
    )
  }
}

LoginPopup.propTypes = {
  showLoginPopup: PropTypes.func,
  intl: intlShape.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    showLoginPopup: (popupConfig) => dispatch(showLoginPopup(popupConfig)),
    dispatch,
  };
}

export default ErrorBoundary(
  injectIntl(connect(null, mapDispatchToProps)(Radium(LoginPopup)))
);
