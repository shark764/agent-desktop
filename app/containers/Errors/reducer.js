/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 *
 * Errors reducer
 *
 */

import { fromJS } from 'immutable';
import {
  SET_CRITICAL_ERROR,
  SET_NON_CRITICAL_ERROR,
  DISMISS_ERROR,
  ADD_STAT_ERROR_ID,
  REMOVE_STAT_ERROR_ID,
} from './constants';

const initialState = fromJS({
  // criticalError: { genericError: 'ok' },
  stats: {
    erroredIds: [],
  },
});

function errorsReducer(state = initialState, action) {
  switch (action.type) {
    case SET_CRITICAL_ERROR:
      return state.set('criticalError', fromJS({ ...action.error }));
    case SET_NON_CRITICAL_ERROR:
      return state.set(
        'nonCriticalError',
        fromJS({ ...action.error, interactionFatal: action.interactionFatal })
      );
    case DISMISS_ERROR:
      return state.set('nonCriticalError', undefined);
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
