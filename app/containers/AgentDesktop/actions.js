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
  ADD_MESSAGE,
  SET_INTERACTION_STATUS,
  REMOVE_INTERACTION,
  SELECT_INTERACTION,
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
