import { createSelector } from 'reselect';

/**
 * Direct selector to the sidePanel state domain
 */
const selectSidePanelDomain = () => (state) => state.get('sidePanel');

/**
 * Other specific selectors
 */


/**
 * Default selector used by SidePanel
 */

const selectSidePanel = () => createSelector(
  selectSidePanelDomain(),
  (substate) => substate.toJS()
);

export default selectSidePanel;
export {
  selectSidePanelDomain,
};
