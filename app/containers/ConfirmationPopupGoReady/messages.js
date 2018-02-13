/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 * ConfirmationPopupGoReady Messages
 *
 * This contains all the text for the ConfirmationPopupGoReady component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  tokenExpiredMsg: {
    id: 'app.containers.AgentStatusMenu.tokenExpiredMsg',
    defaultMessage: 'Your session has expired. Click below to automatically log back in or log out.',
  },
  resumeBtnText: {
    id: 'app.containers.AgentStatusMenu.resumeBtnText',
    defaultMessage: 'Log In',
  },
  logoutBtnText: {
    id: 'app.containers.AgentStatusMenu.logoutBtnText',
    defaultMessage: 'Log Out',
  },
});
