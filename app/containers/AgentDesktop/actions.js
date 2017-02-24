/*
 *
 * AgentDesktop actions
 *
 */

import {
  SET_EXTENSIONS,
  SET_ACTIVE_EXTENSION,
  SET_PRESENCE,
  ADD_INTERACTION,
  WORK_INITIATED,
  SET_INTERACTION_QUERY,
  SET_MESSAGE_HISTORY,
  SET_CONTACT_ACTION,
  ASSIGN_CONTACT,
  UPDATE_CONTACT,
  ADD_MESSAGE,
  SET_INTERACTION_STATUS,
  ADD_SEARCH_FILTER,
  REMOVE_SEARCH_FILTER,
  REMOVE_INTERACTION,
  SELECT_INTERACTION,
  SET_CUSTOM_FIELDS,
  START_WARM_TRANSFERRING,
  TRANSFER_CANCELLED,
  TRANSFER_CONNECTED,
  MUTE_CALL,
  UNMUTE_CALL,
  HOLD_CALL,
  RESUME_CALL,
  RECORD_CALL,
  STOP_RECORD_CALL,
  EMAIL_CREATE_REPLY,
  EMAIL_CANCEL_REPLY,
  UPDATE_NOTE,
} from './constants';

export function setExtensions(response) {
  return {
    type: SET_EXTENSIONS,
    response,
  };
}

export function setActiveExtension(activeExtension) {
  return {
    type: SET_ACTIVE_EXTENSION,
    activeExtension,
  };
}

export function setPresence(response) {
  return {
    type: SET_PRESENCE,
    response,
  };
}

export function addInteraction(response) {
  return {
    type: ADD_INTERACTION,
    response,
  };
}

export function workInitiated(response) {
  return {
    type: WORK_INITIATED,
    response,
  };
}
export function setInteractionQuery(interactionId, query) {
  return {
    type: SET_INTERACTION_QUERY,
    interactionId,
    query,
  };
}
export function addSearchFilter(filterName, value) {
  return {
    type: ADD_SEARCH_FILTER,
    filterName,
    value,
  };
}
export function removeSearchFilter(filterName) {
  return {
    type: REMOVE_SEARCH_FILTER,
    filterName,
  };
}

export function setContactAction(interactionId, newAction) {
  return {
    type: SET_CONTACT_ACTION,
    interactionId,
    newAction,
  };
}

export function setMessageHistory(response) {
  return {
    type: SET_MESSAGE_HISTORY,
    response,
  };
}

export function assignContact(interactionId, contact) {
  return {
    type: ASSIGN_CONTACT,
    interactionId,
    contact,
  };
}

export function updateContact(updatedContact) {
  return {
    type: UPDATE_CONTACT,
    updatedContact,
  };
}

export function addMessage(response) {
  return {
    type: ADD_MESSAGE,
    response,
  };
}

export function setInteractionStatus(interactionId, newStatus) {
  return {
    type: SET_INTERACTION_STATUS,
    interactionId,
    newStatus,
  };
}

export function removeInteraction(interactionId) {
  return {
    type: REMOVE_INTERACTION,
    interactionId,
  };
}

export function selectInteraction(interactionId) {
  return {
    type: SELECT_INTERACTION,
    interactionId,
  };
}

export function setCustomFields(interactionId, customFields) {
  return {
    type: SET_CUSTOM_FIELDS,
    interactionId,
    customFields,
  };
}

export function startWarmTransferring(interactionId, transferringTo) {
  return {
    type: START_WARM_TRANSFERRING,
    interactionId,
    transferringTo,
  };
}

export function transferCancelled(interactionId) {
  return {
    type: TRANSFER_CANCELLED,
    interactionId,
  };
}

export function transferConnected(interactionId) {
  return {
    type: TRANSFER_CONNECTED,
    interactionId,
  };
}

export function muteCall(interactionId) {
  return {
    type: MUTE_CALL,
    interactionId,
  };
}

export function unmuteCall(interactionId) {
  return {
    type: UNMUTE_CALL,
    interactionId,
  };
}

export function holdCall(interactionId) {
  return {
    type: HOLD_CALL,
    interactionId,
  };
}

export function resumeCall(interactionId) {
  return {
    type: RESUME_CALL,
    interactionId,
  };
}

export function recordCall(interactionId) {
  return {
    type: RECORD_CALL,
    interactionId,
  };
}

export function stopRecordCall(interactionId) {
  return {
    type: STOP_RECORD_CALL,
    interactionId,
  };
}

export function emailCreateReply(interactionId) {
  return {
    type: EMAIL_CREATE_REPLY,
    interactionId,
  };
}

export function emailCancelReply(interactionId) {
  return {
    type: EMAIL_CANCEL_REPLY,
    interactionId,
  };
}

export function updateNote(interactionId, note) {
  return {
    type: UPDATE_NOTE,
    interactionId,
    note,
  };
}
