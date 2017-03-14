import { createSelector } from 'reselect';

/**
 * Direct selector to the toolbar state domain
 */
const selectToolbarDomain = () => (state) => state.get('toolbar');

/**
 * Other specific selectors
 */

const selectAgentDesktopDomain = (state) => state.get('agentDesktop');

const selectQueues = createSelector(
   selectAgentDesktopDomain,
   (agentDesktop) => agentDesktop.get('queues').toJS()
 );

const selectLoginDomain = (state) => state.get('login');

const selectCurrentAgent = createSelector(
  selectLoginDomain,
  (login) => login.get('agent').toJS()
);

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
  selectQueues,
  selectCurrentAgent,
};
