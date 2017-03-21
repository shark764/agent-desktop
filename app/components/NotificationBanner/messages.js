/*
 * NotificationBanner Messages
 *
 * This contains all the text for the NotificationBanner component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  tryAgain: {
    id: 'app.components.NotificationBanner.tryAgain',
    defaultMessage: 'Try again.',
  },
  serverError: {
    id: 'app.components.NotificationBanner.serverError',
    defaultMessage: 'Server Error',
  },
  networkError: {
    id: 'app.components.NotificationBanner.networkError',
    defaultMessage: 'Network Error',
  },
  created: {
    id: 'app.components.NotificationBanner.created',
    defaultMessage: 'Contact created.',
  },
  saved: {
    id: 'app.components.NotificationBanner.saved',
    defaultMessage: 'Changes saved.',
  },
  notSaved: {
    id: 'app.components.NotificationBanner.notSaved',
    defaultMessage: 'Your changes have not been saved.',
  },
  notCreated: {
    id: 'app.components.NotificationBanner.notCreated',
    defaultMessage: 'Your new contact has not been created.',
  },
  notAssigned: {
    id: 'app.components.NotificationBanner.notAssigned',
    defaultMessage: 'Contact was not assigned to the interaction.',
  },
});
