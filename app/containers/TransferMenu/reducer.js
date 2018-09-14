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
});

export default function(state = initialState, action) {
  switch (action.type) {
    case ACTIONS.SET_RESOURCE_CAPACITY: {
      return state.set('resourceCapacity', fromJS(action.resourceCapacity));
    }
    case ACTIONS.SET_USERS: {
      return state.set('users', fromJS(action.users));
    }
    default:
      return state;
  }
}
