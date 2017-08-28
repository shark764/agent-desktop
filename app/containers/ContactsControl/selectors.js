/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import { createSelector } from 'reselect';
import { getSelectedInteraction } from 'containers/AgentDesktop/selectors';

/**
 * Direct selector to the contactsControl state domain
 */
const selectContactsControlDomain = () => (state) => state.get('contactsControl');

/**
 * Other specific selectors
 */

const selectSidePanelDomain = (state) => state.get('sidePanel');
const selectAgentDesktopDomain = (state) => state.get('agentDesktop');

const selectAttributes = createSelector(selectSidePanelDomain, (sidePanel) =>
  sidePanel.get('contactAttributes').toJS()
);

const selectNoInteractionContactPanelContactsData = createSelector(
  selectAgentDesktopDomain,
  (agentDesktop) => agentDesktop.get('noInteractionContactPanel')
);

const getSelectedInteractionIsCreatingNewInteraction = createSelector(
  getSelectedInteraction,
  (selectedInteraction) =>
    selectedInteraction !== undefined &&
    selectedInteraction.interactionId === 'creating-new-interaction'
);

const selectShowCancelDialog = createSelector(
  selectContactsControlDomain(),
  (activeContactForm) => activeContactForm.get('showCancelDialog')
);

const selectShowConfirmDialog = createSelector(
  selectContactsControlDomain(),
  (activeContactForm) => activeContactForm.get('showConfirmDialog')
);

const selectCurrentInteraction = createSelector(
  [getSelectedInteraction, selectNoInteractionContactPanelContactsData],
  (selectedInteraction, floatingNoInteractionData) => {
    if (selectedInteraction) {
      return selectedInteraction;
    } else {
      return floatingNoInteractionData.toJS();
    }
  }
);

const selectContactMode = createSelector(
  selectCurrentInteraction,
  (currentInteraction) => currentInteraction.contactMode
);

const selectActiveContactForm = createSelector(
  selectCurrentInteraction,
  (currentInteraction) => currentInteraction.activeContactForm
);

const selectFormIsDirty = createSelector(
  selectActiveContactForm,
  (activeContactForm) => activeContactForm.formIsDirty
);

const selectFormValidity = createSelector(
  selectActiveContactForm,
  (activeContactForm) => activeContactForm.formIsValid
);

const selectContactForm = createSelector(
  selectActiveContactForm,
  (activeContactForm) => activeContactForm.contactForm
);

const selectFormErrors = createSelector(
  selectActiveContactForm,
  (activeContactForm) => activeContactForm.formErrors
);

const selectShowErrors = createSelector(
  selectActiveContactForm,
  (activeContactForm) => activeContactForm.showErrors
);

const selectUnusedFields = createSelector(
  selectActiveContactForm,
  (activeContactForm) => activeContactForm.unusedFields
);

const selectSelectedIndexes = createSelector(
  selectActiveContactForm,
  (activeContactForm) => activeContactForm.selectedIndexes
);

const selectEditingContacts = createSelector(
  selectActiveContactForm,
  (activeContactForm) => activeContactForm.editingContacts
);

const selectContactSaveLoading = createSelector(
  selectActiveContactForm,
  (activeContactForm) => activeContactForm.saveLoading
);

/**
 * Default selector used by ContactsControl
 */

const selectContactsControl = () =>
  createSelector(selectContactsControlDomain(), (substate) => substate.toJS());

export default selectContactsControl;
export {
  selectContactsControlDomain,
  selectAttributes,
  getSelectedInteractionIsCreatingNewInteraction,
  selectShowCancelDialog,
  selectShowConfirmDialog,
  selectFormIsDirty,
  selectFormValidity,
  selectContactForm,
  selectFormErrors,
  selectShowErrors,
  selectUnusedFields,
  selectSelectedIndexes,
  selectEditingContacts,
  selectContactSaveLoading,
  selectContactMode,
};
