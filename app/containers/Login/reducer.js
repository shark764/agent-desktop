/*
 *
 * Login reducer
 *
 */

import { fromJS } from 'immutable';
import {
  LOGGING_IN,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  TENANT_ERROR,
  SHOW_LOGIN,
  SETTING_TENANT,
  SET_TENANT,
  LOGOUT,
} from './constants';

const initialState = fromJS({
  loading: false,
  showLogin: true,
});

function loginReducer(state = initialState, action) {
  switch (action.type) {
    case LOGGING_IN:
    case SETTING_TENANT:
      return state
        .set('loading', true);
    case LOGIN_SUCCESS:
      return state
        .set('agent', fromJS(action.agent))
        .set('logged_in', true)
        .set('login_error', false)
        .set('loading', false);
    case LOGOUT:
      // TODO SDK.auth.logout();
      return state
        .set('agent', {})
        .set('logged_in', false)
        .set('showLogin', true)
        .set('loading', false);
    case LOGIN_ERROR:
      return state
        .set('login_error', true)
        .set('loading', false);
    case TENANT_ERROR:
      return state
        .set('tenant_error', true)
        .set('loading', false)
        .set('tenant_error_message', fromJS(action.error));
    case SET_TENANT:
      return state
        .set('tenant', { id: action.id, name: action.name });
    case SHOW_LOGIN:
      return state
        .set('showLogin', action.show);
    default:
      return state;
  }
}

export default loginReducer;
