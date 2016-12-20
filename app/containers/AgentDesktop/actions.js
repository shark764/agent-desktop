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
