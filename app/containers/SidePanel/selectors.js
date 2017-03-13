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

const getSelectedInteraction = createSelector(
  [selectInteractions, getSelectedInteractionId],
  (interactions, selectedInteractionId) => {
    const selectedInteraction = interactions.toJS().find(
      (interaction) => interaction.interactionId === selectedInteractionId
    );
    return selectedInteraction;
  }
);

const getSelectedInteractionIsVoice = createSelector(
  getSelectedInteraction,
  (selectedInteraction) =>
    selectedInteraction !== undefined && selectedInteraction.channelType === 'voice'
);

const getSelectedInteractionScript = createSelector(
  getSelectedInteraction,
  (selectedInteraction) => {
    if (selectedInteraction !== undefined) {
      return selectedInteraction.script;
    } else {
      return undefined;
    }
  }
);

const getHasAssignedContact = createSelector(
  getSelectedInteraction,
  (selectedInteraction) =>
    selectedInteraction !== undefined && selectedInteraction.contact !== undefined
);

export {
  getSelectedInteractionId,
  getSelectedInteractionIsVoice,
  getSelectedInteractionScript,
  getHasAssignedContact,
};
