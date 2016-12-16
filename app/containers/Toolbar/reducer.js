/*
 *
 * Toolbar reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  SHOW_AGENT_STATUS_MENU,
} from './constants';

const initialState = fromJS({ showAgentStatusMenu: false });

function toolbarReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case SHOW_AGENT_STATUS_MENU:
      return state
        .set('agentStatusMenu', action.show);
    default:
      return state;
  }
}

export default toolbarReducer;
