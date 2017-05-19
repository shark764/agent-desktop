import { createSelector } from 'reselect';

/**
 * Direct selector to the contactsControl state domain
 */
const selectContactsControlDomain = () => (state) => state.get('contactsControl');

/**
 * Other specific selectors
 */

const selectSidePanelDomain = (state) => state.get('sidePanel');
const selectAgentDesktopDomain = (state) => state.get('agentDesktop');

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

const selectShowCancelDialog = createSelector(
  selectContactsControlDomain(),
  (contactsControl) => contactsControl.get('showCancelDialog')
);

const selectFormIsDirty = createSelector(
  selectContactsControlDomain(),
  (contactsControl) => contactsControl.get('formIsDirty')
);

const selectFormValidity = createSelector(
  selectContactsControlDomain(),
  (contactsControl) => contactsControl.get('formIsValid')
);

const selectContactForm = createSelector(
  selectContactsControlDomain(),
  (contactsControl) => contactsControl.get('contactForm').toJS()
);

const selectFormErrors = createSelector(
  selectContactsControlDomain(),
  (contactsControl) => contactsControl.get('formErrors').toJS()
);

const selectShowErrors = createSelector(
  selectContactsControlDomain(),
  (contactsControl) => contactsControl.get('showErrors').toJS()
);

/**
 * Default selector used by ContactsControl
 */

const selectContactsControl = () => createSelector(
  selectContactsControlDomain(),
  (substate) => substate.toJS()
);

export default selectContactsControl;
export {
  selectContactsControlDomain,
  selectAttributes,
  selectCurrentInteraction,
  selectShowCancelDialog,
  selectFormIsDirty,
  selectFormValidity,
  selectContactForm,
  selectFormErrors,
  selectShowErrors,
};
