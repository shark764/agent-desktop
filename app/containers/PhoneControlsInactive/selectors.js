import { createSelector } from 'reselect';

const selectAgentDesktopDomain = (state) => state.get('agentDesktop');

const selectHasConnectingOutboundVoiceInteraction = createSelector(
  selectAgentDesktopDomain,
  (agentDesktop) => agentDesktop.get('interactions').toJS().find(
    (interaction) => interaction.channelType === 'voice' && interaction.direction === 'outbound' && interaction.status !== 'work-accepted'
  ) !== undefined
);

export {
  selectHasConnectingOutboundVoiceInteraction,
};
