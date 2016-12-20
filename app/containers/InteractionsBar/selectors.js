import { createSelector } from 'reselect';

/**
 * Direct selector to the interactionsBar state domain
 */
const selectInteractionsBarDomain = (state) => state.get('interactionsBar');
const selectAgentDesktopDomain = (state) => state.get('agentDesktop');
const selectNonVoiceInteractions = createSelector(
  selectAgentDesktopDomain,
  (agentDesktop) => agentDesktop.get('interactions')
);

/**
 * Other specific selectors
 */


/**
 * Default selector used by InteractionsBar
 */

const selectInteractionsBar = () => createSelector(
  selectInteractionsBarDomain(),
  (substate) => substate.toJS()
);

const selectActiveNonVoiceInteractions = () => createSelector(
  selectNonVoiceInteractions,
  (nonVoiceInteractions) => nonVoiceInteractions.toJS().filter(
    (interaction) => interaction.status === 'work-accepted'
  )
);

const selectPendingNonVoiceInteractions = () => createSelector(
  selectNonVoiceInteractions,
  (nonVoiceInteractions) => nonVoiceInteractions.toJS().filter(
    (interaction) => interaction.status === 'work-offer'
  )
);

export default selectInteractionsBar;
export {
  selectPendingNonVoiceInteractions,
  selectActiveNonVoiceInteractions,
};
