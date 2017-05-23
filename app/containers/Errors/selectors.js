import { createSelector } from 'reselect';

/**
 * Direct selector to the errors state domain
 */
const selectErrorsDomain = () => (state) => state.get('errors');

/**
 * Other specific selectors
 */

const selectCriticalError = createSelector(
  selectErrorsDomain(),
  (substate) => substate.get('criticalError')
);

export {
  selectCriticalError,
};
