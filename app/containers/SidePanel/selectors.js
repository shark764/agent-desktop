import { createSelector } from 'reselect';

const selectAgentDesktopDomain = (state) => state.get('agentDesktop');

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

export {
  selectSelectedInteraction,
};
