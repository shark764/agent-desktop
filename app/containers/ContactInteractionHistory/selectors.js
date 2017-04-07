import { createSelector } from 'reselect';

import { selectCurrentInteraction } from 'containers/ContactsControl/selectors';

const selectAgentDesktopDomain = (state) => state.get('agentDesktop');

const getSelectedInteractionId = createSelector(
  selectAgentDesktopDomain,
  (agentDesktop) => agentDesktop.get('selectedInteractionId')
);

const selectContact = createSelector(
  [selectCurrentInteraction],
  (currentInteraction) => currentInteraction.contact
);

export {
  getSelectedInteractionId,
  selectContact,
};
