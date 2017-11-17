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
  SET_LOADING,
  ERROR_OCCURRED,
  LOGIN_SUCCESS,
  RESET_PASSWORD,
  SHOW_LOGIN,
  SET_TENANT,
  SET_DISPLAY_STATE,
  LOGOUT,
} from './constants';

export function setInitiatedStandalonePopup() {
  return {
    type: SET_INITIATED_STANDALONE_POPUP,
  };
}

export function setLoading(loading) {
  return {
    type: SET_LOADING,
    loading,
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

export function setDisplayState(displayState) {
  return {
    type: SET_DISPLAY_STATE,
    displayState,
  };
}

export function logout() {
  return {
    type: LOGOUT,
  };
}
