/*
 *
 * AgentDesktop reducer
 *
 */

import { fromJS } from 'immutable';
import {
  SET_TENANT_ID,
  SET_DIRECTION,
  SET_PRESENCE,
  SET_AVAILABLE_PRESENCES,
} from './constants';

const initialState = fromJS({});

function agentDesktopReducer(state = initialState, action) {
  switch (action.type) {
    case SET_TENANT_ID:
      return state
        .set('tenantId', action.tenantId);
    case SET_DIRECTION:
      return state
        .set('direction', action.direction);
    case SET_PRESENCE:
      return state
        .set('presence', action.presence);
    case SET_AVAILABLE_PRESENCES:
      return state
        .set('availablePresences', action.presences);
    default:
      return state;
  }
}

export default agentDesktopReducer;
