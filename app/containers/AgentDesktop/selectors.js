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

const selectInteractions = createSelector(
  selectAgentDesktopDomain,
  (agentDesktop) => agentDesktop.get('interactions')
);

const getSelectedInteractionId = createSelector(
  selectAgentDesktopDomain,
  (agentDesktop) => agentDesktop.get('selectedInteractionId')
);

const selectSelectedInteraction = createSelector(
  [selectInteractions, getSelectedInteractionId],
  (interactions, selectedInteractionId) => interactions.toJS().filter(
    (interaction) => interaction.interactionId === selectedInteractionId
  )[0]
);

const selectAwaitingDisposition = createSelector(
  selectSelectedInteraction,
  (interaction) => (
    typeof interaction !== 'undefined' &&
    interaction.status === 'wrapup' &&
    interaction.dispositionDetails.forceSelect &&
    interaction.dispositionDetails.selected.length === 0
  )
);

export default selectAgentDesktop;
export {
  selectLogin,
  selectAwaitingDisposition,
};
