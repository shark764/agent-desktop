/*
 *
 * Errors actions
 *
 */

import {
  HANDLE_SDK_ERROR,
  SET_CRITICAL_ERROR,
} from './constants';

export function handleSDKError(error, topic) {
  return {
    type: HANDLE_SDK_ERROR,
    error,
    topic,
    // TODO: InitAction, canRetry
  };
}

export function setCriticalError() {
  return {
    type: SET_CRITICAL_ERROR,
  };
}
