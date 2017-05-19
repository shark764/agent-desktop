import { createSelector } from 'reselect';

/**
 * Direct selector to the login state domain
 */
const selectLoginDomain = (state) => state.get('login');
const selectAgentDesktopDomain = (state) => state.get('agentDesktop');

/**
 * Other specific selectors
 */


/**
 * Default selector used by Login
 */

const selectLogin = createSelector(
  selectLoginDomain,
  (substate) => substate.toJS()
);

const selectRefresh = createSelector(
  selectAgentDesktopDomain,
  (substate) => substate.get('refreshRequired')
);

const selectTenant = createSelector(
  selectLoginDomain,
  (substate) => substate.get('tenant').toJS()
);

const selectAgent = createSelector(
  selectLoginDomain,
  (substate) => substate.get('agent').toJS()
);

export default selectLogin;
export {
  selectLoginDomain,
  selectAgentDesktopDomain,
  selectRefresh,
  selectTenant,
  selectAgent,
};
