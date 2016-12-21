import { createSelector } from 'reselect';

/**
 * Direct selector to the interactionsBar state domain
 */
const selectInteractionsBarDomain = (state) => state.get('interactionsBar');
const selectAgentDesktopDomain = (state) => state.get('agentDesktop');
const selectInteractions = createSelector(
  selectAgentDesktopDomain,
  (agentDesktop) => agentDesktop.get('interactions')
);

/**
 * Other specific selectors
 */


/**
 * Default selector used by InteractionsBar
 */

const selectInteractionsBar = () => createSelector(
  selectInteractionsBarDomain(),
  (substate) => substate.toJS()
);

const selectActiveInteractions = createSelector(
  selectInteractions,
  (interactions) => interactions.toJS().filter(
    (interaction) => interaction.status === 'work-accepted'
  )
);

const selectPendingInteractions = createSelector(
  selectInteractions,
  (interactions) => interactions.toJS().filter((interaction) => interaction.status === 'work-offer')
);

export default selectInteractionsBar;
export {
  selectPendingInteractions,
  selectActiveInteractions,
};
