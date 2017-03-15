import { createSelector } from 'reselect';

/**
 * Direct selector to the interactionsBar state domain
 */
const selectInteractionsBarDomain = (state) => state.get('interactionsBar');
const selectAgentDesktopDomain = (state) => state.get('agentDesktop');
const selectInteractions = createSelector(
  selectAgentDesktopDomain,
  (agentDesktop) => agentDesktop.get('interactions')
);
const getSelectedInteractionId = createSelector(
  selectAgentDesktopDomain,
  (agentDesktop) => agentDesktop.get('selectedInteractionId')
);

/**
 * Default selector used by InteractionsBar
 */

const selectInteractionsBar = () => createSelector(
  selectInteractionsBarDomain(),
  (substate) => substate.toJS()
);

/**
 * Other specific selectors
 */

const selectActiveNonVoiceInteractions = createSelector(
  selectInteractions,
  (interactions) => interactions.toJS().filter(
    (interaction) => (interaction.status === 'work-accepting' || interaction.status === 'work-accepted' || interaction.status === 'wrapup') && interaction.channelType !== 'voice'
  )
);

const selectActiveVoiceInteraction = createSelector(
  selectInteractions,
  (interactions) => interactions.toJS().find(
    (interaction) => (interaction.status === 'work-accepting' || interaction.status === 'work-accepted' || interaction.status === 'wrapup') && interaction.channelType === 'voice'
  )
);

const selectPendingInteractions = createSelector(
  selectInteractions,
  (interactions) => interactions.toJS().filter((interaction) =>
    // If it's not a voice/email interaction, make sure we have messageHistory before we show it.
    interaction.status === 'work-initiated' && interaction.autoAnswer === false && (interaction.channelType === 'voice' || interaction.channelType === 'email' || interaction.messageHistory !== undefined)
  )
);

export default selectInteractionsBar;
export {
  getSelectedInteractionId,
  selectActiveNonVoiceInteractions,
  selectActiveVoiceInteraction,
  selectPendingInteractions,
};
