/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/**
 *
 * ConfirmationPopupGoReady
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';

import CenteredConfirmationPopup from 'components/CenteredConfirmationPopup';
import { REAUTH_POPUP_OPTIONS } from 'containers/AgentDesktop/constants';

import messages from './messages';

const storage = window.localStorage;

class ConfirmationPopupGoReady extends React.Component {
  // to log back in, we put in localStorage everything needed to login except for the password...
  initiateLogin = () => {
    // if we DO have stuff set to go into localStorage, then it means that we're
    // about to reload the page, so let's save what we need to log back
    // in here (minus the password)
    if (Object.keys(this.props.propertiesForLocalStorage).length) {
      storage.setItem(
        REAUTH_POPUP_OPTIONS,
        JSON.stringify(this.props.propertiesForLocalStorage)
      );
    }

    // ...reload the window to log out no matter what
    CxEngage.authentication.logout();
    window.location.reload();
  };

  signOut = () => {
    // get rid of our local storage stuff and refresh so it's like nothing happened...
    storage.removeItem(REAUTH_POPUP_OPTIONS);
    window.location.reload();
  };

  render() {
    return (
      <CenteredConfirmationPopup
        displayPasswordField={false}
        modalDescriptionText={this.props.intl.formatMessage(
          messages.tokenExpiredMsg
        )}
        loginBtn={{
          text: this.props.intl.formatMessage(messages.resumeBtnText),
          type: 'primaryBlueBig',
          id: 'loginBtn',
          callback: this.initiateLogin,
        }}
        logoutBtn={{
          text: this.props.intl.formatMessage(messages.logoutBtnText),
          type: 'secondary',
          id: 'logoutBtn',
          callback: this.signOut,
        }}
      />
    );
  }
}

ConfirmationPopupGoReady.propTypes = {
  propertiesForLocalStorage: PropTypes.shape({
    isSso: PropTypes.bool,
    expiredSessionUsername: PropTypes.string,
    tenantId: PropTypes.string,
    name: PropTypes.string,
  }),
  intl: intlShape.isRequired,
};

export default injectIntl(ConfirmationPopupGoReady);
