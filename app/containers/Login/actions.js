/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 *
 * Login actions
 *
 */

import * as ACTIONS from './constants';

export function setInitiatedStandalonePopup() {
  return {
    type: ACTIONS.SET_INITIATED_STANDALONE_POPUP,
  };
}

export function setLoading(loading) {
  return {
    type: ACTIONS.SET_LOADING,
    loading,
  };
}

export function errorOccurred() {
  return {
    type: ACTIONS.ERROR_OCCURRED,
  };
}

export function loginSuccess(agent, authMethod) {
  return {
    type: ACTIONS.LOGIN_SUCCESS,
    agent,
    authMethod,
  };
}

export function setAccountTenants(tenants) {
  return {
    type: ACTIONS.SET_ACCOUNT_TENANTS,
    tenants,
  };
}

export function setTenant(id, name) {
  return {
    type: ACTIONS.SET_TENANT,
    id,
    name,
  };
}

export function resetPassword(email) {
  return {
    type: ACTIONS.RESET_PASSWORD,
    email,
  };
}

export function showLogin(show) {
  return {
    type: ACTIONS.SHOW_LOGIN,
    show,
  };
}

export function setDisplayState(displayState) {
  return {
    type: ACTIONS.SET_DISPLAY_STATE,
    displayState,
  };
}

export function logout() {
  return {
    type: ACTIONS.LOGOUT,
  };
}
