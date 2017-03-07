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

const getSelectedInteractionScript = createSelector(
  selectAgentDesktopDomain,
  (agentDesktop) => {
    const selectedInteraction = agentDesktop.get('interactions').toJS().find(
      (interaction) => interaction.interactionId === agentDesktop.get('selectedInteractionId')
    );
    if (selectedInteraction !== undefined) {
      return selectedInteraction.script;
    } else {
      return undefined;
    }
  }
);

export {
  getSelectedInteractionId,
  getSelectedInteractionIsVoice,
  getSelectedInteractionScript,
};
