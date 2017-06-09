/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 *
 * Login actions
 *
 */

import {
  LOGGING_IN,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  TENANT_ERROR,
  RESET_PASSWORD,
  SHOW_LOGIN,
  SETTING_TENANT,
  SET_TENANT,
  LOGOUT,
} from './constants';

export function loggingIn() {
  return {
    type: LOGGING_IN,
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

export function loginError() {
  return {
    type: LOGIN_ERROR,
  };
}

export function tenantError(error) {
  return {
    type: TENANT_ERROR,
    error,
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
