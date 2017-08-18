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
  ADD_NOTIFICATION,
  DISMISS_NOTIFICATION,
  SET_LOADING,
  SET_DELETION_PENDING,
  SET_CONFIRMING_DELETE,
  SET_SEARCH_PENDING,
  VALIDATE_CONTACT_LAYOUT_TRANSLATIONS,
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

export function setSearchPending(searchPending) {
  return {
    type: SET_SEARCH_PENDING,
    searchPending,
  };
}

export function validateContactLayoutTranslations() {
  return {
    type: VALIDATE_CONTACT_LAYOUT_TRANSLATIONS,
  };
}
