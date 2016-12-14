/*
 *
 * Login actions
 *
 */

import {
  DEFAULT_ACTION,
  LOGIN_SUCCESS,
  SET_AUTHENTICATED,
  LOGIN_ERROR,
  INIT_SDK,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function loginSuccess() {
  return {
    type: LOGIN_SUCCESS,
  };
}

export function loginError() {
  return {
    type: LOGIN_ERROR,
  };
}

export function setAuthenticated(authed) {
  return {
    type: SET_AUTHENTICATED,
    authed,
  };
}

export function initSDK(sdk) {
  return {
    type: INIT_SDK,
    sdk,
  };
}
