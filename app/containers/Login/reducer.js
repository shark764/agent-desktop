/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

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
  // Uncomment below to hide login screen
  // showLogin: false,
  // agent: {
  //   fistName: 'Tom',
  //   lastName: 'Tucker',
  // },
  // tenant: {},
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
        .set('tenant', fromJS({ id: action.id, name: action.name }))
        .set('tenant_error', false);
    case SHOW_LOGIN:
      return state
        .set('showLogin', action.show);
    default:
      return state;
  }
}

export default loginReducer;
