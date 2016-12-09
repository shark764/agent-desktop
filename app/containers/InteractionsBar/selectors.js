import { createSelector } from 'reselect';

/**
 * Direct selector to the interactionsBar state domain
 */
const selectInteractionsBarDomain = () => (state) => state.get('interactionsBar');

/**
 * Other specific selectors
 */


/**
 * Default selector used by InteractionsBar
 */

const selectInteractionsBar = () => createSelector(
  selectInteractionsBarDomain(),
  (substate) => substate.toJS()
);

export default selectInteractionsBar;
export {
  selectInteractionsBarDomain,
};
