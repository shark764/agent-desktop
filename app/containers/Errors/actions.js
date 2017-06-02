/*
 *
 * Errors actions
 *
 */

import {
  HANDLE_SDK_ERROR,
  SET_CRITICAL_ERROR,
  ADD_STAT_ERROR_ID,
  REMOVE_STAT_ERROR_ID,
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

export function addStatErrorId(statId) {
  return {
    type: ADD_STAT_ERROR_ID,
    statId,
  };
}

export function removeStatErrorId(statId) {
  return {
    type: REMOVE_STAT_ERROR_ID,
    statId,
  };
}
