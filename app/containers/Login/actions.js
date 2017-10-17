/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 *
 * Login actions
 *
 */

import {
  SET_INITIATED_STANDALONE_POPUP,
  LOGGING_IN,
  ERROR_OCCURRED,
  LOGIN_SUCCESS,
  RESET_PASSWORD,
  SHOW_LOGIN,
  SETTING_TENANT,
  SET_TENANT,
  LOGOUT,
  SET_COGNITO_READY,
} from './constants';

export function setInitiatedStandalonePopup() {
  return {
    type: SET_INITIATED_STANDALONE_POPUP,
  };
}

export function loggingIn() {
  return {
    type: LOGGING_IN,
  };
}

export function errorOccurred() {
  return {
    type: ERROR_OCCURRED,
  };
}

export function loginSuccess(agent) {
  return {
    type: LOGIN_SUCCESS,
    agent,
  };
}

export function logout() {
  return {
    type: LOGOUT,
  };
}

export function settingTenant() {
  return {
    type: SETTING_TENANT,
  };
}

export function setTenant(id, name) {
  return {
    type: SET_TENANT,
    id,
    name,
  };
}

export function resetPassword(email) {
  return {
    type: RESET_PASSWORD,
    email,
  };
}

export function showLogin(show) {
  return {
    type: SHOW_LOGIN,
    show,
  };
}

export function setCognitoReady() {
  return {
    type: SET_COGNITO_READY,
  };
}
