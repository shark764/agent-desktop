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
  'AD-1000': {
    id: 'app.containers.Errors.AD-1000',
    defaultMessage: 'No presence reason lists were found for this tenant.',
  },
  'AD-1001': {
    id: 'app.containers.Errors.AD-1001',
    defaultMessage: 'No extensions were found for this user.',
  },
  'AD-1002': {
    id: 'app.containers.Errors.AD-1002',
    defaultMessage: 'The username or password you have entered is not correct.',
  },
  'AD-1003': {
    id: 'app.containers.Errors.AD-1003',
    defaultMessage: 'You must first select a tenant.',
  },
  'AD-1004': {
    id: 'app.containers.Errors.AD-1004',
    defaultMessage: 'You have insufficient permissions to access tenant.',
  },
  'AD-1005': {
    id: 'app.containers.Errors.AD-1005',
    defaultMessage:
      'This account is not currently associated with an active tenant. Please reach out to your system administrator for assistance.',
  },
  'AD-1006': {
    id: 'app.containers.Errors.AD-1006',
    defaultMessage:
      'You must allow notifications through your browser to enable visual notifications.',
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
  2010: {
    id: 'app.containers.Errors.2010',
    defaultMessage: 'Unable to retrieve tenant data.',
  },
  2011: {
    id: 'app.containers.Errors.2011',
    defaultMessage: 'Unable to retrieve region data.',
  },
  3000: {
    id: 'app.containers.Errors.3000',
    defaultMessage: 'Cannot login due to service issues.',
  },
  3001: {
    id: 'app.containers.Errors.3001',
    defaultMessage: 'Cannot logout due to service issues.',
  },
  3002: {
    id: 'app.containers.Errors.3002',
    defaultMessage: 'Cannot login due to a bad request.',
  },
  3003: {
    id: 'app.containers.Errors.3003',
    defaultMessage: 'Cannot login. SSO initialization failed.',
  },
  3004: {
    id: 'app.containers.Errors.3004',
    defaultMessage: 'Failed to authenticate with SSO.',
  },
  3005: {
    id: 'app.containers.Errors.3005',
    defaultMessage: 'Failed to retrieve SSO authentication information.',
  },
  10002: {
    id: 'app.containers.Errors.10002',
    defaultMessage:
      'Outbound email failed. Please try again or refresh your browser.',
  },
  interactionFailed: {
    id: 'app.components.Errors.interactionFailed',
    defaultMessage:
      'Your interaction failed, please try again. If this issue continues please contact your administrator.',
  },
  ssoFailed: {
    id: 'app.components.Errors.ssoFailed',
    defaultMessage:
      'SSO Login Failed, please try again. If this issue continues please contact your administrator.',
  },
});
