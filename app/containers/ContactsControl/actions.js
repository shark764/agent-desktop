/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 *
 * ContactsControl actions
 *
 */

import {
  SET_SHOW_CANCEL_DIALOG,
  SET_SHOW_CONFIRM_DIALOG,
  EDIT_CONTACT,
  MERGE_CONTACTS,
  NEW_CONTACT,
  SUBMIT_CONTACT_EDIT,
  SUBMIT_CONTACT_CREATE,
  SUBMIT_CONTACT_MERGE,
  ADD_CONTACT_NOTIFICATION,
  ADD_CONTACT_ERROR_NOTIFICATION,
} from './constants';

export function setShowCancelDialog(showCancelDialog) {
  return {
    type: SET_SHOW_CANCEL_DIALOG,
    showCancelDialog,
  };
}

export function setShowConfirmDialog(showConfirmDialog) {
  return {
    type: SET_SHOW_CONFIRM_DIALOG,
    showConfirmDialog,
  };
}

export function editContact(interactionId, contact) {
  return {
    type: EDIT_CONTACT,
    interactionId,
    contact,
  };
}

export function mergeContacts(interactionId) {
  return {
    type: MERGE_CONTACTS,
    interactionId,
  };
}

export function newContact(interactionId) {
  return {
    type: NEW_CONTACT,
    interactionId,
  };
}

export function submitContactEdit(interactionId) {
  return {
    type: SUBMIT_CONTACT_EDIT,
    interactionId,
  };
}

export function submitContactCreate(interactionId) {
  return {
    type: SUBMIT_CONTACT_CREATE,
    interactionId,
  };
}

export function submitContactMerge(interactionId) {
  return {
    type: SUBMIT_CONTACT_MERGE,
    interactionId,
  };
}

export function addContactNotification(notificationInfo) {
  return {
    type: ADD_CONTACT_NOTIFICATION,
    notificationInfo,
  };
}

export function addContactErrorNotification(notificationInfo) {
  return {
    type: ADD_CONTACT_ERROR_NOTIFICATION,
    notificationInfo,
  };
}
