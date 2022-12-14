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
  errorHistory: [],
});

function errorsReducer(state = initialState, action) {
  switch (action.type) {
    case ACTIONS.SET_CRITICAL_ERROR:
      return state.set('criticalError', fromJS({ ...action.error }));
    case ACTIONS.SET_SESSION_ENDED_BY_SUPERVISOR:
      return state.set(
        'sessionEnded',
        fromJS({ ...action.response, ...action.error })
      );
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
    case ACTIONS.ADD_ERROR_TO_HISTORY:
      return state.update('errorHistory', (errors) =>
        errors.push(action.error)
      );
    default:
      return state;
  }
}

export default errorsReducer;
