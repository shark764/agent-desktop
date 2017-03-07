import { createSelector } from 'reselect';

const selectAgentDesktopDomain = (state) => state.get('agentDesktop');

const getSelectedInteractionId = createSelector(
  selectAgentDesktopDomain,
  (agentDesktop) => agentDesktop.get('selectedInteractionId')
);

const getSelectedInteractionIsVoice = createSelector(
  selectAgentDesktopDomain,
  (agentDesktop) => {
    const selectedInteraction = agentDesktop.get('interactions').toJS().find(
      (interaction) => interaction.interactionId === agentDesktop.get('selectedInteractionId')
    );
    return selectedInteraction !== undefined && selectedInteraction.channelType === 'voice';
  }
);

export {
  getSelectedInteractionId,
  getSelectedInteractionIsVoice,
};
