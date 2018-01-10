/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 *
 * InfoTab actions
 *
 */

import * as ACTIONS from './constants';

export function setCRMUnavailable(reason) {
  return {
    type: ACTIONS.SET_CRM_UNAVAILABLE,
    reason,
  };
}

export function clearSearchResults() {
  return {
    type: ACTIONS.CLEAR_SEARCH_RESULTS,
  };
}

export function setSearchResults(response) {
  return {
    type: ACTIONS.SET_SEARCH_RESULTS,
    response,
  };
}

export function checkContact(contact) {
  return {
    type: ACTIONS.CHECK_CONTACT,
    contact,
  };
}

export function uncheckContact(contact) {
  return {
    type: ACTIONS.UNCHECK_CONTACT,
    contact,
  };
}

export function clearCheckedContacts() {
  return {
    type: ACTIONS.CLEAR_CHECKED_CONTACTS,
  };
}

export function addNotification(notification) {
  return {
    type: ACTIONS.ADD_NOTIFICATION,
    notification,
  };
}

export function addOneTimeNotification(oneTimeNotification) {
  return {
    type: ACTIONS.ADD_ONE_TIME_NOTIFICATION,
    oneTimeNotification,
  };
}

export function dismissNotification(id) {
  return {
    type: ACTIONS.DISMISS_NOTIFICATION,
    id,
  };
}

export function setLoading(loading) {
  return {
    type: ACTIONS.SET_LOADING,
    loading,
  };
}

export function setDeletionPending(deletionPending) {
  return {
    type: ACTIONS.SET_DELETION_PENDING,
    deletionPending,
  };
}

export function setConfirmingDelete(confirmingDelete) {
  return {
    type: ACTIONS.SET_CONFIRMING_DELETE,
    confirmingDelete,
  };
}

export function setSearchPending(searchPending) {
  return {
    type: ACTIONS.SET_SEARCH_PENDING,
    searchPending,
  };
}

export function validateContactLayoutTranslations() {
  return {
    type: ACTIONS.VALIDATE_CONTACT_LAYOUT_TRANSLATIONS,
  };
}
