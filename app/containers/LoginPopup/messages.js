/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 * LoginPopup Messages
 *
 * This contains all the text for the LoginPopup component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  tokenExpiredMsgCxIdp: {
    id: 'app.containers.Login.tokenExpiredMsgCxIdp',
    defaultMessage: 'Please enter your password to sign in again.',
  },
  signInButton: {
    id: 'app.containers.Login.signInButton',
    defaultMessage: 'Sign In',
  },
  signOutButton: {
    id: 'app.containers.Login.signOutButton',
    defaultMessage: 'Sign Out',
  },
});
