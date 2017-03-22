import { createSelector } from 'reselect';

import { selectCurrentInteraction } from 'containers/ContactsControl/selectors';

const selectAgentDesktopDomain = (state) => state.get('agentDesktop');

const getSelectedInteractionId = createSelector(
  selectAgentDesktopDomain,
  (agentDesktop) => agentDesktop.get('selectedInteractionId')
);

const selectContactId = createSelector(
  [selectCurrentInteraction],
  (currentInteraction) => currentInteraction.contact && currentInteraction.contact.id
);

const selectContactHistory = createSelector(
  [selectCurrentInteraction],
  (currentInteraction) => currentInteraction.contact && currentInteraction.contact.interactionHistory
);

export {
  getSelectedInteractionId,
  selectContactId,
  selectContactHistory,
};
