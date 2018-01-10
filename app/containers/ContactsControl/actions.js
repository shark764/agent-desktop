/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 *
 * ContactsControl actions
 *
 */

import * as ACTIONS from './constants';

export function setShowCancelDialog(showCancelDialog) {
  return {
    type: ACTIONS.SET_SHOW_CANCEL_DIALOG,
    showCancelDialog,
  };
}

export function setShowConfirmDialog(showConfirmDialog) {
  return {
    type: ACTIONS.SET_SHOW_CONFIRM_DIALOG,
    showConfirmDialog,
  };
}

export function editContact(interactionId, contact) {
  return {
    type: ACTIONS.EDIT_CONTACT,
    interactionId,
    contact,
  };
}

export function mergeContacts(interactionId) {
  return {
    type: ACTIONS.MERGE_CONTACTS,
    interactionId,
  };
}

export function newContact(interactionId) {
  return {
    type: ACTIONS.NEW_CONTACT,
    interactionId,
  };
}

export function submitContactEdit(interactionId) {
  return {
    type: ACTIONS.SUBMIT_CONTACT_EDIT,
    interactionId,
  };
}

export function submitContactCreate(interactionId) {
  return {
    type: ACTIONS.SUBMIT_CONTACT_CREATE,
    interactionId,
  };
}

export function submitContactMerge(interactionId) {
  return {
    type: ACTIONS.SUBMIT_CONTACT_MERGE,
    interactionId,
  };
}

export function addContactNotification(notificationInfo) {
  return {
    type: ACTIONS.ADD_CONTACT_NOTIFICATION,
    notificationInfo,
  };
}

export function addContactErrorNotification(notificationInfo) {
  return {
    type: ACTIONS.ADD_CONTACT_ERROR_NOTIFICATION,
    notificationInfo,
  };
}
