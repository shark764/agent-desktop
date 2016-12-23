import { createSelector } from 'reselect';

/**
 * Direct selector to the mainContentArea state domain
 */
const selectMainContentAreaDomain = () => (state) => state.get('mainContentArea');
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
 * Other specific selectors
 */


/**
 * Default selector used by MainContentArea
 */

const selectSelectedInteraction = createSelector(
   [selectInteractions, getSelectedInteractionId],
   (interactions, selectedInteractionId) => interactions.toJS().filter(
     (interaction) => interaction.interactionId === selectedInteractionId
   )[0]
 );

const selectMainContentArea = () => createSelector(
  selectMainContentAreaDomain(),
  (substate) => substate.toJS()
);

export default selectMainContentArea;
export {
  selectMainContentArea,
  selectMainContentAreaDomain,
  selectSelectedInteraction,
};
