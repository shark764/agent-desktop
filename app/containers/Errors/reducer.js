/*
 *
 * Errors reducer
 *
 */

import { fromJS } from 'immutable';
import {
  SET_CRITICAL_ERROR,
} from './constants';

const initialState = fromJS({});

function errorsReducer(state = initialState, action) {
  switch (action.type) {
    case SET_CRITICAL_ERROR:
      return state.set('criticalError', true);
    default:
      return state;
  }
}

export default errorsReducer;
