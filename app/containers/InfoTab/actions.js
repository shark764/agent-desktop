/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 *
 * InfoTab actions
 *
 */

import {
  SET_CRM_UNAVAILABLE,
  CLEAR_SEARCH_RESULTS,
  SET_SEARCH_RESULTS,
  CHECK_CONTACT,
  UNCHECK_CONTACT,
  CLEAR_CHECKED_CONTACTS,
  SET_CONTACT_MODE,
  SET_EDITING_CONTACT,
  ADD_NOTIFICATION,
  DISMISS_NOTIFICATION,
  SET_LOADING,
  SET_DELETION_PENDING,
  SET_CONFIRMING_DELETE,
} from './constants';

export function setCRMUnavailable(reason) {
  return {
    type: SET_CRM_UNAVAILABLE,
    reason,
  };
}

export function clearSearchResults() {
  return {
    type: CLEAR_SEARCH_RESULTS,
  };
}

export function setSearchResults(response) {
  return {
    type: SET_SEARCH_RESULTS,
    response,
  };
}

export function checkContact(contact) {
  return {
    type: CHECK_CONTACT,
    contact,
  };
}

export function uncheckContact(contact) {
  return {
    type: UNCHECK_CONTACT,
    contact,
  };
}

export function clearCheckedContacts() {
  return {
    type: CLEAR_CHECKED_CONTACTS,
  };
}

export function setContactMode(contactMode) {
  return {
    type: SET_CONTACT_MODE,
    contactMode,
  };
}

export function setEditingContact(editingContact) {
  return {
    type: SET_EDITING_CONTACT,
    editingContact,
  };
}

export function addNotification(notification) {
  return {
    type: ADD_NOTIFICATION,
    notification,
  };
}

export function dismissNotification(id) {
  return {
    type: DISMISS_NOTIFICATION,
    id,
  };
}

export function setLoading(loading) {
  return {
    type: SET_LOADING,
    loading,
  };
}

export function setDeletionPending(deletionPending) {
  return {
    type: SET_DELETION_PENDING,
    deletionPending,
  };
}

export function setConfirmingDelete(confirmingDelete) {
  return {
    type: SET_CONFIRMING_DELETE,
    confirmingDelete,
  };
}
