/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 *
 * Toolbar reducer
 *
 */

import { fromJS } from 'immutable';
import * as ACTIONS from './constants';

const initialState = fromJS({
  resourceCapacity: undefined,
  users: undefined,
  transferLists: ['loading'],
  queuesListVisibleState: undefined,
  agentsListVisibleState: undefined,
  transferListsVisibleState: {},
});

export default function(state = initialState, action) {
  switch (action.type) {
    case ACTIONS.SET_RESOURCE_CAPACITY: {
      return state.set('resourceCapacity', fromJS(action.resourceCapacity));
    }
    case ACTIONS.SET_USERS: {
      return state.set('users', fromJS(action.users));
    }
    case ACTIONS.GET_AND_SET_TRANSFER_LISTS: {
      return state.set('transferLists', fromJS(action.transferLists));
    }
    case ACTIONS.SET_QUEUES_LIST_VISIBLE_STATE: {
      return state.set('queuesListVisibleState', action.queuesListVisibleState);
    }
    case ACTIONS.SET_AGENTS_LIST_VISIBLE_STATE: {
      return state.set('agentsListVisibleState', action.agentsListVisibleState);
    }
    case ACTIONS.SET_TRANSFER_LIST_VISIBLE_STATE: {
      return state.set(
        'transferListsVisibleState',
        fromJS(action.transferListsVisibleState)
      );
    }
    default:
      return state;
  }
}
