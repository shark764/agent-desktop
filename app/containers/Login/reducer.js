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
  ERROR_OCCURRED,
  LOGIN_SUCCESS,
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
  agent: {
    // fistName: 'Tom',
    // lastName: 'Tucker',
    // userId: 'Id',
    tenants: [],
  },
  tenant: { id: '' },
});

function loginReducer(state = initialState, action) {
  switch (action.type) {
    case LOGGING_IN:
    case SETTING_TENANT:
      return state.set('loading', true);
    case ERROR_OCCURRED:
      return state.set('loading', false);
    case LOGIN_SUCCESS:
      return state
        .set('agent', fromJS(action.agent))
        .set('logged_in', true)
        .set('loading', false);
    case LOGOUT:
      return state
        .set('agent', {})
        .set('logged_in', false)
        .set('showLogin', true)
        .set('loading', false);
    case SET_TENANT:
      return state.set('tenant', fromJS({ id: action.id, name: action.name }));
    case SHOW_LOGIN:
      return state.set('showLogin', action.show);
    default:
      return state;
  }
}

export default loginReducer;
