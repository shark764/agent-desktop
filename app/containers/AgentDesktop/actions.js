/*
 *
 * AgentDesktop actions
 *
 */

import {
  SET_TENANT_ID,
  SET_DIRECTION,
  SET_PRESENCE,
  SET_AVAILABLE_PRESENCES,
  ADD_INTERACTION,
  SET_MESSAGE_HISTORY,
  ADD_MESSAGE,
  SET_INTERACTION_STATUS,
  REMOVE_INTERACTION,
  SELECT_INTERACTION,
  SET_CUSTOM_FIELDS,
  EMAIL_CREATE_REPLY,
  EMAIL_CANCEL_REPLY,
} from './constants';

export function setTenantId(tenantId) {
  return {
    type: SET_TENANT_ID,
    tenantId,
  };
}

export function setDirection(direction) {
  return {
    type: SET_DIRECTION,
    direction,
  };
}

export function setPresence(presence) {
  return {
    type: SET_PRESENCE,
    presence,
  };
}

export function setAvailablePresences(presences) {
  return {
    type: SET_AVAILABLE_PRESENCES,
    presences,
  };
}

export function addInteraction(interaction) {
  return {
    type: ADD_INTERACTION,
    interaction,
  };
}

export function setMessageHistory(interactionId, messageHistoryItems) {
  return {
    type: SET_MESSAGE_HISTORY,
    interactionId,
    messageHistoryItems,
  };
}

export function addMessage(interactionId, message) {
  return {
    type: ADD_MESSAGE,
    interactionId,
    message,
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
