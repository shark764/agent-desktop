/*
 *
 * Errors actions
 *
 */

import {
  HANDLE_SDK_ERROR,
  SET_CRITICAL_ERROR,
  SET_NON_CRITICAL_ERROR,
  DISMISS_ERROR,
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

export function setNonCriticalError(error) {
  return {
    type: SET_NON_CRITICAL_ERROR,
    error,
  };
}

export function dismissError() {
  return {
    type: DISMISS_ERROR,
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
