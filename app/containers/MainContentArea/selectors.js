import { createSelector } from 'reselect';

/**
 * Direct selector to the mainContentArea state domain
 */
const selectMainContentAreaDomain = () => (state) => state.get('mainContentArea');

/**
 * Other specific selectors
 */


/**
 * Default selector used by MainContentArea
 */

const selectMainContentArea = () => createSelector(
  selectMainContentAreaDomain(),
  (substate) => substate.toJS()
);

export default selectMainContentArea;
export {
  selectMainContentAreaDomain,
};
