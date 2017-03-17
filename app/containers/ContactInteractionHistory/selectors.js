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

const selectContactHistory = createSelector(
  [selectInteractions, getSelectedInteractionId],
  (interactions, selectedInteractionId) => {
    if (selectedInteractionId !== undefined) {
      const selectedInteraction = interactions.toJS().find(
        (interaction) => interaction.interactionId === selectedInteractionId
      );
      if (selectedInteraction !== undefined && selectedInteraction.contact !== undefined) {
        return selectedInteraction.contact.interactionHistory;
      } else {
        return undefined;
      }
    } else {
      return undefined;
    }
  }
);


export {
  getSelectedInteractionId,
  selectContactHistory,
};
