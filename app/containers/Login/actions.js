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
  SET_TENANTS,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function loginSuccess(agent) {
  return {
    type: LOGIN_SUCCESS,
    agent,
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

export function setTenants(tenants) {
  return {
    type: SET_TENANTS,
    tenants,
  };
}
