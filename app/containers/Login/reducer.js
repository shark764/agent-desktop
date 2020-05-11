/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 *
 * Login reducer
 *
 */

import { fromJS } from 'immutable';
import * as ACTIONS from './constants';

const initialState = fromJS({
  displayState: ACTIONS.CX_LOGIN,
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
    case ACTIONS.SET_INITIATED_STANDALONE_POPUP:
      return state.set('initiatedStandalonePopup', true);
    case ACTIONS.SET_DISPLAY_STATE:
      return state.set('displayState', action.displayState);
    case ACTIONS.SET_LOADING:
      return state.set('loading', action.loading);
    case ACTIONS.ERROR_OCCURRED:
      return state.set('loading', false);
    case ACTIONS.LOGIN_SUCCESS:
      return state
        .set('agent', fromJS(action.agent))
        .set('logged_in', true)
        .set('authMethod', action.authMethod);
    case ACTIONS.SET_ACCOUNT_TENANTS:
      return state.setIn(['agent', 'accountTenants'], action.tenants);
    case ACTIONS.SET_TENANT:
      return state.set('tenant', fromJS({ id: action.id, name: action.name }));
    case ACTIONS.SHOW_LOGIN:
      return state.set('showLogin', action.show);
    default:
      return state;
  }
}

export default loginReducer;
