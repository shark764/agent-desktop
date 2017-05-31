import { createSelector } from 'reselect';

/**
 * Direct selector to the errors state domain
 */
const selectErrorsDomain = () => (state) => state.get('errors');

/**
 * Other specific selectors
 */

const selectStatsDomain = createSelector(
  selectErrorsDomain(),
  (substate) => substate.get('stats')
);

const selectCriticalError = createSelector(
  selectErrorsDomain(),
  (substate) => substate.get('criticalError')
);

const selectErroredStatIds = createSelector(
  selectStatsDomain,
  (substate) => substate.get('erroredIds').toJS()
);

export {
  selectCriticalError,
  selectErroredStatIds,
};
