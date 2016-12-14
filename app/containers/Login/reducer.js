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
  INIT_SDK,
} from './constants';

const initialState = fromJS({
  authed: false,
});

function loginReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case LOGIN_SUCCESS:
      return state
        .set('logged_in', true)
        .set('login_error', false);
    case SET_AUTHENTICATED:
      return state
        .set('authed', action.authed);
    case LOGIN_ERROR:
      return state
        .set('login_error', true)
        .set('logged_in', false);
    case INIT_SDK:
    //   console.log(action.sdk);
      return state
        .set('sdk', action.sdk);
    default:
      return state;
  }
}

export default loginReducer;
