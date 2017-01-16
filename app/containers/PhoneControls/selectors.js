import { createSelector } from 'reselect';

const selectAgentDesktopDomain = (state) => state.get('agentDesktop');
const selectInteractions = createSelector(
  selectAgentDesktopDomain,
  (agentDesktop) => agentDesktop.get('interactions')
);

const selectActiveVoiceInteractionId = createSelector(
   [selectInteractions],
   (interactions) => {
     const activeVoiceInteraction = interactions.toJS().find(
       (interaction) => interaction.channelType === 'voice'
     );
     return activeVoiceInteraction ? activeVoiceInteraction.interactionId : undefined;
   }
 );

export {
  selectActiveVoiceInteractionId,
};
