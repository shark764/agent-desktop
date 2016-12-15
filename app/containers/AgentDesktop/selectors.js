import { createSelector } from 'reselect';

/**
 * Direct selector to the agentDesktop state domain
 */
const selectAgentDesktopDomain = () => (state) => state;

/**
 * Other specific selectors
 */


/**
 * Default selector used by AgentDesktop
 */

const selectAgentDesktop = () => createSelector(
  selectAgentDesktopDomain(),
  (substate) => substate.toJS()
);

export default selectAgentDesktop;
export {
  selectAgentDesktopDomain,
};
