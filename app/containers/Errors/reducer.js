/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 *
 * Errors reducer
 *
 */

import { fromJS } from 'immutable';
import * as ACTIONS from './constants';

const initialState = fromJS({
  // criticalError: { genericError: 'ok' },
  stats: {
    erroredIds: [],
  },
});

function errorsReducer(state = initialState, action) {
  switch (action.type) {
    case ACTIONS.SET_CRITICAL_ERROR:
      return state.set('criticalError', fromJS({ ...action.error }));
    case ACTIONS.SET_NON_CRITICAL_ERROR:
      return state.set(
        'nonCriticalError',
        fromJS({ ...action.error, interactionFatal: action.interactionFatal })
      );
    case ACTIONS.DISMISS_ERROR:
      return state.set('nonCriticalError', undefined);
    case ACTIONS.ADD_STAT_ERROR_ID:
      return state.updateIn(['stats', 'erroredIds'], (erroredStatIds) =>
        erroredStatIds.push(action.statId)
      );
    case ACTIONS.REMOVE_STAT_ERROR_ID:
      return state.updateIn(['stats', 'erroredIds'], (erroredStatIds) =>
        erroredStatIds.filter((statId) => statId !== action.statId)
      );
    default:
      return state;
  }
}

export default errorsReducer;
