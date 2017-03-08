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
const selectSidePanelDomain = (state) => state.get('sidePanel');

const selectAttributes = createSelector(
  selectSidePanelDomain,
  (sidePanel) => sidePanel.get('contactAttributes').toJS()
);

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

const selectNoInteractionContactPanelContactsData = createSelector(
  selectAgentDesktopDomain,
  (agentDesktop) => agentDesktop.get('noInteractionContactPanel')
);

const selectCurrentInteraction = createSelector(
  [selectSelectedInteraction, selectNoInteractionContactPanelContactsData],
  (selectedInteraction, floatingNoInteractionData) => {
    if (selectedInteraction) {
      return selectedInteraction;
    } else {
      return floatingNoInteractionData.toJS();
    }
  }
);


export {
  selectContactsControlDomain,
  selectAttributes,
  selectCurrentInteraction,
};
