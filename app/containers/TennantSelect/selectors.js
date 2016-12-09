import { createSelector } from 'reselect';

/**
 * Direct selector to the tennantSelect state domain
 */
const selectTennantSelectDomain = () => (state) => state.get('tennantSelect');

/**
 * Other specific selectors
 */


/**
 * Default selector used by TennantSelect
 */

const selectTennantSelect = () => createSelector(
  selectTennantSelectDomain(),
  (substate) => substate.toJS()
);

export default selectTennantSelect;
export {
  selectTennantSelectDomain,
};
