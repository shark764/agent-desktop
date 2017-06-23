/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 * Error Messages
 *
 * This contains all the text for the Errors component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  default: {
    id: 'app.containers.Errors.default',
    defaultMessage:
      'An unknown error has occurred. Please try to finish your work as you may need to refresh the page to continue.',
  },
  2001: {
    id: 'app.containers.Errors.2001',
    defaultMessage: 'Failed to get user configuration. Please try again.',
  },
  2003: {
    id: 'app.containers.Errors.2003',
    defaultMessage:
      'Session Expired. If this persists, please check your internet connection and ensure you are not logged in elsewhere.',
  },
  2004: {
    id: 'app.containers.Errors.2004',
    defaultMessage:
      'Failed to change agent state. The server returned an error.',
  },
  2005: {
    id: 'app.containers.Errors.2005',
    defaultMessage:
      'The extension selected is no longer valid. Please select a new extension.',
  },
  2006: {
    id: 'app.containers.Errors.2006',
    defaultMessage: 'Failed to update user extension. Please try again.',
  },
  2007: {
    id: 'app.containers.Errors.2007',
    defaultMessage:
      'Reason code selected is invalid. Please select a different reason code.',
  },
  10002: {
    id: 'app.containers.Errors.10002',
    defaultMessage:
      'Outbound email failed. Please try again or refresh your browser.',
  },
});
