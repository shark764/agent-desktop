import { createSelector } from 'reselect';

/**
 * Direct selector to the agentDesktop state domain
 */

const selectLoginDomain = (state) => state.get('login');
const selectAgentDesktopDomain = (state) => state.get('agentDesktop');

const selectLogin = createSelector(
  selectLoginDomain,
  (substate) => substate.toJS()
);

const selectAgentDesktop = createSelector(
  selectAgentDesktopDomain,
  (substate) => substate.toJS()
);


export default selectAgentDesktop;
export {
  selectLogin,
};
