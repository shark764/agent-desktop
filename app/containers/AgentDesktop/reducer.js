/*
 *
 * AgentDesktop reducer
 *
 */

import { fromJS, List } from 'immutable';
import {
  SET_TENANT_ID,
  SET_DIRECTION,
  SET_PRESENCE,
  SET_AVAILABLE_PRESENCES,
  SET_INTERACTION_STATUS,
  ADD_INTERACTION,
} from './constants';

const initialState = fromJS({
  interactions: new List(),
});

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
        .set('availablePresences', fromJS(action.presences));
    case SET_INTERACTION_STATUS:
      return state
        .set('interactions',
          state.get('interactions').update(
            state.get('interactions').findIndex(
              (interaction) => interaction.get('interactionId') === action.interactionId
            ),
            (interaction) => interaction.set('status', action.newStatus)
          )
        );
    case ADD_INTERACTION:
      return state
        .set('interactions', state.get('interactions').push(fromJS(action.interaction)));
    default:
      return state;
  }
}

export default agentDesktopReducer;
