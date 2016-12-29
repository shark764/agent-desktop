/*
 *
 * Login reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  LOGIN_SUCCESS,
  SET_AUTHENTICATED,
  LOGIN_ERROR,
  SET_TENANTS,
  SHOW_LOGIN,
  SET_TENANT,
  LOGOUT,
} from './constants';

const initialState = fromJS({
  authed: false,
  showLogin: true,
});

function loginReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case LOGIN_SUCCESS:
      return state
        .set('agent', action.agent)
        .set('logged_in', true)
        .set('login_error', false);
    case LOGOUT:
      window.SDK.Agent.logout();
      return state
        .set('agent', {})
        .set('logged_in', false)
        .set('login_error', false)
        .set('showLogin', true);
    case SET_AUTHENTICATED:
      return state
        .set('authed', action.authed);
    case LOGIN_ERROR:
      return state
        .set('login_error', true)
        .set('logged_in', false);
    case SET_TENANT:
      return state
        .set('tenant', { id: action.id, name: action.name });
    case SET_TENANTS:
      return state
        .set();
    case SHOW_LOGIN:
      return state
        .set('showLogin', action.show);
    default:
      return state;
  }
}

export default loginReducer;
