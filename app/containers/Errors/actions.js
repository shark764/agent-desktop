/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 *
 * Errors actions
 *
 */

import * as ACTIONS from './constants';

export function handleSDKError(error, topic) {
  return {
    type: ACTIONS.HANDLE_SDK_ERROR,
    error,
    topic,
    // TODO: InitAction, canRetry
  };
}

export function setCriticalError(error) {
  return {
    type: ACTIONS.SET_CRITICAL_ERROR,
    error,
  };
}

export function setSessionEndedBySupervisor(response, error) {
  return {
    type: ACTIONS.SET_SESSION_ENDED_BY_SUPERVISOR,
    response,
    error,
  };
}

export function setNonCriticalError(error, interactionFatal) {
  return {
    type: ACTIONS.SET_NON_CRITICAL_ERROR,
    error,
    interactionFatal,
  };
}

export function dismissError() {
  return {
    type: ACTIONS.DISMISS_ERROR,
  };
}

export function addStatErrorId(statId) {
  return {
    type: ACTIONS.ADD_STAT_ERROR_ID,
    statId,
  };
}

export function removeStatErrorId(statId) {
  return {
    type: ACTIONS.REMOVE_STAT_ERROR_ID,
    statId,
  };
}

export function addErrorToHistory(error) {
  return {
    type: ACTIONS.ADD_ERROR_TO_HISTORY,
    error,
  };
}
