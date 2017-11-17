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
  SET_INITIATED_STANDALONE_POPUP,
  SET_LOADING,
  ERROR_OCCURRED,
  LOGIN_SUCCESS,
  SHOW_LOGIN,
  SET_TENANT,
  SET_DISPLAY_STATE,
  CX_LOGIN,
} from './constants';

const initialState = fromJS({
  displayState: CX_LOGIN,
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
    case SET_INITIATED_STANDALONE_POPUP:
      return state.set('initiatedStandalonePopup', true);
    case SET_DISPLAY_STATE:
      return state.set('displayState', action.displayState);
    case SET_LOADING:
      return state.set('loading', action.loading);
    case ERROR_OCCURRED:
      return state.set('loading', false);
    case LOGIN_SUCCESS:
      return state.set('agent', fromJS(action.agent)).set('logged_in', true);
    case SET_TENANT:
      return state.set('tenant', fromJS({ id: action.id, name: action.name }));
    case SHOW_LOGIN:
      return state.set('showLogin', action.show);
    default:
      return state;
  }
}

export default loginReducer;
