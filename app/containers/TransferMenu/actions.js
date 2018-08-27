import * as ACTIONS from './constants';

export function setResourceCapactiy(resourceCapacity) {
  return {
    type: ACTIONS.SET_RESOURCE_CAPACITY,
    resourceCapacity,
  };
}

export function setUsers(users) {
  return {
    type: ACTIONS.SET_USERS,
    users,
  };
}
