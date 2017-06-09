/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import { createSelector } from 'reselect';
import { selectSelectedInteraction } from 'containers/AgentDesktop/selectors';

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

const selectNoInteractionContactPanelContactsData = createSelector(
 selectAgentDesktopDomain,
 (agentDesktop) => agentDesktop.get('noInteractionContactPanel')
);

const getSelectedInteractionIsCreatingNewInteraction = createSelector(
  selectSelectedInteraction,
  (selectedInteraction) =>
    selectedInteraction !== undefined
      && selectedInteraction.interactionId === 'creating-new-interaction'
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

const selectShowConfirmDialog = createSelector(
  selectContactsControlDomain(),
  (contactsControl) => contactsControl.get('showConfirmDialog')
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
  getSelectedInteractionIsCreatingNewInteraction,
  selectCurrentInteraction,
  selectShowCancelDialog,
  selectShowConfirmDialog,
  selectFormIsDirty,
  selectFormValidity,
  selectContactForm,
  selectFormErrors,
  selectShowErrors,
};
