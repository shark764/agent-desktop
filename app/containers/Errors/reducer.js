/*
 *
 * Errors reducer
 *
 */

import { fromJS } from 'immutable';
import {
  SET_CRITICAL_ERROR,
  ADD_STAT_ERROR_ID,
  REMOVE_STAT_ERROR_ID,
} from './constants';

const initialState = fromJS({
  stats: {
    erroredIds: [],
  },
});

function errorsReducer(state = initialState, action) {
  switch (action.type) {
    case SET_CRITICAL_ERROR:
      return state.set('criticalError', true);
    case ADD_STAT_ERROR_ID:
      return state.updateIn(['stats', 'erroredIds'], (erroredStatIds) =>
        erroredStatIds.push(action.statId)
      );
    case REMOVE_STAT_ERROR_ID:
      return state.updateIn(['stats', 'erroredIds'], (erroredStatIds) =>
        erroredStatIds.filter((statId) => statId !== action.statId)
      );
    default:
      return state;
  }
}

export default errorsReducer;
