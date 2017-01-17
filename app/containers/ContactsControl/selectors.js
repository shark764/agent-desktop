import { createSelector } from 'reselect';

/**
 * Direct selector to the contactsControl state domain
 */
const selectContactsControlDomain = () => (state) => state.get('contactsControl');

/**
 * Default selector used by ContactsControl
 */

const selectContactsControl = createSelector(
  selectContactsControlDomain(),
  (substate) => substate.toJS()
);


export default selectContactsControl;

/**
 * Other specific selectors
 */

const selectAgentDesktopDomain = (state) => state.get('agentDesktop');

const selectInteractions = createSelector(
  selectAgentDesktopDomain,
  (agentDesktop) => agentDesktop.get('interactions')
);

const getSelectedInteractionId = createSelector(
  selectAgentDesktopDomain,
  (agentDesktop) => agentDesktop.get('selectedInteractionId')
);

const selectSelectedInteraction = createSelector(
  [selectInteractions, getSelectedInteractionId],
  (interactions, selectedInteractionId) => interactions.toJS().filter(
    (interaction) => interaction.interactionId === selectedInteractionId
  )[0]
);

export {
selectContactsControlDomain,
selectSelectedInteraction,
};
