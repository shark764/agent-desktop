/*
 *
 * AgentDesktop actions
 *
 */

import {
  SET_PRESENCE,
  ADD_INTERACTION,
  SET_MESSAGE_HISTORY,
  ASSIGN_CONTACT,
  ADD_MESSAGE,
  SET_INTERACTION_STATUS,
  REMOVE_INTERACTION,
  SELECT_INTERACTION,
  SET_CUSTOM_FIELDS,
  MUTE_CALL,
  UNMUTE_CALL,
  HOLD_CALL,
  RESUME_CALL,
  EMAIL_CREATE_REPLY,
  EMAIL_CANCEL_REPLY,
} from './constants';

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
