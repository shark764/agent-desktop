import { createSelector } from 'reselect';

const selectAgentDesktopDomain = (state) => state.get('agentDesktop');

const selectIsAgentReady = createSelector(
  selectAgentDesktopDomain,
  (agentDesktop) => agentDesktop.get('presence') === 'ready'
);

const selectHasConnectingOutboundVoiceInteraction = createSelector(
  selectAgentDesktopDomain,
  (agentDesktop) => agentDesktop.get('interactions').toJS().find(
    (interaction) => interaction.channelType === 'voice' && interaction.direction === 'outbound' && interaction.status !== 'work-accepted'
  ) !== undefined
);

export {
  selectIsAgentReady,
  selectHasConnectingOutboundVoiceInteraction,
};
