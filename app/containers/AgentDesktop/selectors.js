import { createSelector } from 'reselect';

const selectLoginMap = (state) => state.get('login');
const selectAgentDesktopMap = (state) => state.get('agentDesktop');

const selectAgentId = createSelector(
  selectLoginMap,
  (login) => login.get('agent').get('userId')
);

const selectInteractions = createSelector(
  selectAgentDesktopMap,
  (agentDesktop) => agentDesktop.get('interactions')
);

const getSelectedInteractionId = createSelector(
  selectAgentDesktopMap,
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


export {
  selectInteractions,
  selectLoginMap,
  selectAgentDesktopMap,
  selectAgentId,
  selectAwaitingDisposition,
};
