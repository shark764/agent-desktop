/*
 * Error Messages
 *
 * This contains all the text for the Errors component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  failedToGetUserConfig: {
    id: 'app.containers.Errors.failedToGetUserConfig',
    defaultMessage: 'Failed to get user configuration. Please try again.',
  },
  invalidExtension: {
    id: 'app.containers.Errors.invalidExtension',
    defaultMessage: 'The extension selected is no longer valid. Please select a new extension.',
  },
  failedToUpdateExtension: {
    id: 'app.containers.Errors.failedToUpdateExtension',
    defaultMessage: 'Failed to update user extension. Please try again.',
  },
  invalidReasonInfo: {
    id: 'app.containers.Errors.invalidReasonInfo',
    defaultMessage: 'Reason code selected is invalid. Please select a different reason code.',
  },
  failedToChangeState: {
    id: 'app.containers.Errors.failedToChangeState',
    defaultMessage: 'Failed to change agent state. The server returned an error.',
  },
  emailFailed: {
    id: 'app.containers.Errors.emailFailed',
    defaultMessage: 'Outbound email failed. Please try again or rrefresh your browser.',
  },
  default: {
    id: 'app.containers.Errors.default',
    defaultMessage: 'Something went wrong... Please try again or refresh your browser.',
  },
});
