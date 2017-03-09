/*
 * ErrorBanner Messages
 *
 * This contains all the text for the ErrorBanner component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  tryAgain: {
    id: 'app.components.ErrorBanner.tryAgain',
    defaultMessage: 'Try again.',
  },
  serverError: {
    id: 'app.components.ErrorBanner.serverError',
    defaultMessage: 'Server Error',
  },
  networkError: {
    id: 'app.components.ErrorBanner.networkError',
    defaultMessage: 'Network Error',
  },
  notSaved: {
    id: 'app.components.ErrorBanner.notSaved',
    defaultMessage: 'Your changes have not been saved.',
  },
  notCreated: {
    id: 'app.components.ErrorBanner.notCreated',
    defaultMessage: 'Your new contact has not been created.',
  },
  notAssigned: {
    id: 'app.components.ErrorBanner.notAssigned',
    defaultMessage: 'Contact was not assigned to the interaction.',
  },
});
