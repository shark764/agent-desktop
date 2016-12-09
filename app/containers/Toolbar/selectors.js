import { createSelector } from 'reselect';

/**
 * Direct selector to the toolbar state domain
 */
const selectToolbarDomain = () => (state) => state.get('toolbar');

/**
 * Other specific selectors
 */


/**
 * Default selector used by Toolbar
 */

const selectToolbar = () => createSelector(
  selectToolbarDomain(),
  (substate) => substate.toJS()
);

export default selectToolbar;
export {
  selectToolbarDomain,
};
