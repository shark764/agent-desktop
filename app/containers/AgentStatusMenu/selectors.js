import { createSelector } from 'reselect';

/**
 * Direct selector to the agentStatusMenu state domain
 */
const selectAgentStatusMenuDomain = () => (state) => state.get('agentStatusMenu');

/**
 * Other specific selectors
 */


/**
 * Default selector used by AgentStatusMenu
 */

const selectAgentStatusMenu = () => createSelector(
  selectAgentStatusMenuDomain(),
  (substate) => substate.toJS()
);

export default selectAgentStatusMenu;
export {
  selectAgentStatusMenuDomain,
};
