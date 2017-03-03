import { createSelector } from 'reselect';

/**
 * Direct selector to the agentScript state domain
 */
const selectAgentScriptDomain = () => (state) => state.get('agentScript');

/**
 * Other specific selectors
 */


/**
 * Default selector used by AgentScript
 */

const selectAgentScript = () => createSelector(
  selectAgentScriptDomain(),
  (substate) => substate.toJS()
);

export default selectAgentScript;
export {
  selectAgentScriptDomain,
};
